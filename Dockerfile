# Stage 1: Build React frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY expense-predictor-ui/ ./expense-predictor-ui
RUN cd expense-predictor-ui && npm install && npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY expense-predictor-backend/ ./expense-predictor-backend
# Copy built frontend into Spring static resources
COPY --from=frontend-build /app/expense-predictor-ui/dist /app/expense-predictor-backend/src/main/resources/static
RUN cd expense-predictor-backend && mvn clean package -DskipTests

# Stage 3: Runtime image
FROM ibm-semeru-runtimes:open-21-jre
WORKDIR /app
COPY --from=backend-build /app/expense-predictor-backend/target/*.jar app.jar
EXPOSE 8080
ENV DATABASE_FILEPATH=/db/expense-predictor-backend.sqlite
ENTRYPOINT ["java", "-jar", "app.jar"]
