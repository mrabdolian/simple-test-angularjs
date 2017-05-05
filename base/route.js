(function (app) {

    'use strict';

    app.config(['$locationProvider', '$urlRouterProvider', '$stateProvider',
        function ($locationProvider, $urlRouterProvider, $stateProvider) {

            // enable html5 mode
            $locationProvider.html5Mode(true);

            // set default url
            $urlRouterProvider.otherwise('/folders');

            // route config
            $stateProvider

                // root
                .state('root', {
                    url: '',
                    abstract: true,
                    template: '<ui-view />'
                })

                // root.folders
                .state('root.folders', {
                    url: '/folders',
                    controller: 'foldersCtrl',
                    templateUrl: 'template/folders.html'
                })
        }
    ]);

})(window.app);