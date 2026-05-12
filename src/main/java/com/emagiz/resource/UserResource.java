package com.emagiz.resource;


import com.emagiz.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/api/users")
public class UserResource {
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("emagiz-pu");

    @POST
    public Response createUser(User user){
        EntityManager em = emf.createEntityManager();
    try {
        em.getTransaction().begin();
        em.persist(user);
        em.getTransaction().commit();

        return Response.status(Response.Status.CREATED).entity(user).build();
    } catch (Exception e) {
        if (em.getTransaction().isActive()){
            em.getTransaction().rollback();
        }
        return Response.serverError().build();
    } finally {
        em.close();
    }

    }

}
