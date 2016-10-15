// public/core.js
var CalApp = angular.module('CalApp', ['ngProgress', 'ngAnimate'])
    .controller('calCtrl', ['$scope', '$http', '$timeout', 'ngProgressFactory', function ($scope, $http, $timeout, ngProgressFactory) {
        $scope.showVals = false;
        $scope.valueItem = null;
        var dataCompanies = null;
        $scope.dataLength = 0;
        var companyList = null;

        $http.get('/data/items.json').success(function (data) {
            $scope.dataItems = data.items;
        });

        $http.get('/data/weights.json').success(function (data) {
            $scope.weightItems = data.weights;
        });

        function isArray(ob) {
            return Object.prototype.toString.call(ob) === '[object Array]';
        }

        $scope.calculate = function (price, weight, value) {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setHeight('5px');
            $scope.progressbar.setColor('#348dd9');
            $scope.progressbar.start();

            $http.get('/data/data.json').success(function (data) {
                dataCompanies = data.companies;
                $scope.dataLength = data.companies.length;
            });
            $timeout(function () {
                $scope.companiesArray = [];
                var feeCheck = [];
                $scope.feeCheck = feeCheck;
                for (var i = 0; i < $scope.dataLength; i++) {

                    for (var j = 0; j < dataCompanies[i].itemType.length; j++) {
                        if (dataCompanies[i].itemType[j].type == value) {
                            $scope.feeCheck[i] = false;
                            var calVal = null;
                            calVal = dataCompanies[i].itemType[j];
                            var fee = 0;
                            var final = price;
                            var amr = final += price * (calVal.custom / 100);
                            var taxx = final += final * (calVal.tax / 100);

                            var feee = 0;
                            if (calVal.feeNotPercent != null) {
                                if (price <= 99) {
                                    feee = final += calVal.feeNotPercent;
                                    $scope.feeCheck[i] = true;
                                    fee = calVal.feeNotPercent;
                                } else {
                                    feee = final += price * (calVal.fee / 100);
                                    fee = calVal.fee;
                                }
                            } else {
                                feee = final += price * (calVal.fee / 100);
                                fee = calVal.fee;
                            }
                            var shpp = 0;
                            if (isArray(calVal.shipping)) {
                                shpp = final += calVal.shipping[weight - 1];
                            } else {
                                shpp = final += (calVal.shipping * weight);
                            }
                            var clears = final += (calVal.clear)
                            final *= calVal.dollar
                            final += calVal.sub;

                            if (isArray(calVal.shipping)) {
                                $scope.companiesArray.push({
                                    img: dataCompanies[i].img,
                                    name: dataCompanies[i].name,
                                    customcheck: calVal.customcheck,
                                    custom: calVal.custom,
                                    tax: calVal.tax,
                                    fee: fee,
                                    shipping: calVal.shipping[weight - 1],
                                    cusship: (calVal.shipping * weight) / 50,
                                    dollar: calVal.dollar,
                                    desc: dataCompanies[i].desc,
                                    finalzcus: amr - price,
                                    finaltax: taxx - amr,
                                    finalfee: feee - taxx + calVal.fez,
                                    clearsh: calVal.clear,
                                    finalshpp: shpp - feee,
                                    finalpriceoutd: shpp,
                                    dprice: clears,
                                    newfee: price * calVal.fee,
                                    subsc: calVal.sub,
                                    final: final
                                });
                            } else {
                                $scope.companiesArray.push({
                                    img: dataCompanies[i].img,
                                    name: dataCompanies[i].name,
                                    customcheck: calVal.customcheck,
                                    custom: calVal.custom,
                                    tax: calVal.tax,
                                    fee: fee,
                                    shipping: calVal.shipping,
                                    cusship: (calVal.shipping * weight) / 50,
                                    dollar: calVal.dollar,
                                    desc: dataCompanies[i].desc,
                                    finalzcus: amr - price,
                                    finaltax: taxx - amr,
                                    finalfee: feee - taxx + calVal.fez,
                                    clearsh: calVal.clear,
                                    finalshpp: shpp - feee,
                                    finalpriceoutd: shpp,
                                    dprice: clears,
                                    newfee: price * (calVal.fee / 100),
                                    subsc: calVal.sub,
                                    final: final
                                });
                            }

                            $scope.companiesArray.sort(function (a, b) {
                                if (a.final > b.final) {
                                    return 1;
                                }
                                if (a.final < b.final) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });

                        }

                    }
                }
                $scope.progressbar.complete();
            }, 2500);
        }

        $scope.showValues = function () {
            $timeout(function () {
                $scope.showVals = true;
            }, 2500);
        }
}])
