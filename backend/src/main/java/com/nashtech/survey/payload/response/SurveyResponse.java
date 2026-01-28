package com.nashtech.survey.payload.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponse {
    private String id; // Changed to String to support UUID
    private String title;
    private String description;
    private String status; // Keeping as String for simple JSON serialization
    private JsonNode schemaJson;
}
