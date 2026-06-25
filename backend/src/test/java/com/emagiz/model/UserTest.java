package com.emagiz.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void emptyConstructor() {
        User user = new User();

        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
        assertNull(user.getRole());
        assertNull(user.getCompany());
    }

    @Test
    void fullConstructor() {
        User user = new User("alice", "alice@example.com", "hash", "SUPPORT", "Acme");

        assertNull(user.getId());
        assertEquals("alice", user.getUsername());
        assertEquals("alice@example.com", user.getEmail());
        assertEquals("hash", user.getPassword());
        assertEquals("SUPPORT", user.getRole());
        assertEquals("Acme", user.getCompany());
    }

    @Test
    void gettersAndSetters() {
        User user = new User();

        user.setId(42L);
        user.setUsername("bob");
        user.setEmail("bob@example.com");
        user.setPassword("secret");
        user.setRole("CUSTOMER");
        user.setCompany("BobCo");

        assertEquals(42L, user.getId());
        assertEquals("bob", user.getUsername());
        assertEquals("bob@example.com", user.getEmail());
        assertEquals("secret", user.getPassword());
        assertEquals("CUSTOMER", user.getRole());
        assertEquals("BobCo", user.getCompany());
    }

    @Test
    void settersAcceptNull() {
        User user = new User("x", "x@x", "p", "CUSTOMER", "Co");

        user.setId(null);
        user.setUsername(null);
        user.setEmail(null);
        user.setPassword(null);
        user.setRole(null);
        user.setCompany(null);

        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
        assertNull(user.getRole());
        assertNull(user.getCompany());
    }
}