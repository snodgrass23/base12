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

          if (err.name == 'ValidationError') {
            err_message = "Please check the following fields: ";
            var error_fields = [];
            _.each(err.errors, function(e) { error_fields.push(e.path); });
            err_message += error_fields.join(", ");
          }

          req.flash(err_message);
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
        if (user) req.session.user = user;
        else req.flash('Sorry, that username or password was not found.');

        return res.redirect('/');
      });
    },

    resetPassword: function(req,res,next) {
      UserModel.findByEmail(req.body.email, function(err, user) {
        if (err || !user || user.length < 1) {
          req.flash("Sorry, that email does not seem to be registered.");
          return res.redirect('/reset');
        }

        var newPassword = _gen_password();
        user.password = newPassword;
        user.resetPassword = true;

        user.save(function(err) {
          if (err) {
            req.flash("Sorry, there was an error while resetting the password.");
            return res.redirect('/reset');
          }

          req.flash("A new password has been sent to that email address.");
          res.redirect('/');

          app.emailer.send('password_reset', {
            name: user.name,
            to: user.email,
            password: newPassword,
            querystring: "password="+encodeURIComponent(newPassword)+"&email="+encodeURIComponent(user.email)
          });

        });
      });
    }

  };
};


function _gen_password() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',
      length = 8,
      password = '';
  while (length--) {
    var pos = ~~(Math.random() * chars.length);
    password += chars.charAt(pos);
  }
  return password;
}