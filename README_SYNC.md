# 데이터 동기화 설정 가이드

## 개요

LuckyStat 2.0은 이제 모든 기기에서 동일한 관리자 데이터를 공유할 수 있습니다. GitHub API를 사용하여 공용 JSON 파일을 저장하고 불러옵니다.

## 설정 방법

### 1. GitHub Personal Access Token 생성

1. GitHub에 로그인
2. Settings > Developer settings > Personal access tokens > Tokens (classic)
3. "Generate new token" 클릭
4. Token 이름 입력 (예: "LuckyStat Sync")
5. 권한 선택:
   - `repo` (전체 권한) 체크
6. "Generate token" 클릭
7. 생성된 토큰을 복사 (한 번만 표시됨)

### 2. 관리자 모드에서 Token 입력

1. 관리자 페이지에 접속 (`admin.html`)
2. 비밀번호 입력 후 로그인
3. 데이터를 저장하려고 하면 Token 입력 프롬프트가 나타남
4. 복사한 Token을 입력
5. Token은 브라우저에 저장되어 다음부터는 자동으로 사용됨

### 3. GitHub Repository 설정

1. GitHub 저장소에 `data` 폴더 생성
2. `data/admin_data.json` 파일 생성 (초기 데이터)

```json
{
  "numberStats": {},
  "rangeStats": {},
  "missingNumbers": {},
  "lastUpdated": "2025-01-01T00:00:00.000Z"
}
```

3. `sync-manager.js`에서 다음 경로 수정:
   - `this.DATA_URL`: GitHub Pages URL
   - `this.UPDATE_URL`: GitHub API URL

예시:
```javascript
this.DATA_URL = 'https://YOUR_USERNAME.github.io/lotto1004/data/admin_data.json';
this.UPDATE_URL = 'https://api.github.com/repos/YOUR_USERNAME/lotto1004/contents/data/admin_data.json';
```

## 동작 방식

### 데이터 로드
- 페이지 로드 시 공용 JSON 파일에서 데이터 읽기 시도
- 공용 데이터가 더 최신이면 로컬 데이터 업데이트
- 공용 데이터가 없거나 오류 시 로컬 데이터 사용

### 데이터 저장
- 관리자가 저장 시:
  1. 로컬에 저장
  2. GitHub API를 통해 공용 JSON 파일 업데이트
  3. 모든 기기에서 새로고침 시 동일한 데이터 표시

## 보안 주의사항

⚠️ **중요**: GitHub Token은 민감한 정보입니다.
- Token을 코드에 직접 작성하지 마세요
- Token은 관리자 모드에서만 입력받아 사용합니다
- Token이 노출되면 즉시 GitHub에서 삭제하세요

## 문제 해결

### 공용 저장 실패
- Token이 올바른지 확인
- Token에 `repo` 권한이 있는지 확인
- GitHub API rate limit 확인 (시간당 5000회 제한)

### 데이터 동기화 안됨
- 브라우저 캐시 클리어
- GitHub Pages 배포 확인
- 네트워크 연결 확인


