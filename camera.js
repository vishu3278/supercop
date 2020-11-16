function initdevice() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    navigator.notification.alert("device ready");
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

function cameraGo() {
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

    navigator.camera.getPicture(successCallback, errorCallback, options);

    function successCallback(imageData) {
        document.getElementById("imgPreview").src = "data:image/jpeg;base64," + imageData;
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

function exitApp() {
    navigator.app.exitApp();
}