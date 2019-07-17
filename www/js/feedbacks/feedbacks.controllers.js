angular.module('feedbacks.controllers', ['ionic', 'ui.router']) //, 'moment-picker'


    .controller('feedbacksCtrl', function(changeSlotService, $ionicLoading, ionicDatePicker, $scope, $rootScope, $ionicPopup, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking, $ionicSideMenuDelegate) {

        if (_.isUndefined(window.localStorage.admin)) {
            $state.go('main.app.login');
        }


        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };


$scope.getRatingColor = function(rating){

        if(rating >= 4){
            return {'color': '#4d7b1e'}
        }
        else if(rating >= 3.5){
            return {'color': '#cddc39'}
        }
        else if(rating >= 3){
            return {'color': '#FFBA00'}
        }
        else if(rating >= 2){
            return {'color': '#FF7800'}
        }
        else if(rating < 2){
            return {'color': '#CD1C26'}             
        }
        else{
            return {'color': '#34495e'}
        }
}



        $scope.totalPAXCount = 0;
        $scope.myDate = mappingService.getFancyDate();

        if ($scope.myDate == "") {
            $state.go('main.app.tiles');
        }

        $scope.isFilterApplied = false;

        $scope.initFigures = function() {
            var data = {};
            data.token = window.localStorage.admin;
			
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

				
            $http({
                    method: 'POST',
                    url: 'https://www.zaitoon.online/services/deskfetchfeedbackfigures.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
					timeout: 10000
                })
                .success(function(response) {
					$ionicLoading.hide();
                    $scope.feedFigures = response;
                    $scope.feedFigures.overall = 3.8;
                })
                .error(function(data) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });
                });				
				;
        }

        $scope.initFigures();

        $scope.filterMode = '';
        $scope.init = function() {
            var data = {};
            data.id = 0;
            data.token = window.localStorage.admin;
            data.filter = $scope.filterMode;
            data.isFilter = $scope.isFilterApplied ? 1 : 0;
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
            $http({
                    method: 'POST',
                    url: 'https://www.zaitoon.online/services/deskfetchreviews.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
					timeout: 10000
                })
                .success(function(response) {
					$ionicLoading.hide();
                    $scope.feedbacks = response.response;
                })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Not responding. Check your connection.",
                            duration: 3000
                        });
                    });				
        }

        $scope.init();


        //filters
        $scope.mypopup = '';
        $scope.filterFeeds = function() {
            $scope.mypopup = $ionicPopup.show({
                title: 'Filter Feedbacks',
                cssClass: 'popup-outer edit-shipping-address-view',
                templateUrl: 'views/common/filter-options.html',
                scope: angular.extend($scope, {}),
                buttons: [{
                    text: 'Clear',
                    onTap: function(e) {
                        if ($scope.isFilterApplied) {
                            $scope.filterClear();
                        }
                    }
                }]
            });
        }


        $scope.filterAppliedDisplayText = '';

        $scope.filterSort = function(type) {

            $scope.filterAppliedDisplayText = type;

			$scope.limiter = 5;
            $scope.left = true;
            $scope.isFilterApplied = true;
            $scope.filterMode = type;
            $scope.init();
            $scope.mypopup.close();
        }

        $scope.filterClear = function() {
            $scope.filterAppliedDisplayText = '';
            $scope.isFilterApplied = false;
            $scope.init();
            $scope.mypopup.close();
        }

        $scope.left = true;
        $scope.limiter = 5;
        $scope.loadMore = function() {
            var data = {};
            data.id = $scope.limiter;
            data.token = window.localStorage.admin;
            data.filter = $scope.filterMode;
            data.isFilter = $scope.isFilterApplied ? 1 : 0;
			
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });			
            $http({
                    method: 'POST',
                    url: 'https://www.zaitoon.online/services/deskfetchreviews.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                })
                .success(function(data) {
					console.log(data)
					$ionicLoading.hide();
                    if (data.response.length == 0) {
                        $scope.left = false;
                    }
                    $scope.feedbacks = $scope.feedbacks.concat(data.response)
                    $scope.limiter += 5;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function(data) {
					$ionicLoading.hide();
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });
                });
        }




        //Date Picker stuff
        var ipObj2 = {
            callback: function(val) { //Mandatory

                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                var temp = new Date(val);
                var mm = temp.getMonth() + 1;
                var dd = temp.getDate();
                var yyyy = temp.getFullYear();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                var date = dd + '-' + mm + '-' + yyyy;
                var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                var data = {};
                data.id = $scope.myReservationID;
                data.date = date;




            },
            disabledDates: [ //Optional
            ],
            from: new Date(), //Optional
            to: new Date(2020, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        //DONE RESERVATIONS to show or not
        $scope.history = {};
        $scope.history.checked = false;

        $scope.displayCheck = function(tag) {
            if ($scope.history.checked) {
                return true;
            } else if (!$scope.history.checked && !tag) {
                return true;
            } else {
                return false;
            }
        }

            


        //For Search field
        $scope.search = {
            query: ''
        };
        $scope.showSearch = false;

        $scope.resetSearch = function() {
            $scope.search = {
                query: ''
            };
            $scope.showSearch = !$scope.showSearch;
        }


       

        $scope.goHome = function() {
            $state.go('main.app.tiles');
        }

        $scope.showFree = function() {
            $state.go('main.app.free');
        }



    })
;
