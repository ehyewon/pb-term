import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'auth_service.dart';
import 'login_page.dart';
import 'wishlist_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  Future<void> _logout(BuildContext context) async {
  final authService = AuthService();
  await authService.signOut();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text("PB-TERM Mobile"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
          )
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 80,
            ),
            const SizedBox(height: 20),

            const Text(
              "로그인 성공 🎉",
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 12),

            if (user != null) ...[
              Text(
                user.email ?? "이메일 없음",
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                "UID: ${user.uid}",
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),

              const SizedBox(height: 30),

                ElevatedButton(
                onPressed: () {
                    Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const WishlistPage()),
                    );
                },
                child: const Text("찜 목록 보기 ❤️"),
                ),

                const SizedBox(height: 12),
            ],
          ],
        ),
      ),
    );
  }
}
