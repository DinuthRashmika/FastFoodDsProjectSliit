# Dockerfile for Notification Service
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /workspace/app

COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=builder /workspace/app/target/*.jar app.jar
COPY --from=builder /workspace/app/src/main/resources/templates/ /app/resources/templates/
COPY --from=builder /workspace/app/src/main/resources/application.properties /app/resources/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]