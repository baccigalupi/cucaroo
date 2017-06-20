Feature: Feature with a whole lot of errors
  As a BDD developer
  I want to see my regression tests fail
  So that I know my code works after modifications

  Scenario: Assertion failure
    Given Things are moving along just fine
    When And then I make an assertion that aint true
    Then I should see a helpful stack trace
    And the summary at the end reflects those errors

  Scenario: Runtime errors
    Given Things are moving along just fine
    When I make an error resulting in a runtime failure
    Then I should see a helpful stack trace
    And the summary at the end reflects those errors

