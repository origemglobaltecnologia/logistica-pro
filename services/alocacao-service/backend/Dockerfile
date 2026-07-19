FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copia apenas o pom.xml e src
COPY pom.xml ./
COPY src ./src

# Instala o Maven Wrapper se não existir ou usa o mvn instalado
RUN chmod +x mvnw 2>/dev/null || true
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
