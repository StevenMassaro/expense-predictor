I suggest using Actual budget instead of this. Actual accomplishes all this project set out to do, and I've fully switched over to using it.

## Developer notes
### Additional logging
Add these to the application properties for the backend to increase SQL logging:
```
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```
