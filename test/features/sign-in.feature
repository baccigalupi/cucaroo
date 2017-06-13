Feature: Signing in
  As a customer
  I want to sign in to see subscribed content
  So that I am informed

  Scenario: Seeing the prompt to sign in
    Given I am a registered user
    And I am logged out
    When I visit the application
    And I click to view protected content
    Then I should be taken to the login page
