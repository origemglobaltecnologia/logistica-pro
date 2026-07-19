# Estágio 1: Build
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copia arquivos do Maven para cache de dependências
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copia o código fonte e compila
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Estágio 2: Execução
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
