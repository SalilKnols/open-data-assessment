package com.nashtech.survey.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;

@Entity
@Table(name = "surveys")
@Data
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "schema_json", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode schemaJson;

    @Enumerated(EnumType.STRING)
    private SurveyStatus status;

    public enum SurveyStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}
