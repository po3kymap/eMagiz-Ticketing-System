package com.emagiz.resource;


import com.emagiz.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/users")
public class UserResource {
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("emagiz-pu");

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
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

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getAllUsers(){
        EntityManager em = emf.createEntityManager();
        try{

            List<User> userList = em.createQuery("SELECT u FROM User u", User.class).getResultList();
            return userList;
        } finally {
            em.close();
        }


    }

}
