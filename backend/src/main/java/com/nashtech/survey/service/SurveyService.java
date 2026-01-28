package com.nashtech.survey.service;

import com.nashtech.survey.model.Survey;
import com.nashtech.survey.model.Survey.SurveyStatus;
import com.nashtech.survey.payload.request.SurveyRequest;
import com.nashtech.survey.payload.response.SurveyResponse;
import com.nashtech.survey.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SurveyService {
    @Autowired
    SurveyRepository surveyRepository;

    // TODO: Inject UserRepository when Auth is implemented

    // MOCK USER ID for development
    private static final Long MOCK_USER_ID = 1L;

    public SurveyResponse createSurvey(SurveyRequest request) {
        // UserDetailsImpl userDetails = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Survey survey = new Survey();
        survey.setTitle(request.getTitle());
        survey.setDescription(request.getDescription());
        survey.setSchemaJson(request.getSchemaJson());
        survey.setCreatedBy(MOCK_USER_ID); // Mocked
        survey.setStatus(SurveyStatus.DRAFT);

        if (request.getStatus() != null) {
            try {
                survey.setStatus(SurveyStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid status, keep draft
            }
        }

        Survey savedSurvey = surveyRepository.save(survey);
        return mapToResponse(savedSurvey);
    }

    public List<SurveyResponse> getAllSurveysForUser() {
        // UserDetailsImpl userDetails = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Survey> surveys = surveyRepository.findByCreatedBy(MOCK_USER_ID); // Mocked
        return surveys.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public SurveyResponse getSurveyById(Long id) {
        // UserDetailsImpl userDetails = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Survey not found"));

        // Basic ownership check
        if (!survey.getCreatedBy().equals(MOCK_USER_ID)) { // Mocked check
            throw new RuntimeException("Error: Not authorized to view this survey");
        }

        return mapToResponse(survey);
    }

    public SurveyResponse updateSurvey(Long id, SurveyRequest request) {
        // UserDetailsImpl userDetails = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Survey not found"));

        if (!survey.getCreatedBy().equals(MOCK_USER_ID)) { // Mocked check
            throw new RuntimeException("Error: Not authorized to update this survey");
        }

        if (request.getTitle() != null)
            survey.setTitle(request.getTitle());
        if (request.getDescription() != null)
            survey.setDescription(request.getDescription());
        if (request.getSchemaJson() != null)
            survey.setSchemaJson(request.getSchemaJson());

        if (request.getStatus() != null) {
            try {
                survey.setStatus(SurveyStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore
            }
        }

        Survey updatedSurvey = surveyRepository.save(survey);
        return mapToResponse(updatedSurvey);
    }

    public void deleteSurvey(Long id) {
        // UserDetailsImpl userDetails = (UserDetailsImpl)
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Survey not found"));

        if (!survey.getCreatedBy().equals(MOCK_USER_ID)) { // Mocked check
            throw new RuntimeException("Error: Not authorized to delete this survey");
        }

        surveyRepository.delete(survey);
    }

    private SurveyResponse mapToResponse(Survey survey) {
        return new SurveyResponse(
                survey.getId(),
                survey.getTitle(),
                survey.getDescription(),
                survey.getStatus(),
                survey.getSchemaJson(),
                survey.getCreatedBy(),
                survey.getCreatedAt(),
                survey.getUpdatedAt());
    }
}
