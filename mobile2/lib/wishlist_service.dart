import 'package:cloud_firestore/cloud_firestore.dart';

class WishlistService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final String uid;

  WishlistService({required this.uid});

  /// 📦 찜 목록 스트림 (favorites 컬렉션 기준)
  Stream<QuerySnapshot> getWishlistStream() {
    return _db
        .collection("favorites")
        .where("userUid", isEqualTo: uid)
        .orderBy("createdAt", descending: true)
        .snapshots();
  }

  /// ❌ 찜 삭제 (favorites 문서 삭제)
  Future<void> removeWishlist(String docId) async {
    await _db
        .collection("favorites")
        .doc(docId)
        .delete();
  }
}
