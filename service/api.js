(function (app, config) {

    "use strict";

    app.factory('api', ['$resource', function ($resource) {

        var req;

        return {
            folder: $resource(
                config.api.base + '/folder/:id',
                {},
                {
                    create: {
                        method: 'POST',
                        params: {},
                        transformRequest: function (data) {

                            req = data;
                        },
                        transformResponse: function (response) {

                            return {
                                name: req.foldername,
                                type: "dir"
                            };
                        }
                    },
                    list: {
                        method: 'GET',
                        isArray: true,
                        params: {},
                        transformResponse: function (response) {

                            return angular.fromJson(response.toJSON ? response.toJSON() : response);
                        }
                    },
                    delete: {
                        method: 'DELETE'
                    },
                    rename: {
                        method: 'PUT',
                        transformRequest: function (data) {

                            req = data;
                        },
                        transformResponse: function (response) {

                            return {
                                name: req.name
                            };
                        }
                    },
                    move: {
                        url: config.api.base + '/folder/:id/move',
                        method: 'POST'
                    }
                }
            ),
            image: $resource(
                config.api.base + '/folder/:id',
                {},
                {
                    create: {
                        method: 'POST',
                        params: {},
                        transformRequest: function (data) {

                            req = data;
                        },
                        transformResponse: function (response) {

                            return {
                                name: req.name,
                                url: req.imageUrl,
                                type: "image"
                            };
                        }
                    }
                }
            )
        };

    }]);

})(window.app, window.config);