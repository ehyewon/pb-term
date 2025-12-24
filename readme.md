PB-TERM Mobile Application (Flutter)

본 프로젝트는 Flutter를 이용해 구현한 모바일 애플리케이션으로,
기존 Web Application과 동일한 Firebase 프로젝트를 사용하여
로그인 및 사용자 데이터를 연동하는 것을 목표로 한다.

Web과 Mobile은 하나의 Firebase 프로젝트를 공유하며,
Firebase Authentication과 Firestore를 통해 사용자 인증 및 데이터 저장을 처리한다.


실행방법
1. 안드로이드 스튜디오를 설치한다.

2. 안드로이드 스튜디오 또는 Vs code에서 mobile을 실행한다. 

3. 먼저 비쥬얼 스튜디오에서 flutter pub get으로 pubspec.yaml에 명시된 Flutter 및 Firebase 패키지를 다운로드한다. 

4. flutterfire configure 명령어로 flutter 앱을 Firebase 프로젝트와 연결한다. 

5. flutter run으로 Android Emulator 또는 연결된 실제 기기에서 앱을 실행한다. 

------------------------------------------
기능설명 

🔐 Google 로그인

Firebase Authentication을 이용한 Google 계정 로그인

계정이 없을 경우 자동으로 신규 계정 생성

👤 사용자 정보 저장

로그인한 사용자의 정보(uid, 이메일, 이름 등)를 Firestore에 저장

Web / Mobile에서 동일한 사용자 데이터 사용 가능

🔓 로그아웃

--------------------------------------------
## 🔥 Firebase 연동 코드
/lib
- firebase_options.dart  
- auth_service.dart  
- wishlist_service.dart  

Firebase Authentication(Google 로그인)과  
Firestore를 이용한 사용자 인증 및 데이터 CRUD 처리


Firebase 및 Google 세션 로그아웃 지원
---------------------------------------------
나머지는 전부 mobile 코드 
로그아웃 후 다시 로그인 가능

