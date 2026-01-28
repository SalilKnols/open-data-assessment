package com.nashtech.survey.payload.request;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SurveyRequest {
    @NotBlank
    private String title;

    private String description;

    // The entire JSON structure as a generic JSON object
    private JsonNode schemaJson;

    // Status can be updated via this request
    private String status;
}
