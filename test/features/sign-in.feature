Feature: Signing in as a id or non-id user
  As a member of the public
  I want to fill out my online Census survey
  So that the place that I am living gets maximum funding

  Scenario: Starting the questionnaire prompts for sign in
    Given I come to the Census survey for the first time
    When I click to start my questionnaire
    Then I should be on the login page
    And I should see a form asking for the id sent on my postcard
    And I should see a link to sign in without an id
