angular.module('common.controllers', ['ionic', 'ui.router']) //, 'moment-picker'


    .controller('loginCtrl', function(changeSlotService, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
        }

        $scope.loginError = "";
        $scope.mydata = {};
        $scope.mydata.mobile = "";
        $scope.mydata.password = "";
        $scope.doLogin = function() {

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            $http({
                    method: 'POST',
                    url: 'https://www.zaitoon.online/services/adminlogin.php',
                    data: $scope.mydata,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                })
                .success(function(response) {
                    $ionicLoading.hide();
                    if (response.status) {
                        window.localStorage.admin = response.response;
                        $state.go('main.app.tiles');
                    } else {
                        $scope.loginError = response.error;
                    }

                })
                .error(function(data) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });
                });
        }

    })


   .controller('tilesCtrl', function(changeSlotService, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
        }
    


        $scope.openPage = function(id){

            switch(id){
                case "OVERALL":{
                    $state.go('main.app.overall');
                    break;
                }
                case "CUSTOMERS":{
                    $state.go('main.app.customers');
                    break;
                }
                case "FEEDBACKS":{
                    $state.go('main.app.feedbacks');
                    break;
                }
                case "SALES":{
                    $state.go('main.app.sales');
                    break;
                }
                case "STAFF":{
                    $state.go('main.app.staff');
                    break;
                }
                case "ACCOUNTS":{
                    $state.go('main.app.accounts');
                    break;
                }
            }

        }


    })



.controller('AppCtrl', function(changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


})

;