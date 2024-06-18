# tpms
To use docker, change the application.properties  as below 
#server.port=9999
#server.servlet.context-path=/tpms

server.port=9990
server.servlet.context-path=/tpmsapi

#server.error.whitelabel.enabled=false
#server.error.path=/error
spring.datasource.url=jdbc:mysql://mysql:3306/tpms
#spring.datasource.url=jdbc:mysql://172.27.29.135:3306/tpms
spring.datasource.username = root
#spring.datasource.password = root
spring.datasource.password = csmpl@123
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

logging.level.org.springframework.data.jpa=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect


user.default.password=Csmtech@123

spring.jpa.show-sql=true
file.directory=D:/TPMS_RESOURCE_FILES/

#files Config Properties
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
#Session time period-1800(30 min)

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=wrsiswrsis@gmail.com
spring.mail.password=hfct bskb lkut stzm
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
upload-dir=D:/TPMS_SERVE/
#JWT Token validty time
jwt.token.validity.minutes=900
#server.servlet.session.timeout=1800 
#management.endpoints.web.exposure.include=health,info
info.app.description=this is the sample project
#info.app.version=1.0
management.endpoints.web.exposure.include=*
management.info.env.enabled=true
info.app.name=RestCurd
management.endpoint.health.show-details=always
management.endpoint.shutdown.enabled=true
management.endpoints.web.base-path=/actuator

here is command to run the comose file 


docker-compose up --build
docker-compose down


explanation for healthcheck code in compose file 
healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s

      When the MySQL container starts, Docker will wait for the start_period (30 seconds) before it begins to evaluate the health check results.
After the start_period, Docker will run the mysqladmin ping -h localhost command every interval (10 seconds).
If the command takes longer than the timeout (5 seconds) to complete, it will be considered a failed check.
If the command fails retries (3) times in a row, Docker will mark the container as unhealthy.
