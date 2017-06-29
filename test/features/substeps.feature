Feature: Successful feature runs
  As a BDD developer
  I want to aggregate steps
  So that I can have more efficient syntax, while also having modular test code

  Scenario: All substeps work
    Given I wrap a number of substeps into one
    Then I should see everything is green

  Scenario: Some substeps not defined
    Given I wrap an unimplemented substep into another step set
    When I run that scenario
    Then I will see that the step containing the substep will be unimplemented
    And the scenario will fail

  Scenario: Some substeps are pending
    Given I wrap a pending substep into another step set
    When I run that scenario
    Then I will see that the step containing the substep will be pending
    And the scenario will fail

  Scenario: Some substeps are failing
    Given I wrap a error prone substep into another step set
    When I run that scenario
    Then I will see that the step containing the substep will have failed
    And the scenario will fail
