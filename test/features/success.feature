Feature: Successful feature runs
  As a BDD developer
  I want to implement and run cucumber tests
  So that I have regression testing, and a starting place for talking with product people

  Scenario: All is good
    Given all step definitions are defined
    When I run the feature
    Then I should see all steps in green
    And the exit code should be 0

  Scenario: Good substeps too
    Given I wrap a number of substeps into one
    Then I should see everything is green
