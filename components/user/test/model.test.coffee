# tests for user model

should = require 'should';
UserModel = require('../model/userModel')();
props =
  name:"testUser"
  email:"testUser@test.com"
  password:"password"

update =
  name:"newName"

describe 'User model', () ->

  before (done) ->
    require('mongoose').connect 'mongodb://localhost/base12_test', (err) ->
      throw new Error err.message if err
      done()

  before (done) ->
    UserModel.find().remove done()

  after (done) ->
    UserModel.find().remove done()

  describe 'CRUD', () ->

    after (done) ->
      UserModel.find().remove done()

    it 'should throw errors without an email address', (done) ->
      noEmail = 
        name:"testUser"
        password:"password"
      new UserModel(noEmail).save (err) ->
        should.exist err
        err.name.should.eql 'ValidationError'
        should.exist err.errors.email
        done()

    it 'should throw errors without a password', (done) ->
      noPassword =
        name:"testUser"
        email:"testUser@test.com"
      new UserModel(noPassword).save (err) ->
        should.exist err
        err.name.should.eql 'ValidationError'
        should.exist err.errors.password
        done()

    it 'should save successfully with valid data', (done) ->
      @testUser = new UserModel(props)
      @testUser.save (err, user) ->
        should.not.exist err
        user.name.should.eql props.name
        user.email.should.eql props.email
        done()

    it 'should show created user in database', (done) ->
      UserModel.find().exec (err, results) ->
        should.not.exist err
        results.length.should.be.above 0
        done()
    
    it 'should delete successfully', (done) ->
      @testUser.remove (err) ->
        should.not.exist err
        done()

    it 'should now have no users in database', (done) ->
      UserModel.find().exec (err, results) ->
        should.not.exist err
        results.should.be.empty
        done()

  describe 'authenticate()', () ->
    
    before (done) ->
      @testAccount = new UserModel props
      @testAccount.save done

    after (done) ->
      @testAccount.remove done

    it 'should reject a request without an email', (done) ->
      UserModel.authenticate { password: props.password }, (err, user) ->
        should.exist err
        should.not.exist user
        err.message.should.equal 'Email and pass required'
        done()

    it 'should reject a request without a password', (done) ->
      UserModel.authenticate { email: props.email }, (err, user) ->
        should.exist err
        should.not.exist user
        err.message.should.equal 'Email and pass required'
        done()

    it 'should reject a request with the wrong password', (done) ->
      UserModel.authenticate { email: props.email, password: 'wrong' }, (err, user) ->
        should.exist err
        should.not.exist user
        err.message.should.equal 'Unable to login'
        done()

    it 'should reject a request with a non-registered email', (done) ->
      UserModel.authenticate { email: 'doesnt@exist.com', password: props.password }, (err, user) ->
        should.exist err 
        should.not.exist user 
        err.message.should.equal 'Unable to login'
        done()

    it 'should accept a valid email/password', (done) ->
      UserModel.authenticate { email: props.email, password: props.password }, (err, user) ->
        should.not.exist err
        should.exist user
        user.email.should.eql props.email
        done()