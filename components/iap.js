define(["apphost","globalize","shell"],function(appHost,globalize,shell){"use strict";function getProductInfo(feature){return null}function showExternalPremiereInfo(){shell.openUrl("https://emby.media/premiere")}function beginPurchase(feature,email){return showExternalPremiereInfo(),Promise.reject()}function restorePurchase(id){return Promise.reject()}function getSubscriptionOptions(){var options=[];return options.push({id:"embypremiere",title:globalize.translate("sharedcomponents#HeaderBecomeProjectSupporter"),requiresEmail:!1}),Promise.resolve(options)}function isUnlockedByDefault(feature,options){var autoUnlockedFeatures=appHost.unlockedFeatures?appHost.unlockedFeatures():[];return autoUnlockedFeatures.indexOf(feature)!=-1?Promise.resolve():Promise.reject()}function getAdminFeatureName(feature){return feature}function getRestoreButtonText(){return globalize.translate("sharedcomponents#ButtonAlreadyPaid")}function getPeriodicMessageIntervalMs(feature){return"playback"===feature?864e5:0}return{getProductInfo:getProductInfo,beginPurchase:beginPurchase,restorePurchase:restorePurchase,getSubscriptionOptions:getSubscriptionOptions,isUnlockedByDefault:isUnlockedByDefault,getAdminFeatureName:getAdminFeatureName,getRestoreButtonText:getRestoreButtonText,getPeriodicMessageIntervalMs:getPeriodicMessageIntervalMs}});