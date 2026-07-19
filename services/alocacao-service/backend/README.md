# Aplicador de Volumes

Microserviço para gestão de volumes logísticos.

## Como rodar
1. `mvn clean package`
2. `docker build -t aplicador-de-volumes .`
3. `docker run -p 8080:8080 aplicador-de-volumes`

## Documentação
Acesse o Swagger UI em: `http://localhost:8080/swagger-ui.html`
