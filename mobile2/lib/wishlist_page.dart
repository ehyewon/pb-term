import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'wishlist_service.dart';

class WishlistPage extends StatelessWidget {
  const WishlistPage({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    // 🔥 로그인 안 돼 있으면 바로 차단
    if (user == null) {
      return const Scaffold(
        body: Center(child: Text("로그인이 필요합니다")),
      );
    }

    final wishlistService = WishlistService(uid: user.uid);

    return Scaffold(
      appBar: AppBar(
        title: const Text("찜 목록"),
        backgroundColor: Colors.black,
      ),
      backgroundColor: Colors.black,
      body: StreamBuilder<QuerySnapshot>(
        stream: wishlistService.getWishlistStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(
              child: Text(
                "찜한 영화가 없습니다",
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          final docs = snapshot.data!.docs;

          // 🔥 여기부터가 핵심 수정 부분
          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final doc = docs[index];
              final data = doc.data() as Map<String, dynamic>;

              return ListTile(
                leading: Image.network(
                  "https://image.tmdb.org/t/p/w200${data['posterPath']}",
                  width: 50,
                  fit: BoxFit.cover,
                ),
                title: Text(
                  data['title'] ?? '',
                  style: const TextStyle(color: Colors.white),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    // ✅ Firestore 문서 ID로 삭제
                    wishlistService.removeWishlist(doc.id);
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
