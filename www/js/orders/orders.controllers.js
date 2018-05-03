angular.module('orders.controllers', ['ionic', 'ui.router', 'ionic-timepicker', 'ionic-datepicker', 'chart.js']) //, 'moment-picker'


    .config(function(ionicTimePickerProvider) {
        var timePickerObj = {
            inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
            format: 12,
            step: 15,
            setLabel: 'Set',
            closeLabel: 'Close'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);
    })


    .config(function(ionicDatePickerProvider) {
        var datePickerObj = {
            inputDate: new Date(),
            titleLabel: 'Select a Date',
            setLabel: 'OK',
            todayLabel: 'Today',
            closeLabel: 'Cancel',
            mondayFirst: false,
            weeksList: ["S", "M", "T", "W", "T", "F", "S"],
            monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            templateType: 'popup',
            from: new Date(2012, 8, 1),
            to: new Date(2018, 8, 1),
            showTodayButton: false,
            dateFormat: 'dd MMMM yyyy',
            closeOnSelect: false,
            disableWeekdays: []
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    })


// ONLINE ORDERS

 .controller('pendingOrdersCtrl', function($ionicActionSheet, changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


    //List or Details View?
    $scope.isViewingOrder = false;

    $scope.isRenderLoaded = false;
    $scope.renderFailed = false;

    $scope.searchKey = {};
    $scope.searchKey.value = '';


    $scope.initializePendingOrders = function(){

      $scope.isRenderLoaded = false;
      $scope.renderFailed = false;

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 0;

      //LOADING 
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/fetchorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout : 10000
       })
       .success(function(data) {
            $ionicLoading.hide();

            if(data.status){
                $scope.pending_orders = data.response;
                $scope.pending_orders_length = data.count;
                $scope.isRenderLoaded = true;
                $scope.renderFailed = false;
            }
            else{
                $scope.pending_orders = [];
                $scope.pending_orders_length = 0;
                $scope.renderFailed = true;
            }

            $scope.$broadcast('scroll.refreshComplete');
            
       })
       .error(function(data){
              $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.isRenderLoaded = false;
              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');
        });
    }


    $scope.initializePendingOrders();


      $scope.doRefresh = function(){
        $scope.initializePendingOrders();
      }



    $scope.openViewOrder = function (obj){
        $scope.isViewingOrder = true;
        $scope.displayOrderContent = obj;
    }

    $scope.backToPendingOrders = function(flag){
        $scope.isViewingOrder = false;

        if(flag == 'RELOAD'){
            $scope.searchKey.value = '';
            $scope.initializePendingOrders();
        }
    }

    $scope.resetSearchKey = function(){
        $scope.searchKey.value = '';
    }

    $scope.confirmOrder = function(orderObj){

    }


    $scope.proceedRejectOrder = function(orderObj){
        alert('DONE!')
    }


    $scope.rejectOrder = function(orderObj){
        $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-close-circled assertive"></i> <i class="assertive">Reject Order</i>' },
                { text: '<i class="icon"></i> <i class="dark">Close</i>' },
              ],
                    titleText: 'Are you sure you want to Reject Order #'+orderObj.orderID+'?',
                    buttonClicked: function(index) {
                        if(index == 0){
                            $scope.proceedRejectOrder(orderObj);
                        }
                
                    return true;
              },
        });

    }



        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

})




 .controller('confirmedOrdersCtrl', function($ionicActionSheet, changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


    //List or Details View?
    $scope.isViewingOrder = false;


    $scope.isRenderLoaded = false;
    $scope.renderFailed = false;

    $scope.searchKey = {};
    $scope.searchKey.value = '';


    $scope.initializeConfirmedOrders = function(){

        $scope.isRenderLoaded = false;
        $scope.renderFailed = false;

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 1;

      //LOADING 
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/fetchorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout : 10000
       })
       .success(function(data) {
            $ionicLoading.hide();

            if(data.status){
                $scope.confirmed_orders = data.response;
                $scope.confirmed_orders_length = data.count;
                $scope.isRenderLoaded = true;
                $scope.renderFailed = false;
            }
            else{
                $scope.confirmed_orders = [];
                $scope.confirmed_orders_length = 0;
                $scope.renderFailed = true;
            }

            $scope.$broadcast('scroll.refreshComplete');
            
       })
       .error(function(data){
              $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.isRenderLoaded = false;
              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');
        });

    }


    $scope.initializeConfirmedOrders();


      $scope.doRefresh = function(){
        $scope.initializeConfirmedOrders();
      }




    $scope.openViewOrder = function (obj){
        $scope.isViewingOrder = true;
        $scope.displayOrderContent = obj;
    }

    $scope.backToConfirmedOrders = function(flag){
        $scope.isViewingOrder = false;

        if(flag == 'RELOAD'){
            $scope.searchKey.value = '';
            $scope.initializeConfirmedOrders();
        }
    }

    $scope.resetSearchKey = function(){
        $scope.searchKey.value = '';
    }

    $scope.dispatchOrderPost = function(orderObj, agentCode){
        //CALL POST METHOD here.
        console.log(orderObj, agentCode)
    }

    $scope.dispatchOrder = function(orderObj){

              var temp_branch = 'IITMADRAS';

              $http.get("https://zaitoon.online/services/fetchroles.php?branch="+temp_branch+"&role=AGENT").then(function(response) {
                $scope.all_agents = response.data.results;

                if(!response.data.isFound)
                {
                    $ionicLoading.show({
                        template:  'No Delivery Agents available',
                        duration: 3000
                    })
                    return '';
                }

                $scope.delivery_agents = [];
                var i = 0;
                while(i < $scope.all_agents.length){
                  $scope.delivery_agents.push(
                    {
                      value: $scope.all_agents[i].code ,
                      label: $scope.all_agents[i].name
                    }
                  );
                  i++;
                }


                outletsPopup = $ionicPopup.show({
                    cssClass: 'popup-outer edit-shipping-address-view',
                    templateUrl: 'views/common/templates/delivery-agents-popup.html',
                    title : 'Assign a Delivery Agent',
                    scope: angular.extend($scope, {}),
                    buttons: [{
                        text: 'Close'
                    }]
                });


              });

                //Callback
                $scope.dispatchOrderProcess = function(val) {
                    $scope.dispatchOrderPost(orderObj, val)

                    outletsPopup.close();
                }
    }

    $scope.markOrderReady = function(orderObj){

    }


    $scope.proceedRejectOrder = function(orderObj){
        alert('DONE!')
    }


    $scope.rejectOrder = function(orderObj){
        $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-close-circled assertive"></i> <i class="assertive">Cancel Order</i>' },
                { text: '<i class="icon"></i> <i class="dark">Close</i>' },
              ],
                    titleText: 'Are you sure you want to Cancel Order #'+orderObj.orderID+' which is already been processed?',
                    buttonClicked: function(index) {
                        if(index == 0){
                            $scope.proceedRejectOrder(orderObj);
                        }
                
                    return true;
              },
        });

    }



    $scope.getTotalTimeLapsed = function(time){
        return moment(time, "LT").fromNow();
    }

    $scope.timeLapsedStyle = function(time){
        var timestamp = moment(time,'hh:mm a');
        var difference = moment.duration(timestamp.diff(moment())).asMinutes();

        if(difference >= -35){ //Normal
            return {}
        }
        else if(difference < -35 && difference > -45){ //Warning
            return {'color': '#f1c40f'}
        }
        else if(difference <= -45 && difference > -60){ //Critical Warning
            return {'color': '#d35400'}
        }
        else if(difference <= -60){ //Very Delayed
            return {'color': '#c0392b'}
        }
    }



        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

})


 .controller('completedOrdersCtrl', function($ionicScrollDelegate, $ionicActionSheet, changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';



    //List or Details View?
    $scope.isViewingOrder = false;

      $scope.isRenderLoaded = false;
      $scope.renderFailed = false;

    $scope.searchKey = {};
    $scope.searchKey.value = '';


      //Default Results : Completed Orders of the Day
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10){ dd='0'+dd;}
      if(mm<10){ mm='0'+mm;}
      var today = dd+''+mm+''+yyyy;



    $scope.initializeCompletedOrders = function(){

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 2;
      data.key = today;


      $scope.isRenderLoaded = false;
      $scope.renderFailed = false;

      //LOADING 
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/filterorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout : 10000
       })
       .success(function(data) {
            $ionicLoading.hide();

            if(data.status){
                $scope.completed_orders = data.response;
                $scope.completed_orders_length = $scope.completed_orders.length;
                $scope.isRenderLoaded = true;
                $scope.renderFailed = false;
            }
            else{
                $scope.completed_orders = [];
                $scope.completed_orders_length = 0;
                $scope.renderFailed = true;
            }

            $scope.$broadcast('scroll.refreshComplete');
            
       })
       .error(function(data){
              $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.isRenderLoaded = false;
              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');
        });
    }


    $scope.initializeCompletedOrders();


      $scope.doRefresh = function(){
        if($scope.isDateFilterApplied){
            $scope.loadCompletedOrders();
        }
        else{
            $scope.initializeCompletedOrders();
        }
        
      }

    $scope.openViewOrder = function (obj){
        $scope.isViewingOrder = true;
        $scope.displayOrderContent = obj;
    }

    $scope.backToCompletedOrders = function(flag){
        $scope.isViewingOrder = false;

        if(flag == 'RELOAD'){
            $scope.searchKey.value = '';
            $scope.initializeCompletedOrders();
        }
    }

    $scope.resetSearchKey = function(){
        $scope.searchKey.value = '';
    }


    $scope.getTotalTimeLapsed = function(time){
        return moment(time, "LT").fromNow();
    }

    $scope.timeLapsedStyle = function(time){
        var timestamp = moment(time,'hh:mm a');
        var difference = moment.duration(timestamp.diff(moment())).asMinutes();

        if(difference >= -35){ //Normal
            return {}
        }
        else if(difference < -35 && difference > -45){ //Warning
            return {'color': '#f1c40f'}
        }
        else if(difference <= -45 && difference > -60){ //Critical Warning
            return {'color': '#d35400'}
        }
        else if(difference <= -60){ //Very Delayed
            return {'color': '#c0392b'}
        }
    }



    $scope.filterDate = '';
    $scope.filterFancyDate = '';
    $scope.isDateFilterApplied = false;


    $scope.loadCompletedOrders = function(){

      if($scope.filterDate == ''){
        return '';
      }

      var temp_key = $scope.filterDate.replace(/-/g , "");

      if(temp_key != today){
        $scope.isDateFilterApplied = true;
      }
      else{
        $scope.isDateFilterApplied = false;
      }


      $scope.isRenderLoaded = false;
      $scope.renderFailed = false;

      //LOADING 
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });


      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 2;
      data.key = temp_key;

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/filterorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout : 10000
       })
       .success(function(data) {
            $ionicLoading.hide();

            if(data.status){
                $scope.completed_orders = data.response;
                $scope.completed_orders_length = $scope.completed_orders.length;
                $scope.isRenderLoaded = true;
                $scope.renderFailed = false;
            }
            else{
                $scope.completed_orders = [];
                $scope.completed_orders_length = 0;
                $scope.renderFailed = true;
            }

            $scope.$broadcast('scroll.refreshComplete');
            
       })
       .error(function(data){
              $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.isRenderLoaded = false;
              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');
        });
    }


    $scope.clearDateFilter = function(){
        $scope.isDateFilterApplied = false;
        $scope.initializeCompletedOrders();
    }


        //Date Picker stuff
        var filterFromDate = {
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

                $scope.filterDate = date;
                $scope.filterFancyDate = fancyDate;

                $scope.loadCompletedOrders();

                $ionicScrollDelegate.scrollTop();
            },
            disabledDates: [ //Optional
            ],
            //from: new Date(), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };


    $scope.filterCompletedByDate = function(){
        ionicDatePicker.openDatePicker(filterFromDate);
    }


        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

})


;