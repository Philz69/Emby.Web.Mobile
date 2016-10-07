define(["appStorage","browser"],function(appStorage,browser){function getDeviceProfile(){return null}function getCapabilities(){var caps={PlayableMediaTypes:["Audio","Video"],SupportsPersistentIdentifier:!1,DeviceProfile:getDeviceProfile()};return caps}function generateDeviceId(){return new Promise(function(resolve,reject){require(["cryptojs-sha1"],function(){var keys=[];keys.push(navigator.userAgent),keys.push((new Date).getTime()),resolve(CryptoJS.SHA1(keys.join("|")).toString())})})}function getDeviceId(){var key="_deviceId2",deviceId=appStorage.getItem(key);return deviceId?Promise.resolve(deviceId):generateDeviceId().then(function(deviceId){return appStorage.setItem(key,deviceId),deviceId})}function getDeviceName(){var deviceName;return deviceName=browser.tizen?"Samsung Smart TV":browser.web0S?"LG Smart TV":browser.operaTv?"Opera TV":browser.xboxOne?"Xbox One":browser.ps4?"Sony PS4":browser.chrome?"Chrome":browser.edge?"Edge":browser.firefox?"Firefox":browser.msie?"Internet Explorer":"Web Browser",browser.version&&(deviceName+=" "+browser.version),browser.ipad?deviceName+=" Ipad":browser.iphone?deviceName+=" Iphone":browser.android&&(deviceName+=" Android"),deviceName}function supportsVoiceInput(){return!browser.tv&&(window.SpeechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition||window.oSpeechRecognition||window.msSpeechRecognition)}function supportsFullscreen(){if(browser.tv)return!1;var element=document.documentElement;return element.requestFullscreen||element.mozRequestFullScreen||element.webkitRequestFullscreen||element.msRequestFullscreen}var appInfo,supportedFeatures=function(){var features=["filedownload","sharing","externalpremium"];return browser.operaTv||browser.tizen||browser.web0s?features.push("exit"):features.push("exitmenu"),browser.operaTv||features.push("externallinks"),supportsVoiceInput()&&features.push("voiceinput"),browser.mobile&&!browser.edgeUwp||(features.push("htmlaudioautoplay"),features.push("htmlvideoautoplay")),window.SyncRegistered,supportsFullscreen()&&features.push("fullscreen"),browser.slow||features.push("imageanalysis"),features}(),version=window.dashboardVersion||"3.0";return{dvrFeatureCode:Dashboard.isConnectMode()?"dvr":"dvrl",getWindowState:function(){return document.windowState||"Normal"},setWindowState:function(state){alert("setWindowState is not supported and should not be called")},exit:function(){if(browser.tizen)try{tizen.application.getCurrentApplication().exit()}catch(err){console.log("error closing application: "+err)}else window.close()},supports:function(command){return supportedFeatures.indexOf(command.toLowerCase())!=-1},unlockedFeatures:function(){var features=[];return features.push("playback"),features},appInfo:function(){return appInfo?Promise.resolve(appInfo):getDeviceId().then(function(deviceId){return appInfo={deviceId:deviceId,deviceName:getDeviceName(),appName:"Emby Mobile",appVersion:version}})},capabilities:getCapabilities,moreIcon:browser.safari||browser.edge?"dots-horiz":"dots-vert"}});