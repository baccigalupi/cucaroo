Feature: Feature with pending steps
  As a BDD developer
  I want to progressively develop scenarios with pending steps
  So that I feedback on my work in implementing acceptance tests

  Scenario: First step is pending
    Given I the first step is pending
    When I run the feature
    Then I should see all steps are gray
    And the exit code should be 1
