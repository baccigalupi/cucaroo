'use strict';

const assert = require('assert');

module.exports = function(world) {
  let pending = world.pending;
  let browser = world.browser;

  world.given('I come to the Census survey for the first time', (done) => {
    browser
      .visit('/')
      .then(() => {
        let title = browser.text('h1');
        assert(title.match(/Welcome to the \d+ Census Test/)); 
        done();
      }).
      catch(done);
  });

  world.when('I click to start my questionnaire', function(done) {
    browser
      .pressButton('Start Questionnaire')
      .then(done)
      .catch(done);
  });

  world.then('I should be on the login page', function (done) {
    let title = browser.text('h1');
    assert(title.match(/Welcome to the \d+ Census Test/));
    let location = browser.location._url;
    assert(location.match(/\/login$/));
    done();
  });

  world.then('I should see a form asking for the id sent on my postcard', function (done) {
    let nodes = browser.queryAll('form.form-signin');
    assert.equal(nodes.length, 1);
    done();
  });

  world.then('I should see a link to sign in without an id', function (done) {
    let nodes = browser.queryAll('a[href="/nonid/register"]')
    assert.equal(nodes.length, 1);
    done();
  });
};
