define([], function () {
    'use strict';

    return {
        fileExists: function (path) {
            return Promise.reject();
        },
        directoryExists: function (path) {
            return Promise.reject();
        }
    };
});