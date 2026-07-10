# 1단계: 의존성 캐시 활용 빌드
FROM gradle:8.10-jdk17 AS build
WORKDIR /home/gradle/src

# 1. build.gradle 등 설정 파일만 먼저 복사
COPY --chown=gradle:gradle build.gradle settings.gradle ./
# 2. 의존성만 미리 다운로드 (캐시됨)
RUN gradle dependencies --no-daemon

# 3. 전체 소스 코드 복사 후 빌드
COPY --chown=gradle:gradle . .
RUN gradle build -x test --no-daemon

# 2단계: 실행 환경
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]