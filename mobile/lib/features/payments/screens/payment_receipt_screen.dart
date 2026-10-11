import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';

class PaymentReceiptScreen extends ConsumerStatefulWidget {
  final int courseId;
  final String courseTitle;
  final double amount;

  const PaymentReceiptScreen({
    super.key,
    required this.courseId,
    required this.courseTitle,
    required this.amount,
  });

  @override
  ConsumerState<PaymentReceiptScreen> createState() => _PaymentReceiptScreenState();
}

class _PaymentReceiptScreenState extends ConsumerState<PaymentReceiptScreen> {
  String selectedMethod = 'instapay';
  final TextEditingController accountController = TextEditingController();
  final TextEditingController refController = TextEditingController();
  File? receiptImage;
  bool isSubmitting = false;

  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    final XFile? picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (picked != null) {
      setState(() {
        receiptImage = File(picked.path);
      });
    }
  }

  Future<void> _submitReceipt() async {
    if (accountController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى إدخال رقم الحساب أو المحفظة المحول منها')),
      );
      return;
    }

    if (receiptImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى اختيار صورة إشعار أو إيصال التحويل')),
      );
      return;
    }

    setState(() => isSubmitting = true);

    try {
      final fileName = receiptImage!.path.split('/').last;
      final formData = FormData.fromMap({
        'course_id': widget.courseId,
        'amount': widget.amount,
        'method': selectedMethod,
        'sender_account_or_number': accountController.text.trim(),
        'transaction_ref': refController.text.trim(),
        'receipt_image': await MultipartFile.fromFile(
          receiptImage!.path,
          filename: fileName,
        ),
      });

      final response = await ApiClient().dio.post(
        '/payments/submit-receipt',
        data: formData,
      );

      if (!mounted) return;

      if (response.statusCode == 201) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => Directionality(
            textDirection: TextDirection.rtl,
            child: AlertDialog(
              title: const Text('تم استلام الإيصال بنجاح'),
              content: const Text(
                'تم رفع إيصال التحويل وسيتم مراجعته وتفعيل اشتراكك في الدورة خلال ساعات قليلة.',
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text('حسناً'),
                ),
              ],
            ),
          ),
        );
      }
    } on DioException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطأ في إرسال الإيصال: ${e.response?.data?['message'] ?? e.message}')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطأ في إرسال الإيصال: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = ref.watch(themeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('إرسال إيصال التحويل البنكي'),
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'سداد رسوم: ${widget.courseTitle}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Text(
                'المبلغ المطلوب: ${widget.amount.toStringAsFixed(0)} ${themeState.currencySymbol}',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: themeState.primaryColor,
                ),
              ),
              const SizedBox(height: 20),

              const Text('اختر وسيلة التحويل:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: [
                  _methodChip('instapay', 'InstaPay'),
                  const SizedBox(width: 8),
                  _methodChip('vodafone_cash', 'فودافون كاش'),
                  const SizedBox(width: 8),
                  _methodChip('fawry', 'فوري'),
                ],
              ),
              const SizedBox(height: 16),

              const Text('رقم الحساب / الهاتف المحول منه:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: accountController,
                decoration: const InputDecoration(
                  hintText: 'مثال: 01001234567 أو user@instapay',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 14),

              const Text('الرقم المرجعي للعملية (اختياري):', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: refController,
                decoration: const InputDecoration(
                  hintText: 'مثال: REF-8761234',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),

              const Text('صورة إشعار أو إيصال التحويل:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickImage,
                child: Container(
                  width: double.infinity,
                  height: 140,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: Colors.grey.shade400, style: BorderStyle.solid),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: receiptImage != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.file(receiptImage!, fit: BoxFit.cover),
                        )
                      : const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.cloud_upload_outlined, size: 40, color: Colors.grey),
                            SizedBox(height: 8),
                            Text('انقر لاختيار صورة الإيصال من الاستوديو', style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 28),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: themeState.primaryColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: isSubmitting ? null : _submitReceipt,
                  child: isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('إرسال الإيصال للمراجعة والاعتماد', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _methodChip(String key, String label) {
    final themeState = ref.watch(themeProvider);
    final isSelected = selectedMethod == key;

    return Expanded(
      child: ChoiceChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: themeState.primaryColor.withValues(alpha: 0.15),
        labelStyle: TextStyle(
          color: isSelected ? themeState.primaryColor : Colors.black87,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        onSelected: (_) => setState(() => selectedMethod = key),
      ),
    );
  }
}
