package com.nashtech.survey.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nashtech.survey.model.Survey;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByCreatedBy(Long userId);

    List<Survey> findByStatus(Survey.SurveyStatus status);
}
