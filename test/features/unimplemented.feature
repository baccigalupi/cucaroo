Feature: With unimplemented steps
  As a BDD developer
  I want to get implementation advice from cucaroo
  So that I don't have to remember how to write the steps from scratch

  Scenario: One step is missing
    Given Some step definitions are defined
    When I run the feature
    Then I should see all tests in gray
    And the exit code should be 1

  Scenario: Implementation and error messages are printed at the end
    Given There is a missing step definition in a second scenario
    When I run the feature
    Then I should see implementation suggestions at the very end

  Scenario: No duplicate implementation messages
    Given Some step definitions are defined
    When I run the feature
    Then I should see all tests in gray
    And I should only see the implementation suggestion once per step
