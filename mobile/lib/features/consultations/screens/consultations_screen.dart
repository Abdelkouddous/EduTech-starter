import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/localization/language_provider.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';
import '../../auth/providers/auth_provider.dart';

final consultationTypesProvider = FutureProvider<List<dynamic>>((ref) async {
  final res = await ApiClient().dio.get('/consultations/types');
  return res.data['data'] as List<dynamic>;
});

final myConsultationsProvider = FutureProvider<List<dynamic>>((ref) async {
  final res = await ApiClient().dio.get('/consultations/my-bookings');
  return res.data['data'] as List<dynamic>;
});

class ConsultationsScreen extends ConsumerStatefulWidget {
  const ConsultationsScreen({super.key});

  @override
  ConsumerState<ConsultationsScreen> createState() => _ConsultationsScreenState();
}

class _ConsultationsScreenState extends ConsumerState<ConsultationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showBookingSheet(BuildContext context, dynamic type) async {
    final theme = ref.read(themeProvider);
    final langNotifier = ref.read(languageProvider.notifier);

    // Fetch available slots
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return FutureBuilder(
          future: ApiClient().dio.get('/consultations/types/${type['id']}/slots'),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox(height: 250, child: Center(child: CircularProgressIndicator()));
            }

            final slots = (snapshot.data?.data['data'] as List<dynamic>?) ?? [];

            return Container(
              padding: const EdgeInsets.all(20),
              constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    type['title'] ?? '',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${type['price']} DZD • ${type['duration_minutes']} min',
                    style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    langNotifier.t('availableSlots'),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(height: 10),
                  if (slots.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 20),
                      child: Center(child: Text('Aucun créneau disponible pour le moment.')),
                    )
                  else
                    Expanded(
                      child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: slots.length,
                        separatorBuilder: (_, __) => const Divider(height: 1),
                        itemBuilder: (context, i) {
                          final slot = slots[i];
                          final startTime = slot['start_time'] != null ? DateTime.parse(slot['start_time']) : null;
                          final formatted = startTime != null
                              ? '${startTime.day}/${startTime.month}/${startTime.year} à ${startTime.hour.toString().padLeft(2, '0')}:${startTime.minute.toString().padLeft(2, '0')}'
                              : 'Date à définir';

                          return ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Icon(Icons.access_time_rounded, color: theme.primaryColor),
                            title: Text(formatted, style: const TextStyle(fontWeight: FontWeight.w600)),
                            trailing: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: theme.primaryColor,
                                foregroundColor: Colors.white,
                              ),
                              onPressed: () async {
                                Navigator.pop(ctx);
                                await _bookSlot(slot['id']);
                              },
                              child: Text(langNotifier.t('bookConsultation')),
                            ),
                          );
                        },
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _bookSlot(int slotId) async {
    try {
      final res = await ApiClient().dio.post('/consultations/book', data: {
        'slot_id': slotId,
        'notes': 'Réservation depuis l\'application mobile EduTech Starter.',
      });

      if (res.data['status'] == 'success') {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.green,
            content: Text(res.data['message'] ?? 'Consultation réservée avec succès !'),
          ),
        );
        ref.invalidate(myConsultationsProvider);
        _tabController.animateTo(1);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.redAccent,
          content: Text('Erreur: ${e.toString()}'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider);
    final langNotifier = ref.read(languageProvider.notifier);
    final theme = ref.watch(themeProvider);
    final typesAsync = ref.watch(consultationTypesProvider);
    final authState = ref.watch(authProvider);

    return Directionality(
      textDirection: lang.direction,
      child: Scaffold(
        appBar: AppBar(
          title: Text(langNotifier.t('consultations'), style: const TextStyle(fontWeight: FontWeight.bold)),
          centerTitle: true,
          bottom: TabBar(
            controller: _tabController,
            labelColor: theme.primaryColor,
            indicatorColor: theme.primaryColor,
            tabs: [
              Tab(text: langNotifier.t('consultationTypes')),
              Tab(text: lang.isArabic ? 'استشاراتي المحجوزة' : 'Mes Rendez-vous'),
            ],
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            // 1. Available Specialists & Consultation Types (K1)
            typesAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(child: Text('Erreur: $err')),
              data: (types) {
                if (types.isEmpty) {
                  return const Center(child: Text('Aucun type de consultation disponible.'));
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: types.length,
                  itemBuilder: (context, i) {
                    final t = types[i];
                    final specialist = t['specialist'] ?? {};

                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 26,
                                  backgroundImage: specialist['avatar'] != null ? NetworkImage(specialist['avatar']) : null,
                                  child: specialist['avatar'] == null ? const Icon(Icons.person) : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        specialist['name'] ?? 'Expert',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                      Text(
                                        specialist['specialization'] ?? '',
                                        style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.amber.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: Colors.amber.shade300),
                                  ),
                                  child: Text(
                                    '${t['price']} DZD',
                                    style: TextStyle(color: Colors.amber.shade900, fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              t['title'] ?? '',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              t['description'] ?? '',
                              style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: theme.primaryColor,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                                icon: const Icon(Icons.calendar_month_rounded, size: 18),
                                label: Text(langNotifier.t('bookConsultation')),
                                onPressed: () {
                                  if (!authState.isAuthenticated) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Veuillez vous connecter pour réserver / يرجى تسجيل الدخول')),
                                    );
                                    return;
                                  }
                                  _showBookingSheet(context, t);
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),

            // 2. Trainee Booked Consultations List (K4, K6)
            if (!authState.isAuthenticated)
              const Center(child: Text('Veuillez vous connecter pour voir vos réservations.'))
            else
              ref.watch(myConsultationsProvider).when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Center(child: Text('Erreur: $err')),
                data: (bookings) {
                  if (bookings.isEmpty) {
                    return const Center(child: Text('Vous n\'avez aucune consultation réservée.'));
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: bookings.length,
                    itemBuilder: (context, i) {
                      final b = bookings[i];
                      final type = b['consultation_type'] ?? {};
                      final specialist = type['specialist'] ?? {};
                      final slot = b['slot'] ?? {};
                      final startTime = slot['start_time'] != null ? DateTime.parse(slot['start_time']) : null;
                      final meetingUrl = b['meeting_url'];

                      return Card(
                        margin: const EdgeInsets.only(bottom: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    b['booking_code'] ?? '',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.blueGrey),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: b['status'] == 'confirmed' ? Colors.green.shade50 : Colors.red.shade50,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      b['status'] == 'confirmed' ? 'Confirmé ✓' : 'Annulé ✕',
                                      style: TextStyle(
                                        color: b['status'] == 'confirmed' ? Colors.green : Colors.red,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                type['title'] ?? 'Consultation',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              Text(
                                'Expert : ${specialist['name'] ?? ''}',
                                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                              ),
                              const SizedBox(height: 10),
                              if (startTime != null)
                                Row(
                                  children: [
                                    const Icon(Icons.event, size: 16, color: Colors.blue),
                                    const SizedBox(width: 6),
                                    Text(
                                      '${startTime.day}/${startTime.month}/${startTime.year} à ${startTime.hour.toString().padLeft(2, '0')}:${startTime.minute.toString().padLeft(2, '0')}',
                                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                    ),
                                  ],
                                ),
                              const SizedBox(height: 14),
                              if (meetingUrl != null && b['status'] == 'confirmed')
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.shade50,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: Colors.blue.shade200),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.videocam_rounded, color: Colors.blue),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          meetingUrl,
                                          style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 12),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
