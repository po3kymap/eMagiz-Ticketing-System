package com.emagiz.dao;

import com.emagiz.config.DatabaseConfig;
import com.emagiz.model.AuditLog;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.sql.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuditLogDAOTest {

    private MockedStatic<DatabaseConfig> dbConfig;
    private Connection conn;
    private PreparedStatement stmt;
    private ResultSet rs;

    @BeforeEach
    void setUp() throws SQLException {
        dbConfig = mockStatic(DatabaseConfig.class);
        conn = mock(Connection.class);
        stmt = mock(PreparedStatement.class);
        rs = mock(ResultSet.class);

        dbConfig.when(DatabaseConfig::getConnection).thenReturn(conn);
        when(conn.prepareStatement(anyString())).thenReturn(stmt);
    }

    @AfterEach
    void tearDown() {
        dbConfig.close();
    }

    // ---------- saveLog ----------

    @Test
    void saveLogWithoutDetailsUsesThreeColumnInsert() throws SQLException {
        AuditLogDAO dao = new AuditLogDAO();

        dao.saveLog(7, 3, "USER_CREATED");

        verify(conn).prepareStatement(startsWith("INSERT INTO audit_logs (ticket_id, user_id, action, details)"));
        verify(stmt).setObject(1, 7);
        verify(stmt).setObject(2, 3);
        verify(stmt).setString(3, "USER_CREATED");
        verify(stmt).setString(4, null);
        verify(stmt).executeUpdate();
    }

    @Test
    void saveLogWithDetailsIncludesDetailsColumn() throws SQLException {
        AuditLogDAO dao = new AuditLogDAO();

        dao.saveLog(7, 3, "USER_DELETED", "u7 (alice)");

        verify(stmt).setObject(1, 7);
        verify(stmt).setObject(2, 3);
        verify(stmt).setString(3, "USER_DELETED");
        verify(stmt).setString(4, "u7 (alice)");
    }

    @Test
    void saveLogSwallowsSqlExceptionWhenDetailsPresent() throws SQLException {
        AuditLogDAO dao = new AuditLogDAO();

        // first insert (with details) blows up, second insert (without details) succeeds
        doThrow(new SQLException("no details column"))
                .doNothing()
                .when(stmt).executeUpdate();

        dao.saveLog(7, 3, "USER_DELETED", "fallback needed");

        // both preparedStatements (the failing one and the fallback) must have been issued
        verify(stmt, times(2)).executeUpdate();
    }

    @Test
    void saveLogSwallowsSqlExceptionWhenNoDetails() throws SQLException {
        AuditLogDAO dao = new AuditLogDAO();

        doThrow(new SQLException("boom")).when(stmt).executeUpdate();

        // must not throw — by contract audit failures are silent
        assertDoesNotThrow(() -> dao.saveLog(null, 1, "SYSTEM_EVENT"));
    }

    @Test
    void saveLogAllowsNullTicketId() throws SQLException {
        AuditLogDAO dao = new AuditLogDAO();

        dao.saveLog(null, 1, "PASSWORD_UPDATED");

        verify(stmt).setObject(1, null);
        verify(stmt).setObject(2, 1);
        verify(stmt).setString(3, "PASSWORD_UPDATED");
    }

    // ---------- getAllLogs ----------

    @Test
    void getAllLogsReturnsListOfLogs() throws SQLException {
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true, true, false);
        when(rs.getInt("id")).thenReturn(10, 11);
        when(rs.getInt("ticket_id")).thenReturn(5, 6);
        when(rs.wasNull()).thenReturn(false, false);
        when(rs.getInt("user_id")).thenReturn(2, 3);
        when(rs.getString("action")).thenReturn("CREATED", "DELETED");
        when(rs.getTimestamp("created_at")).thenReturn(
                Timestamp.valueOf("2024-01-01 10:00:00"),
                Timestamp.valueOf("2024-01-02 11:00:00")
        );

        AuditLogDAO dao = new AuditLogDAO();
        List<AuditLog> logs = dao.getAllLogs();

        assertEquals(2, logs.size());
        assertEquals(10, logs.get(0).getId());
        assertEquals(5, logs.get(0).getTicketId());
        assertEquals("CREATED", logs.get(0).getAction());
        assertEquals(11, logs.get(1).getId());
        assertEquals("DELETED", logs.get(1).getAction());
    }

    @Test
    void getAllLogsReturnsEmptyListWhenNoRows() throws SQLException {
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(false);

        AuditLogDAO dao = new AuditLogDAO();
        List<AuditLog> logs = dao.getAllLogs();

        assertTrue(logs.isEmpty());
    }

    @Test
    void getAllLogsSwallowsSqlException() throws SQLException {
        when(stmt.executeQuery()).thenThrow(new SQLException("boom"));

        AuditLogDAO dao = new AuditLogDAO();

        // must not throw, returns empty list
        List<AuditLog> logs = assertDoesNotThrow(dao::getAllLogs);
        assertTrue(logs.isEmpty());
    }

    @Test
    void getAllLogsMapsNullTicketId() throws SQLException {
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true, false);
        when(rs.getInt("id")).thenReturn(1);
        when(rs.getInt("ticket_id")).thenReturn(0); // 0 + wasNull == null
        when(rs.wasNull()).thenReturn(true);
        when(rs.getInt("user_id")).thenReturn(2);
        when(rs.getString("action")).thenReturn("SYSTEM");
        when(rs.getTimestamp("created_at")).thenReturn(Timestamp.valueOf("2024-01-01 00:00:00"));

        AuditLogDAO dao = new AuditLogDAO();
        List<AuditLog> logs = dao.getAllLogs();

        assertEquals(1, logs.size());
        assertNull(logs.get(0).getTicketId());
    }

    // ---------- getLogsByTicketId ----------

    @Test
    void getLogsByTicketIdBindsTicketIdAndReturnsRows() throws SQLException {
        when(stmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true, false);
        when(rs.getInt("id")).thenReturn(100);
        when(rs.getInt("ticket_id")).thenReturn(42);
        when(rs.wasNull()).thenReturn(false);
        when(rs.getInt("user_id")).thenReturn(2);
        when(rs.getString("action")).thenReturn("STATUS_CHANGED");
        when(rs.getTimestamp("created_at")).thenReturn(Timestamp.valueOf("2024-05-01 12:00:00"));

        AuditLogDAO dao = new AuditLogDAO();
        List<AuditLog> logs = dao.getLogsByTicketId(42L);

        verify(stmt).setLong(1, 42L);
        verify(conn).prepareStatement(startsWith("SELECT * FROM audit_logs WHERE ticket_id = ?"));
        assertEquals(1, logs.size());
        assertEquals(42, logs.get(0).getTicketId());
        assertEquals("STATUS_CHANGED", logs.get(0).getAction());
    }

    @Test
    void getLogsByTicketIdSwallowsSqlException() throws SQLException {
        when(stmt.executeQuery()).thenThrow(new SQLException("boom"));

        AuditLogDAO dao = new AuditLogDAO();

        List<AuditLog> logs = assertDoesNotThrow(() -> dao.getLogsByTicketId(42L));
        assertTrue(logs.isEmpty());
    }
}