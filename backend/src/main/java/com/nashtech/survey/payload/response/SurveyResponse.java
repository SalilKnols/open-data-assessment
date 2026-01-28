package com.nashtech.survey.payload.response;

import com.fasterxml.jackson.databind.JsonNode;
import com.nashtech.survey.model.Survey.SurveyStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SurveyResponse {
    private Long id;
    private String title;
    private String description;
    private SurveyStatus status;
    private JsonNode schemaJson;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SurveyResponse(Long id, String title, String description, SurveyStatus status, JsonNode schemaJson,
            Long createdBy, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.schemaJson = schemaJson;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
