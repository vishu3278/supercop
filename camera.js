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
    var base64img = " data:image/png;base64,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";
    window.DownloadImageToGallery.download(base64img,function(){
          alert("success");
      },function(){
          alert("error");
      });
}

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
