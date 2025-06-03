package com.massaro.expense_predictor.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class ExposeIdsRepositoryConfigurer implements RepositoryRestConfigurer {

    @Autowired
    private EntityManager entityManager;

    /**
     * By default, IDs are not exposed for the returned entities. This makes sending patch requests harder from the UI.
     * This method exposes those IDs. More info
     * <a href="https://stackoverflow.com/questions/30912826/expose-all-ids-when-using-spring-data-rest">here</a>.
     */
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));
    }
}
