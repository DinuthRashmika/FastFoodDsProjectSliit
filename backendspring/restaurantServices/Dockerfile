# Dockerfile for restaurant service
FROM openjdk:17-jdk-slim as build

WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]