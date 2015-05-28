import React from 'react'
import request from 'superagent'

let ReactDropzone = React.createClass({

    render: function () {
        let self = this;
        Dropzone.options.testdropzone = {
        	init: function() {
			    this.on("addedfile", function(file) { 
			    	console.log("files added");
			    	console.log(this.files);
			    });
			    
			  },
			  paramName: "file", // The name that will be used to transfer the file
			  maxFilesize: 2, // MB
			  addRemoveLinks: true,
			  autoProcessQueue: false,
			  previewsContainer: '.dropzone-previews',
			  previewTemplate:'	<div class="dz-preview dz-file-preview">'+
								'<div class="dz-details">'+
								'<div class="dz-filename"><span data-dz-name></span></div>'+
								'<div class="dz-size" data-dz-size></div>'+
								'<img data-dz-thumbnail />'+
								'</div>'+
								'<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>'+
								'<div class="dz-success-mark"><span>✔</span></div>'+
								'<div class="dz-error-mark"><span>✘</span></div>'+
								'<div class="dz-error-message"><span data-dz-errormessage></span></div>'+
								'</div>',
		};
        return (
           	<div className="container">
           	<div className="col-xs-6">
        		<form action="/file-upload" className="dropzone" id="testdropzone"></form>
       		</div>
       		<div className="col-xs-6 dropzone-previews"></div>

           </div>

        );
    },
});



module.exports = ReactDropzone;