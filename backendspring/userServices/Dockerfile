# Use official OpenJDK 17 image as base
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file into the container
COPY target/nexests-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs / listing port
EXPOSE 8082

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]