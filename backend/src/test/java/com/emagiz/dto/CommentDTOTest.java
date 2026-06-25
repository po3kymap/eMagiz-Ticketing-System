package com.emagiz.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CommentDTOTest {

    @Test
    void emptyConstructor() {
        CommentDTO dto = new CommentDTO();

        assertNull(dto.getContent());
        assertFalse(dto.isInternal());
    }

    @Test
    void gettersAndSetters() {
        CommentDTO dto = new CommentDTO();

        dto.setContent("hi");
        dto.setInternal(true);

        assertEquals("hi", dto.getContent());
        assertTrue(dto.isInternal());
    }

    @Test
    void jsonSerializedAsInternal() throws Exception {
        CommentDTO dto = new CommentDTO();
        dto.setContent("note");
        dto.setInternal(true);

        String json = new ObjectMapper().writeValueAsString(dto);

        assertTrue(json.contains("\"internal\":true"));
        assertTrue(json.contains("\"content\":\"note\""));
    }

    @Test
    void jsonAcceptsIsInternalAlias() throws Exception {
        String json = "{\"content\":\"x\",\"isInternal\":true}";

        CommentDTO dto = new ObjectMapper().readValue(json, CommentDTO.class);

        assertEquals("x", dto.getContent());
        assertTrue(dto.isInternal());
    }

    @Test
    void jsonAcceptsInternalKey() throws Exception {
        String json = "{\"content\":\"x\",\"internal\":true}";

        CommentDTO dto = new ObjectMapper().readValue(json, CommentDTO.class);

        assertTrue(dto.isInternal());
    }
}