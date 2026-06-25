package com.emagiz.model;

import org.junit.jupiter.api.Test;

import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;

class AuditLogTest {

    @Test
    void emptyConstructor() {
        AuditLog log = new AuditLog();

        assertEquals(0, log.getId());
        assertNull(log.getTicketId());
        assertNull(log.getUserId());
        assertNull(log.getAction());
        assertNull(log.getDetails());
        assertNull(log.getCreatedAt());
    }

    @Test
    void threeArgConstructor() {
        AuditLog log = new AuditLog(7, 3, "USER_CREATED");

        assertEquals(7, log.getTicketId());
        assertEquals(3, log.getUserId());
        assertEquals("USER_CREATED", log.getAction());
        assertNull(log.getDetails());
        assertNull(log.getCreatedAt());
    }

    @Test
    void threeArgConstructorAcceptsNullTicketId() {
        AuditLog log = new AuditLog(null, 3, "PASSWORD_UPDATED");

        assertNull(log.getTicketId());
        assertEquals(3, log.getUserId());
        assertEquals("PASSWORD_UPDATED", log.getAction());
    }

    @Test
    void gettersAndSetters() {
        AuditLog log = new AuditLog();
        Timestamp ts = Timestamp.valueOf("2024-01-02 03:04:05");

        log.setId(99);
        log.setTicketId(11);
        log.setUserId(22);
        log.setAction("USER_DELETED");
        log.setDetails("u7 (alice)");
        log.setCreatedAt(ts);

        assertEquals(99, log.getId());
        assertEquals(11, log.getTicketId());
        assertEquals(22, log.getUserId());
        assertEquals("USER_DELETED", log.getAction());
        assertEquals("u7 (alice)", log.getDetails());
        assertSame(ts, log.getCreatedAt());
    }
}