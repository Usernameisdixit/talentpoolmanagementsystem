# Use the official Maven image as the base image
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to the working directory
COPY pom.xml .

# Copy the source code to the working directory
COPY src src

# Build the application using Maven
RUN mvn clean install -DskipTests

# Use a smaller base image for the application runtime
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Install MySQL client
#RUN apt-get update && apt-get install -y default-mysql-client

# Copy the JAR file from the build stage to the working directory
COPY --from=build /app/target/tpmsapi.jar .

# Expose the port that the application listens on
EXPOSE 9990

#command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "tpmsapi.jar"]