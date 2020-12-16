function initdevice() {
    console.log("Body loaded");
    setTimeout(function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    }, 3000);
}

function onDeviceReady() {
    navigator.notification.alert("Device Ready");
    checkConnection();
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
}

function onOffline() {
    navigator.notification.alert("You lost connection!");
}

function onOnline() {
    navigator.vibrate([100, 200, 100]);
    // navigator.notification.alert("You're connected");
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    // alert('Connection type: ' + states[networkState]);
    if (states[networkState] !== Connection.NONE) {
        navigator.vibrate([100, 100, 50]);
    } else {
        navigator.notification.alert("Connect to internet to proceed!");
    }
    return (states[networkState]);
}

var scanOptions = {
    'prompt_message': 'Scan a Code', // Change the info message. A blank message ('') will show a default message
    'orientation_locked': false, // Lock the orientation screen
    'camera_id': 0, // Choose the camera source
    'beep_enabled': true, // Enables a beep after the scan
    'scan_type': 'normal', // Types of scan mode: normal = default black with white background / inverted = white bars on dark background / mixed = normal and inverted modes
    'barcode_formats': [
        'QR_CODE'
    ], // Put a list of formats that the scanner will find. A blank list ([]) will enable scan of all barcode types
    'extras': {} // Additional extra parameters. See [ZXing Journey Apps][1] IntentIntegrator and Intents for more details
}

function scanQR(arguments) {
    window.plugins.zxingPlugin.scan(scanOptions, onSuccess, onFailure);

    function onSuccess(result) {
        navigator.vibrate([100, 50, 100, 50, 100]);
        navigator.notification.alert(result);
        window.sessionStorage.setItem('QRCODE', result);
    }

    function onFailure(err) {
        navigator.notification.alert(err);
    }
}

function cameraGo(event) {
    var options = {
        sourceType: Camera.PictureSourceType.CAMERA,
        EncodingType: 'jpeg',
        allowEdit: true,
        targetWidth: 400,
        targetHeight: 300,
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: true
    };
    var imgEl = document.querySelector("#"+event.target.getAttribute("value"));
    navigator.camera.getPicture(successCallback, errorCallback, options);
    
    function successCallback(imageData,event) {
        console.log(imgEl, imageData);
        if(imgEl != null){
            imgEl.src = "data:image/jpeg;base64," + imageData;
        }else if(document.querySelector("#imgPreview") != null){    
           document.querySelector("#imgPreview").src = "data:image/jpeg;base64," + imageData;
        }else{
            navigator.notification.alert("Image placeholder not found");
        }
        
        cameraClean();
    };

    function errorCallback(error) {
        navigator.notification.alert(error);
    }
}

function cameraClean() {
    navigator.camera.cleanup(onSuccess, onFail);

    function onSuccess() {
        console.log("Camera cleanup success.")
    }

    function onFail(message) {
        navigator.notification.alert('Camera cleanup failed because: ' + message);
    }
}

function openBrowser(url) {
    console.log(url);
    cordova.InAppBrowser.open(url, '_system','location=yes');
}

function exitApp() {
    navigator.app.exitApp();
}

/* other images and pdf codes */
function saveImg(){
    var options = { limit: 1 };
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
}
function captureSuccess(mediaFiles) {
    navigator.notification.alert(mediaFiles[0].width + 'w/h' + mediaFiles[0].height);
};
function captureError(error) {
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};
function html2pdf(){
    var fileName = "myPdfFile.pdf";
    var options = {
        documentSize: 'A4',
        type: 'base64'                
    };
    var pdfhtml = '<html><body style="font-size:120%">This is the demo <strong>pdf</strong> content generated from raw <em>html</em>.</body></html>';
    
    pdf.fromData(pdfhtml , options)
        .then(function(base64){               
            // To define the type of the Blob
            var contentType = "application/pdf";
            var folderpath;    
            if (cordova.file){ //is not available use instead
                folderpath = "file:///storage/emulated/0/Download/";
            }else{
                folderpath = cordova.file.externalRootDirectory + "Download/"; //you can select other folders
            }
            savebase64AsPDF(folderpath, fileName, base64, contentType);          
        })  
        .catch((err)=>console.err(err));
}
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
 
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
 
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
 
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
 
            var byteArray = new Uint8Array(byteNumbers);
 
            byteArrays.push(byteArray);
        }
 
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}
 
/**
 * Create a PDF file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
        });
    });
}
