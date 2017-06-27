cucaroo 🥒
=======

A light cucumber implementation for node javascript. Cucaroo allows you to have product defined `.features` and facilitates the testing against the narrative of the feature.

## Usage

```
$> cucaroo

Feature: Successful feature runs
  As a BDD developer
  I want to implement and run cucumber tests
  So that I have regression testing, and a starting place for talking with product people

  Scenario: All is good
     Given  all step definitions are defined
     When   I run the feature
     Then   I should see all steps in green
     And    the exit code should be 0

$>
```

## Installation

```bash
npm install -g cucaroo
```

# Overview

Run tests against your feature steps.

## Successfully Passed Features

The good. Here is an example of a feature that is well defined and passes all of it's scenario's steps.

__Feature Definition__

```
Feature: Successful feature runs
  As a BDD developer
  I want to implement and run cucumber tests
  So that I have regression testing, and a starting place for talking with product people

  Scenario: All is good
    Given all step definitions are defined
    When I run the feature
    Then I should see all steps in green
    And the exit code should be 0
```

Here is our `step_definition` for this feature

```js
const expect = require('chai').expect;

module.exports = function(world) {
  world.given('all step definitions are defined', function(done) {
    expect(foo).to.be.ok;
    done();
  });

  world.when('I run the feature', function(done) {
    expect(bar).to.ok;
    done();
  });

  world.then('I should see all steps in green', function(done) {
    expect(baz.success).to.equal(4);
    done();
  });

  world.and('the exit code should be 0', function(done) {
    assert.equal(world.errors, 0);
    done();
  });
};
```

Assuming your tests successfully passed, you will get an exit code of `0`.

## Failed Features

The bad. During development and other situations, tests will fail. In the event your `cucuroo` test fails, you will received information on where and how a test failed. Here is an example of a feature failing.

__Feature Definition__

```
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
```

And then the `step_definition` file that actually does the assertions.

```js
const expect = require('chai').expect;

module.exports = function(world) {
  world.given('Things are moving along just fine', function(done) {
    done();
  });

  world.when('And then I make an assertion that aint true', function(done) {
    expect(true).to.be.(false);
    done();
  });

  world.then('I should see a helpful stack trace', function(done) {
    done();
  });

  world.and('the summary at the end reflects those errors', function(done) {
    done();
  });

  world.when('I make an error resulting in a runtime failure', function(done) {
    failHard();
  });
};
```

And with these failing steps, you will recevied the following output _(but with pretty colors)_.

```
Feature: Feature with a whole lot of errors
  As a BDD developer
  I want to see my regression tests fail
  So that I know my code works after modifications

  Scenario: Assertion failure
     Given  Things are moving along just fine
     When   And then I make an assertion that aint true  // step threw an error; halting scenario

AssertionError: it isnt like we thought
    at StepDefinition.implementation (/Users/user1/Projects/cucaroo/test/features/step_definitions/failing-steps.js:11:5)
    at Step.run (/Users/user1/Projects/cucaroo/lib/step.js:25:23)
    at StepCollection.runStepUnlessHalted (/Users/user1/Projects/cucaroo/lib/step-collection.js:53:10)
    at /Users/user1/Projects/cucaroo/lib/step-collection.js:30:33
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:3830:24
    at replenish (/Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:946:17)
    at iterateeCallback (/Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:931:17)
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:906:16
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:3835:13
    at definition.implementation (/Users/user1/Projects/cucaroo/lib/step.js:33:9)

     Then  I should see a helpful stack trace
     And   the summary at the end reflects those errors

  Scenario: Runtime errors
     Given  Things are moving along just fine
     When   I make an error resulting in a runtime failure  // step threw an error; halting scenario

ReferenceError: failHard is not defined
    at StepDefinition.implementation (/Users/user1/Projects/cucaroo/test/features/step_definitions/failing-steps.js:24:5)
    at Step.run (/Users/user1/Projects/cucaroo/lib/step.js:25:23)
    at StepCollection.runStepUnlessHalted (/Users/user1/Projects/cucaroo/lib/step-collection.js:53:10)
    at /Users/user1/Projects/cucaroo/lib/step-collection.js:30:33
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:3830:24
    at replenish (/Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:946:17)
    at iterateeCallback (/Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:931:17)
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:906:16
    at /Users/user1/Projects/cucaroo/node_modules/async/dist/async.js:3835:13
    at definition.implementation (/Users/user1/Projects/cucaroo/lib/step.js:33:9)

     Then   I should see a helpful stack trace
     And    the summary at the end reflects those errors


Some features failed:

  Features -   Passing: 0, Failing: 1
  Scenarios -  Passing: 0, Failing: 2
  Steps -      Passing: 2, Failing: 2
```

# Config

`TODO`

# Project Structure

`TODO`

# Contributing

`TODO`
