module.exports = {
  document: {
    type:"GherkinDocument",
    feature: {
      type: "Feature",
      tags: [],
      location: {
        line:1,
        column:1
      },
      language: "en",
      keyword: "Feature",
      name: "Signing in",
      description: "  As a customer\n  I want to sign in to see subscribed content\n  So that I am informed",
      children: [
        {
          type: "Scenario",
          tags: [],
          location: {
            line: 6,
            column: 3
          },
          keyword: "Scenario",
          name: "Seeing the prompt to sign in",
          steps: [
            {
              type: "Step",
              location: {
                line: 7,
                column: 5
              },
              keyword: "Given ",
              text: "I am a registered user"
            },
            {
              type: "Step",
              location: {
                line: 8,
                column: 5
              },
              keyword: "And ",
              text: "I am logged out"
            },
            {
              type: "Step",
              location: {
                line: 9,
                column: 5
              },
              keyword: "When ",
              text: "I visit the application"
            },
            {
              type: "Step",
              location: {
                line: 10,
                column: 5
              },
              keyword: "And ",
              text: "I click to view protected content"
            },
            {
              type: "Step",
              location: {
                line: 11,
                column: 5
              },
              keyword: "Then ",
              text:"I should be taken to the login page"
            }
          ]
        }
      ]
    },
    comments:[]
  },
  scenarios: [
    {
      tags: [],
      name: "Seeing the prompt to sign in",
      language: "en",
      locations: [
        {
          line: 6,
          column: 3
        }
      ],
      steps: [
        {
          text: "I am a registered user",
          arguments: [],
          locations: [
            {
              line: 7,
              column: 11
            }
          ]
        },
        {
          text:"I am logged out",
          arguments: [],
          locations: [
            {
              line: 8,
              column: 9
            }
          ]
        },
        {
          text: "I visit the application",
          arguments: [],
          locations: [
            {
              line: 9,
              column: 10
            }
          ]
        },
        {
          text: "I click to view protected content",
          arguments: [],
          locations: [
            {
              line: 10,
              column:9
            }
          ]
        },
        {
          text: "I should be taken to the login page",
          arguments: [],
          locations: [
            {
              line: 11,
              column: 10
            }
          ]
        }
      ]
    }
  ]
};
