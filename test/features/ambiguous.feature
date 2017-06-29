Feature: Successful feature runs
  As a BDD developer
  I want to be informed about ambigous step definitions
  So that I can keep my test code clean and not run the wrong step

  Scenario: There are ambiguous steps
    Given I run the feature
    And there are two steps with the same text
    Then I should see a message after the step
    And the exit code should be 1
