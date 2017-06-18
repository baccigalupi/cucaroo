Feature: With unimplemented steps
  As a BDD developer
  I want to get implementation advice from cucaroo
  So that I don't have to remember how to write the steps from scratch

  Scenario: Some steps are missing
    Given Some step definitions are defined
    When I run the feature
    Then I should see all tests in gray
    And the exit code should be 1
