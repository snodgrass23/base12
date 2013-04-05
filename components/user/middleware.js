module.exports = function(app) {

  var UserModel = app.user.model;

  return {

    endSession: function(req, res, next) {
      req.session.regenerate(next);
    },

    updateUser: function(req, res, next) {
      if (req.body.new_password) {
        if (req.body.new_password == req.body.new_password2) {
          req.body.password = req.body.new_password;
        }
        else {
          req.flash("The passwords did not match.");
          return next();
        }
      }

      UserModel.findById(req.session.user._id, function(err, user) {
        if (err || !user) {
          req.flash("There was an error finding the user.");
          return next(err);
        }

        _.extend(user, req.body);

        user.save(function(err) {
          if (err) {
            console.log(err);
            req.flash("There was an error updating the user.");
            return next();
          }

          req.session.user = user;
          return next();
        });
      });
    },

    doRegister: function(req, res, next) {
      var user = new UserModel(req.body);
      user.save(function(err) {
        if (err) {
          var err_message = ((err+"").indexOf("duplicate key error") > -1) ? "That email address is already registered." : err;
          req.flash(err_message);
          console.log(err);
          return res.redirect('/register');
        }
        else return next();
      });
    },


    doSignIn: function(req, res) {
      var creds = {
          email: req.body.email,
          password: req.body.password
        };
      UserModel.authenticate(creds, function(err, user) {
        if (user) {
          req.session.user = user;
          return res.redirect('/dashboard');
        }
        else {
          req.flash('Sorry, that username or password was not found.');
          return res.redirect('/');
        }
      });
    }

  };
};