package com.emagiz.model;

import org.junit.jupiter.api.Test;

import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;

class CommentResponseTest {

    @Test
    void constructor() {
        Timestamp ts = Timestamp.valueOf("2024-06-01 12:00:00");

        CommentResponse c = new CommentResponse(
                1L, 2L, "alice", "SUPPORT",
                "hello", true, ts
        );

        assertEquals(1L, c.getId());
        assertEquals(2L, c.getUserId());
        assertEquals("alice", c.getUsername());
        assertEquals("SUPPORT", c.getRole());
        assertEquals("hello", c.getContent());
        assertTrue(c.isInternal());
        assertSame(ts, c.getCreatedAt());
    }

    @Test
    void notInternal() {
        CommentResponse c = new CommentResponse(
                1L, 2L, "bob", "CUSTOMER",
                "visible", false, null
        );

        assertFalse(c.isInternal());
        assertNull(c.getCreatedAt());
    }

    @Test
    void nullFields() {
        CommentResponse c = new CommentResponse(
                null, null, null, null, null, false, null
        );

        assertNull(c.getId());
        assertNull(c.getUserId());
        assertNull(c.getUsername());
        assertNull(c.getRole());
        assertNull(c.getContent());
        assertNull(c.getCreatedAt());
    }
}