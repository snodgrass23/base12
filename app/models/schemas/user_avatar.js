
var UserAvatar = new server.mongoose.Schema({
  path      : { type: String },
  type      : { type: String },
  size      : { type: Number }
});

// Plugins

UserAvatar.plugin(models.plugins.timestamps);
UserAvatar.plugin(models.plugins.whitelist);

// setter

UserAvatar.path('path').set(function(path) {

  console.log("setting avatar path:", path);

  var basename = require('path').basename(path).split(".");
  console.log(basename);
  if (basename.length > 1) basename.pop();
  var filename = basename.join(".")+'.jpg';
  var dest = '/uploads/avatars/'+filename;

  require("imagemagick").crop({
          srcPath: path,
          dstPath: server.set('public') + dest,
          width: 300,
          height: 300}, function(err){
            console.log("err? ", err);
            require('fs').unlink(path);
          });

  console.log(dest);
  return dest;
});

module.exports = UserAvatar;
