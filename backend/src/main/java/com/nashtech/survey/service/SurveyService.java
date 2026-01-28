package com.nashtech.survey.service;

import com.nashtech.survey.model.Survey;
import com.nashtech.survey.payload.request.SurveyRequest;
import com.nashtech.survey.payload.response.SurveyResponse;
import com.nashtech.survey.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    public SurveyResponse createSurvey(SurveyRequest request) {
        Survey survey = new Survey();
        survey.setTitle(request.getTitle()); // Explicitly saving title
        survey.setDescription(request.getDescription());
        survey.setSchemaJson(request.getSchemaJson());
        survey.setStatus(Survey.SurveyStatus.valueOf(request.getStatus()));

        Survey savedSurvey = surveyRepository.save(survey);
        return mapToResponse(savedSurvey);
    }

    public List<SurveyResponse> getAllSurveysForUser() {
        return surveyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SurveyResponse getSurveyById(UUID id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        return mapToResponse(survey);
    }

    public SurveyResponse updateSurvey(UUID id, SurveyRequest request) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setSchemaJson(request.getSchemaJson());
        survey.setStatus(Survey.SurveyStatus.valueOf(request.getStatus()));

        Survey updatedSurvey = surveyRepository.save(survey);
        return mapToResponse(updatedSurvey);
    }

    public void deleteSurvey(UUID id) {
        surveyRepository.deleteById(id);
    }

    private SurveyResponse mapToResponse(Survey survey) {
        SurveyResponse response = new SurveyResponse();
        response.setId(survey.getId().toString()); // Convert UUID to String for response
        response.setTitle(survey.getTitle());
        response.setDescription(survey.getDescription());
        response.setSchemaJson(survey.getSchemaJson());
        response.setStatus(survey.getStatus().name());
        return response;
    }
}
