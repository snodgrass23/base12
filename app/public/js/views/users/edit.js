(function() {

  var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'choosefile',
    container: 'filecontainer',
    max_file_size: '5mb',
    url: '/users/docs',
    flash_swf_url : '/js/lib/plupload/plupload.flash.swf',
    silverlight_xap_url : '/js/lib/plupload/plupload.silverlight.xap',
    urlstream_upload: true,
    filters : [
      { title : "Image files", extensions : "pdf,txt,doc,docx"}
    ]
  });

  uploader.bind('Init', function(up, params) {
    console.log('Runtime:', params.runtime);
  });

  uploader.init();

  uploader.bind('FilesAdded', function(up, files) {
    uploader.start();
  });

  uploader.bind('UploadProgress', function(up, file) {
    console.log('Progress:', file.percent);
  });

  uploader.bind('Error', function(up, err) {
    console.log('Err:', err);
  });

  uploader.bind('FileUploaded', function(up, file, response) {
    console.log('Complete:', file);
    response = JSON.parse(response.response);
    console.log('Response:', response);

    if (response.code === 200) {
      var new_input = $('<input class="doc" name="docs" type="hidden" />');
      new_input.val(response.data._id);
      new_input.appendTo('#doclist');
    }
  });

})();