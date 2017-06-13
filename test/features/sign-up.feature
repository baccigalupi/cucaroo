Feature: Signing up
  As a interested guest
  I want to sign up
  So that I can see protected content

  Scenario: Navigating to the sign in page
    Given I am not yet a registered user
    When I visit the application
    And I click to view protected content
    And I click on the link on the login page to sign up
    Then I will be taken to the sign in page
