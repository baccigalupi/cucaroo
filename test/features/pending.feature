Feature: Feature with pending steps
  As a BDD developer
  I want to progressively develop scenarios with pending steps
  So that I have feedback on my work as I implement acceptance tests

  Scenario: Pending via thrown error
    Given The first step is pending by throwing a pending error
    When I run the feature
    Then I should see all steps are gray
    And the exit code should be 1

  Scenario: First step is pending via passing an error to the callback
    Given The first step is pending by passing a pending error to the callback
    When I run the feature
    Then I should see all steps are gray
    And the exit code should be 1

  Scenario: Later step is pending
    Given I run the feature
    When I throw in a pending step
    Then the exit code should be 1
