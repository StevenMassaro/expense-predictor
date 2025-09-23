## Developer notes
### Additional logging
Add these to the application properties for the backend to increase SQL logging:
```
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```