define(['appStorage', 'browser'], function (appStorage, browser) {
    'use strict';

    function getDeviceProfile() {

        // TODO
        return null;
    }

    function getCapabilities() {

        var caps = {
            PlayableMediaTypes: ['Audio', 'Video'],

            SupportsPersistentIdentifier: false,
            DeviceProfile: getDeviceProfile()
        };

        return caps;
    }

    function generateDeviceId() {
        return new Promise(function (resolve, reject) {

            require(["cryptojs-sha1"], function () {

                var keys = [];
                keys.push(navigator.userAgent);
                keys.push(new Date().getTime());

                resolve(CryptoJS.SHA1(keys.join('|')).toString());
            });
        });
    }

    function getDeviceId() {
        var key = '_deviceId2';
        var deviceId = appStorage.getItem(key);

        if (deviceId) {
            return Promise.resolve(deviceId);
        } else {
            return generateDeviceId().then(function (deviceId) {
                appStorage.setItem(key, deviceId);
                return deviceId;
            });
        }
    }

    function getDeviceName() {
        var deviceName;

        if (browser.tizen) {
            deviceName = "Samsung Smart TV";
        } else if (browser.web0S) {
            deviceName = "LG Smart TV";
        } else if (browser.operaTv) {
            deviceName = "Opera TV";
        } else if (browser.xboxOne) {
            deviceName = "Xbox One";
        } else if (browser.ps4) {
            deviceName = "Sony PS4";
        } else if (browser.chrome) {
            deviceName = "Chrome";
        } else if (browser.edge) {
            deviceName = "Edge";
        } else if (browser.firefox) {
            deviceName = "Firefox";
        } else if (browser.msie) {
            deviceName = "Internet Explorer";
        } else {
            deviceName = "Web Browser";
        }

        if (browser.version) {
            deviceName += " " + browser.version;
        }

        if (browser.ipad) {
            deviceName += " Ipad";
        } else if (browser.iphone) {
            deviceName += " Iphone";
        } else if (browser.android) {
            deviceName += " Android";
        }

        return deviceName;
    }

    function supportsVoiceInput() {

        if (browser.tv) {
            return false;
        }

        return window.SpeechRecognition ||
               window.webkitSpeechRecognition ||
               window.mozSpeechRecognition ||
               window.oSpeechRecognition ||
               window.msSpeechRecognition;
    }

    function supportsFullscreen() {

        if (browser.tv) {
            return false;
        };

        var element = document.documentElement;

        if (element.requestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen ||
            element.msRequestFullscreen) {

            return true;
        }

        // safari
        if (document.createElement('video').webkitEnterFullscreen) {
            return true;
        }

        return false;
    }

    function getSyncProfile() {

        return new Promise(function (resolve, reject) {

            require(['browserdeviceprofile', 'appSettings'], function (profileBuilder, appSettings) {

                var profile = profileBuilder();

                profile.MaxStaticMusicBitrate = appSettings.maxStaticMusicBitrate();

                resolve(profile);
            });
        });
    }

    var htmlMediaAutoplayAppStorageKey = 'supportshtmlmediaautoplay0';
    function supportsHtmlMediaAutoplay() {

        if (browser.edgeUwp || browser.tv || browser.ps4 || browser.xboxOne) {
            return true;
        }

        if (browser.mobile) {
            return false;
        }

        var savedResult = appStorage.getItem(htmlMediaAutoplayAppStorageKey);
        if (savedResult === 'true') {
            return true;
        }
        if (savedResult === 'false') {
            return false;
        }

        // unknown at this time
        return null;
    }

    var supportedFeatures = function () {

        var features = [
            'sharing',
            'externalpremium'
        ];

        if (!browser.edgeUwp && !browser.tv && !browser.xboxOne && !browser.ps4) {
            features.push('filedownload');
        }

        if (browser.operaTv || browser.tizen || browser.web0s) {
            features.push('exit');
        } else {
            features.push('exitmenu');
        }

        if (!browser.operaTv) {
            features.push('externallinks');
        }

        if (supportsVoiceInput()) {
            features.push('voiceinput');
        }

        if (supportsHtmlMediaAutoplay()) {
            features.push('htmlaudioautoplay');
            features.push('htmlvideoautoplay');
        }

        if (window.SyncRegistered) {
            //features.push('sync');
        }

        if (supportsFullscreen()) {
            features.push('fullscreenchange');
        }

        if (browser.chrome || (browser.edge && !browser.slow)) {
            // This is not directly related to image analysis but it't a hint the device is probably too slow for it
            if (!browser.noAnimation) {
                features.push('imageanalysis');
            }
        }

        if (Dashboard.isConnectMode()) {
            features.push('multiserver');
        }

        if (browser.tv || browser.xboxOne || browser.ps4 || browser.mobile) {
            features.push('physicalvolumecontrol');
        }

        if (!browser.tv && !browser.xboxOne && !browser.ps4) {
            features.push('remotecontrol');
        }

        return features;
    }();

    if (supportedFeatures.indexOf('htmlvideoautoplay') === -1 && supportsHtmlMediaAutoplay() !== false) {
        require(['autoPlayDetect'], function (autoPlayDetect) {
            autoPlayDetect.supportsHtmlMediaAutoplay().then(function () {
                appStorage.setItem(htmlMediaAutoplayAppStorageKey, 'true');
                supportedFeatures.push('htmlvideoautoplay');
                supportedFeatures.push('htmlaudioautoplay');
            }, function () {
                appStorage.setItem(htmlMediaAutoplayAppStorageKey, 'false');
            });
        });
    }

    var appInfo;
    var version = window.dashboardVersion || '3.0';

    return {
        getWindowState: function () {
            return document.windowState || 'Normal';
        },
        setWindowState: function (state) {
            alert('setWindowState is not supported and should not be called');
        },
        exit: function () {

            if (browser.tizen) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (err) {
                    console.log('error closing application: ' + err);
                }
                return;
            }

            window.close();
        },
        supports: function (command) {

            return supportedFeatures.indexOf(command.toLowerCase()) != -1;
        },
        appInfo: function () {

            if (appInfo) {
                return Promise.resolve(appInfo);
            }

            return getDeviceId().then(function (deviceId) {

                appInfo = {
                    deviceId: deviceId,
                    deviceName: getDeviceName(),
                    appName: 'Emby Mobile',
                    appVersion: version
                };

                return appInfo;
            });
        },
        capabilities: getCapabilities,
        preferVisualCards: browser.android || browser.chrome,
        moreIcon: browser.safari || browser.edge ? 'dots-horiz' : 'dots-vert',
        getSyncProfile: getSyncProfile
    };
});