'use strict';

/**
 * @ngdoc service
 * @name cat.service.loading:loadingService
 */
angular.module('cat.service.loading', ['angularSpinner'])
    .constant('CAT_LOADING_SERVICE_DEFAULTS', {
        timeout: 50,
        animationDuration: 200
    })
    .service('loadingService', [
        '$rootScope',
        '$timeout',
        'usSpinnerService',
        'CAT_LOADING_SERVICE_DEFAULTS',
        function CatLoadingService($rootScope, $timeout, usSpinnerService, CAT_LOADING_SERVICE_DEFAULTS) {
            var that = this;
            var activeCount = 0;
            var startTime;
            var startTimer, stopTimer;

            this.start = function () {
                if (!activeCount && !startTimer) {
                    if (!!stopTimer) {
                        $timeout.cancel(stopTimer);
                        stopTimer = undefined;
                    }
                    startTimer = $timeout(function () {
                        usSpinnerService.spin('loading-spinner');
                        $rootScope.loading = true;
                        startTime = new Date().getTime();
                    }, CAT_LOADING_SERVICE_DEFAULTS.timeout);
                }
                activeCount++;
            };

            this.stop = function () {
                activeCount--;
                if (!activeCount && !stopTimer) {
                    if (!!startTimer) {
                        $timeout.cancel(startTimer);
                        startTimer = undefined;
                    }
                    var now = new Date().getTime();
                    var stopTimeout = CAT_LOADING_SERVICE_DEFAULTS.timeout + (Math.max((CAT_LOADING_SERVICE_DEFAULTS.animationDuration - (now - startTime)), 0));
                    stopTimer = $timeout(function () {
                        usSpinnerService.stop('loading-spinner');
                        $rootScope.loading = false;
                    }, stopTimeout);
                }
            };

            var stateChangeInProgress = false;

            $rootScope.$on('$stateChangeStart', function () {
                if (!stateChangeInProgress) {
                    that.start();
                    stateChangeInProgress = true;
                }

            });
            $rootScope.$on('$stateChangeSuccess', function () {
                that.stop();
                stateChangeInProgress = false;
            });
            $rootScope.$on('$stateChangeError', function () {
                that.stop();
                stateChangeInProgress = false;
            });
        }]);
