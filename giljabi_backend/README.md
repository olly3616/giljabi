# 길잡이 백엔드 (Ktor 프록시)

Gemini API 키를 서버에만 보관하고, 앱은 이 서버의 `/decide` 만 호출한다.
F3(다음 단계 판단)을 Gemini 2.5 Flash 에 위임하는 얇은 프록시.

## 실행

**① Gemini 키 준비** — https://aistudio.google.com/apikey 에서 무료 발급.

**② 환경변수 설정 후 실행** (PowerShell):
```powershell
$env:GEMINI_API_KEY = "여기에_발급받은_키"
cd C:\practices\giljabi\giljabi_backend
.\gradlew.bat run
```
`Responding at http://0.0.0.0:8080` 이 뜨면 실행 중.

- 포트 변경: `$env:PORT = "9090"`
- 모델 변경: `$env:GEMINI_MODEL = "gemini-2.0-flash"`

> ⚠️ 키는 절대 커밋하지 않는다. 환경변수로만 주입한다.

## 엔드포인트

### `GET /health`
`ok` 반환 (헬스체크).

### `POST /decide`
요청:
```json
{
  "goal": "기차표 예매",
  "elements": [
    { "text": "승차권 예매", "type": "Button", "clickable": true },
    { "text": "정기승차권", "type": "Button", "clickable": true }
  ],
  "progress": []
}
```
응답:
```json
{
  "targetText": "승차권 예매",
  "guidanceText": "화면 아래 승차권 예매를 눌러주세요.",
  "isGoalReached": false
}
```

## 앱에서 접속

폰과 PC가 같은 Wi-Fi 일 때, 앱은 PC 의 LAN IP 로 접속한다 (예: `http://192.168.219.100:8080`).
앱의 `local.properties` 에 `giljabi.backendUrl` 로 설정한다 (M2b).

## 배포 (Render)

심사 기간 동안 상시 접속 가능한 공개 서버가 필요하다. 저장소 루트의 `render.yaml` Blueprint 로 배포한다.

1. https://render.com 로그인 → **New → Blueprint** → 이 GitHub 저장소 선택
2. Render 가 `render.yaml` 을 읽어 `giljabi_backend` 만 Docker 로 빌드한다.
3. **Environment** 에서 `GEMINI_API_KEY` 에 실제 키 입력 (저장소엔 저장 안 됨).
4. 배포 완료 후 URL 확인 (예: `https://giljabi-backend.onrender.com`).
   - 헬스체크: `GET /health` → `ok`
5. 앱의 `local.properties` 에 `giljabi.backendUrl` 을 이 URL 로 바꿔 재빌드.

> ⚠️ **무료 플랜 콜드스타트:** 15분 유휴 시 잠들어 첫 요청이 30~60초 걸린다.
> 심사 기간엔 [cron-job.org](https://cron-job.org) 등에서 `GET /health` 를 5~10분마다 호출해 깨워둔다.
> (또는 유료 플랜으로 상시 가동.)

Docker 로 로컬 실행도 가능:
```powershell
cd giljabi_backend
docker build -t giljabi-backend .
docker run -e GEMINI_API_KEY="키" -p 8080:8080 giljabi-backend
```

## 설계 메모

- 좌표(bounds)는 서버로 보내지 않는다. AI 는 text 로만 대상을 고르고, 앱이 좌표를 확정한다.
- 응답은 `responseSchema` 로 JSON 강제 → 파싱 안정성 확보.
- `$PORT` 환경변수 바인딩(호스트 주입), `/health` 헬스체크 제공.
