import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';

class UserModel {
  final int id;
  final String name;
  final String email;
  final String role;
  final String? phone;
  final String? avatar;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
    this.avatar,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'trainee',
      phone: json['phone'],
      avatar: json['avatar'],
    );
  }
}

class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;

  const AuthState({this.user, this.isLoading = true, this.error});

  bool get isAuthenticated => user != null;

  AuthState copyWith({UserModel? user, bool? isLoading, String? error}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState()) {
    checkCurrentUser();
  }

  Future<void> checkCurrentUser() async {
    try {
      final token = await ApiClient().getToken();
      if (token == null) {
        state = const AuthState(isLoading: false);
        return;
      }

      final response = await ApiClient().dio.get('/auth/me');
      final userData = response.data['user'];
      state = AuthState(user: UserModel.fromJson(userData), isLoading: false);
    } catch (_) {
      await ApiClient().removeToken();
      state = const AuthState(isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await ApiClient().dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['token'];
      final userData = response.data['user'];
      await ApiClient().setToken(token);

      state = AuthState(user: UserModel.fromJson(userData), isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية.',
      );
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? phone,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await ApiClient().dio.post('/auth/register', data: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': passwordConfirmation,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
      });

      final token = response.data['token'];
      final userData = response.data['user'];
      await ApiClient().setToken(token);

      state = AuthState(user: UserModel.fromJson(userData), isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'تعذر إنشاء الحساب، يرجى التأكد من صحة البريد وكلمة المرور.',
      );
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await ApiClient().dio.post('/auth/logout');
    } catch (_) {}
    await ApiClient().removeToken();
    state = const AuthState(user: null, isLoading: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
