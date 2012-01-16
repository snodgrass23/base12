(function() {

  var uploader = new qq.FileUploaderBasic({
    button: document.getElementById('async-file'),
    action: '/users/' + USER._id + '.json?ajaxupload=photo',
    debug: true,
    params: {_method: 'PUT'},
    onComplete: complete
  });
  
  function complete() {
    alert('Uploaded!');
  }

})();