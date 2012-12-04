var should = require('should');
var Zombie = require('zombie');
var assert = require('assert');

var utils = require('./test.utils');

var app = utils.startApp(3002);

describe('Browser', function() {
  describe('Assumptions:', function() {
    it('should have an empty users collection', function(done) {
      app.users.model.remove(done);
    });
  });
  describe('of an unregistered user', function() {
    var browser = new Zombie();
    it('should be able to view the landing page', function(done) {
      browser.visit('http://localhost:3002', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Sign in');
        return done();
      });
    });
    it('should not be able to view the dashboard', function(done) {
      browser.visit('http://localhost:3002/dashboard', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Sign in');
        browser.text('.flash-messages').should.include('Please log in first');
        return done();
      });
    });
    it('should be able to view the signup page', function(done) {
      browser.visit('http://localhost:3002/signup', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Sign up');
        return done();
      });
    });
    it('should not be able to create a user with a short password', function(done) {
      browser.visit('http://localhost:3002/signup', function() {
        browser
          .fill('email', 'too@short.com')
          .fill('password', 'bacon')
          .pressButton('Create')
          .then(function() {
            assert.ok(browser.success);
            browser.text('title').should.include('Sign in');
            browser.text('.flash-messages').should.include('Sorry, we were unable to create that account');
            return done();
          });
      });
    });
    it('should be able to create a user', function(done) {
      browser.visit('http://localhost:3002/signup', function() {
        browser
          .fill('email', 'test@dummy.com')
          .fill('password', 'baconbits')
          .pressButton('Create')
          .then(function() {
            assert.ok(browser.success);
            browser.text('title').should.include('Dashboard');
            browser.text('.flash-messages').should.include('Welcome');
            return done();
          });
      });
    });
  });
  describe('of a registered user', function() {
    var browser = new Zombie();
    it('should be able to view the landing page', function(done) {
      browser.visit('http://localhost:3002', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Sign in');
        return done();
      });
    });
    it('should get an error with bad credentials', function(done) {
      browser
        .fill('email', 'test@dummy.com')
        .fill('password', 'wrong')
        .pressButton('Sign in')
        .then(function() {
          assert.ok(browser.success);
          browser.text('title').should.include('Sign in');
          browser.text('.flash-messages').should.include('Sorry, that username or password was not found');
          return done();
        })
        .fail(done);
    });
    it('should be able to sign in with good credentials', function(done) {
      browser
        .fill('email', 'test@dummy.com')
        .fill('password', 'baconbits')
        .pressButton('Sign in')
        .then(function() {
          assert.ok(browser.success);
          browser.text('title').should.include('Dashboard');
          return done();
        })
        .fail(done);
    });
    it('should be able to reload the dashboard', function(done) {
      browser.visit('http://localhost:3002/dashboard', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Dashboard');
        return done();
      });
    });
    it('should be able to sign out', function(done) {
      browser.clickLink('Sign out', function() {
        assert.ok(browser.success);
        browser.text('title').should.include('Sign in');
        browser.text('.flash-messages').should.include('You have been signed out');
        return done();
      });
    });
  });
});