(function() {
  'use strict';

  angular.module('app', [
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ui.router',
    'ngMaterial'
  ])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('lime')
        .warnPalette('orange')
        .backgroundPalette('grey')
        .dark();
  });

})();
