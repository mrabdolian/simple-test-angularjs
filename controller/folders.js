(function (app) {

    'use strict';

    app.controller('foldersCtrl', ['$scope', 'api', function ($scope, api) {

        $scope.init = function () {

            $scope.model = {
                orderReverse: false,
                name: 'Root',
                path: '',
                items: []
            };

            $scope.load('');
        };

        $scope.createFolder = function () {

            swal({
                title: 'New folder name:',
                input: 'text',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: function (name) {

                    return new Promise(function (resolve, reject) {

                        api.folder.create(
                            {
                                id: $scope.model.path
                            },
                            {
                                foldername: name
                            },
                            function (response) {

                                $scope.model.items.push(response);
                                resolve();
                            },
                            function (response) {
                                reject('Error.')
                            }
                        );
                    })
                },
                allowOutsideClick: false
            });
        };

        $scope.addImage = function () {

            swal.setDefaults({
                input: 'text',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2'],
                allowOutsideClick: false,
                // preConfirm: function (imageUrl) {
                //
                //     return new Promise(function (resolve, reject) {
                //
                //         api.image.create(
                //             {
                //                 id: $scope.model.path
                //             },
                //             {
                //                 imageUrl: imageUrl
                //             },
                //             function (response) {
                //
                //                 $scope.model.items.push(response);
                //                 resolve();
                //             },
                //             function (response) {
                //                 reject('Error.')
                //             }
                //         );
                //     })
                // }
            });

            var steps = [
                {
                    title: 'Image name:'
                },
                {
                    title: 'Image URL:',
                    animation: false
                }
            ];

            swal.queue(steps).then(function (result) {

                    return new Promise(function (resolve, reject) {
                        api.image.create(
                            {
                                id: $scope.model.path
                            },
                            {
                                name: result[0],
                                imageUrl: result[1]
                            },
                            function (response) {

                                $scope.model.items.push(response);
                                resolve();
                            },
                            function (response) {
                                reject('Error.')
                            }
                        );
                    })

            }).then(function () {

                swal.resetDefaults();
                swal({
                    type: 'success',
                    title: 'Image added!',
                    showCancelButton: false
                });
            });


            //     function () {
            //
            //     swal.resetDefaults();
            //     swal({
            //         title: 'Image added!',
            //         showCancelButton: false
            //     });
            // });

            // swal({
            //     title: 'New image URL:',
            //     input: 'text',
            //     showCancelButton: true,
            //     showLoaderOnConfirm: true,
            //     preConfirm: function (imageUrl) {
            //
            //         return new Promise(function (resolve, reject) {
            //
            //             api.image.create(
            //                 {
            //                     id: $scope.model.path
            //                 },
            //                 {
            //                     imageUrl: imageUrl
            //                 },
            //                 function (response) {
            //
            //                     $scope.model.items.push(response);
            //                     resolve();
            //                 },
            //                 function (response) {
            //                     reject('Error.')
            //                 }
            //             );
            //         })
            //     },
            //     allowOutsideClick: false
            // });
        };

        $scope.delete = function (item) {
            console.log($scope.model.path + item.name);

            swal({
                type: 'warning',
                title: 'Are you sure',
                text: 'that you want to delete ' + item.name + '?',
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonText: 'Yes',
                allowOutsideClick: false
            }).then(function () {

                api.folder.delete(
                    {
                        id: $scope.model.path + item.name
                    },
                    function () {
                        $scope.model.items.splice($scope.model.items.indexOf(item), 1);
                    },
                    function () {
                        console.log('error');
                    }
                );
            });
        };

        $scope.rename = function (item) {

            swal({
                title: 'Folder/File name:',
                input: 'text',
                inputValue: item.name,
                showCancelButton: true,
                allowOutsideClick: false
            }).then(function (name) {

                api.folder.rename(
                    {
                        id: $scope.model.path + item.name
                    },
                    {
                        name: name
                    },
                    function (response) {

                        angular.extend(item, response);
                    },
                    function () {

                        console.log('error');
                    }
                );
            });
        };

        $scope.move = function (item) {

            swal({
                title: 'Destination path:',
                input: 'text',
                inputValue: $scope.model.path,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: function (path) {

                    return new Promise(function (resolve, reject) {

                        api.folder.move(
                            {
                                id: $scope.model.path + item.name
                            },
                            {
                                destination: path
                            },
                            function (response) {
                                resolve();
                            },
                            function (response) {
                                reject('Error.')
                            }
                        );
                    })
                },
                allowOutsideClick: false
            }).then(function (name) {
                swal({
                    type: 'success',
                    title: 'Folder moved!'
                })
            });
        };

        $scope.changeOrderDirection = function () {

            $scope.model.orderReverse = !$scope.model.orderReverse;
        };

        $scope.up = function () {

            if ($scope.model.path === '/') {
                return;
            }

            var newPath = $scope.model.path.substring($scope.model.path.lastIndexOf("/"), -1);
            newPath = newPath.substring(newPath.lastIndexOf("/"), -1);


            var parentFolder = newPath.substring(newPath.lastIndexOf("/"));
            parentFolder = parentFolder.substring(1);

            console.log(newPath);
            console.log(parentFolder);
            $scope.model.items = api.folder.list(
                {
                    id: (newPath === '' ? 'folder.json' : newPath + '/' + parentFolder + '.json')
                },
                function () {
                    $scope.model.path = newPath + '/';
                    $scope.model.name = (newPath === '' ? 'Root' : parentFolder);
                }
            );

        };

        $scope.load = function (foldername) {

            $scope.model.items = api.folder.list(
                {
                    id: (foldername === '' ? 'folder.json' : $scope.model.path + '/' + foldername + '/' + foldername + '.json')
                },
                function () {
                    $scope.model.path += foldername + '/';
                    $scope.model.name = ($scope.model.path === '/' ? 'Root' : foldername);
                }
            );
        };

        $scope.init();

    }]);

})(window.app);