var async = require('async');
var exec = require('child_process').exec;

function stylize(str, style) {
  var styles = {
  //styles
  'bold'      : [1,  22], 'italic'    : [3,  23],
  'underline' : [4,  24], 'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39], 'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39], 'cyan'      : [36, 39],
  'green'     : [32, 39], 'magenta'   : [35, 39],
  'red'       : [31, 39],'yellow'    : [33, 39]
  };
  return '\033[' + styles[style][0] + 'm' + str + '\033[' + styles[style][1] + 'm';
}

['bold', 'underline', 'italic',
  'inverse', 'grey', 'yellow',
  'red', 'green', 'blue',
  'white', 'cyan', 'magenta'].forEach(function (style) {

  String.prototype.__defineGetter__(style, function () {
    return stylize(this, style);
  });

});

// From https://github.com/bengourley/launch/blob/master/lib/action.js
function run(host, user, cmd, callback) {
  console.log('');

  var cmd = 'ssh ' + user + '@' + host + ' ' + cmd + '\n';
  process.stdout.write(('    ' + cmd).replace(/\n/g, '\n    ').cyan);

  var ssh = exec(cmd, function(err, stdout, stderr) {
    process.stdout.write((stdout).replace(/\n/g, '\n    ').grey);
    process.stderr.write((stderr).replace(/\n/g, '\n    ').red);
    return callback(err);
  });
}


function Session(host, user) {
  this.host = host;
  this.user = user;

  var self = this;
  this.series = function() {
    self._series.apply(self, arguments);
  }
}

Session.prototype = {

  _series: function(cmds, callback) {
    var self = this;
    var i = 0;
    async.whilst(
      function check() {
        return (i < cmds.length);
      },
      function loop(callback) {
        run(self.host, self.user, cmds[i], callback);
        i++;
      },
      function complete(err) {
        console.log("Series complete");
        return callback(err);
      }
    );
  }
};


module.exports = function (host, user) {
  var session = new Session(host, user);
  return session.series;
};
