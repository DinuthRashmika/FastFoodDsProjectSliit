# Use official OpenJDK image as base
FROM eclipse-temurin:17-jdk-jammy as builder

# Set working directory
WORKDIR /app

# Copy the build files
COPY pom.xml .
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Create the final image
FROM eclipse-temurin:17-jre-jammy

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder image
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8087

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]