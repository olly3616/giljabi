# ---- 빌드 단계 ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew installDist --no-daemon

# ---- 실행 단계 ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/install/giljabi-backend /app
# Render 등 호스트가 PORT 를 주입한다. 로컬 도커 기본값 8080.
ENV PORT=8080
EXPOSE 8080
CMD ["/app/bin/giljabi-backend"]
