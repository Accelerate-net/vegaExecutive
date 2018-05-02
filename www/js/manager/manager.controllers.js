angular.module('manager.controllers', ['ionic', 'ui.router', 'ionic-timepicker', 'ionic-datepicker', 'chart.js']) //, 'moment-picker'


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






    .controller('loginCtrl', function(changeSlotService, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
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
                    url: 'https://www.kopperkadai.online/services/adminlogin.php',
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
                        $state.go('main.app.landing');
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
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


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




   .controller('salesCtrl', function(changeSlotService, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */



    $scope.getTodayDefaultDate = function(){
                var temp = new Date();
                var mm = temp.getMonth() + 1;
                var dd = temp.getDate();
                var yyyy = temp.getFullYear();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                var date = dd + '-' + mm + '-' + yyyy;

                return date;
    }

    $scope.getFancyCurrency = function(x){
        return x.toLocaleString('en-US', {maximumSignificantDigits : 9});
    }



    //Filter Options
    $scope.resetFilter = function(){
        $scope.isFilterEnabled = false;
        $scope.filterBranch = 'All Outlets';
        $scope.filterBranchCode = 'ALL';
        $scope.filterFrom = $scope.getTodayDefaultDate();
        $scope.filterTo = $scope.getTodayDefaultDate();

        $scope.filterBranchBackup = $scope.filterBranch;
        $scope.filterBranchCodeBackup = $scope.filterBranchCode;
        $scope.filterFromBackup = $scope.filterFrom;
        $scope.filterToBackup = $scope.filterTo;

        $scope.filterPendingApply = false;
    }

    $scope.resetFilter();

    $scope.applyFilterCancel = function(){
        $scope.filterPendingApply = false;

        $scope.filterBranch = $scope.filterBranchBackup;
        $scope.filterBranchCode = $scope.filterBranchCodeBackup;
        $scope.filterFrom = $scope.filterFromBackup;
        $scope.filterTo = $scope.filterToBackup;

    }

    $scope.applyFilterConfirm = function(){
        $scope.filterPendingApply = false;

        //Send Post request.
        $scope.fetchData();
    }

    $scope.triggerFilter = function(){
        if($scope.isFilterEnabled){
            $scope.resetFilter();
            //Fetch default results
            $scope.fetchData();
        }
        else{
            $scope.isFilterEnabled = true;
            //show filter options window
        }
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterFromBackup = $scope.filterFrom;
                $scope.filterFrom = date;
                $scope.filterPendingApply = true;
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

        $scope.changeFilterFrom = function() {
            ionicDatePicker.openDatePicker(filterFromDate);
        }


        var filterToDate = {
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterToBackup = $scope.filterTo;
                $scope.filterTo = date;
                $scope.filterPendingApply = true;
                $ionicScrollDelegate.scrollTop();
            },
            disabledDates: [ //Optional
            ],
            //from:, //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.changeFilterTo = function() {
            ionicDatePicker.openDatePicker(filterToDate);
        }


        //Filter by branch
        $scope.changeFilterBranch = function() {

                //Get all the outlets
                $http.get('https://www.zaitoon.online/services/fetchoutlets.php')
                    .then(function(response) {
                        $scope.allList = response.data.response;

                            outletsPopup = $ionicPopup.show({
                                cssClass: 'popup-outer edit-shipping-address-view',
                                templateUrl: 'views/common/templates/outlets-popup.html',
                                scope: angular.extend($scope, {}),
                                buttons: [{
                                    text: 'Close'
                                }]
                            });


                    });



                //Callback
                $scope.setBranchFilter = function(val) {
                    $scope.filterBranchBackup = $scope.filterBranch;
                    $scope.filterBranchCodeBackup = $scope.filterBranchCode;
                    $scope.filterBranch = val.name;
                    $scope.filterBranchCode = val.code;
                    $scope.filterPendingApply = true;
                    $ionicScrollDelegate.scrollTop();

                    outletsPopup.close();
                }
        }


//Fetch Data

var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


      
      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");

            if($scope.isFilterEnabled){
                data.filterBranch = $scope.filterBranchCode;
                data.filterFrom = $scope.filterFrom;
                data.filterTo = $scope.filterTo;
            }

            //LOADING 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpanalyticssales.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                $ionicLoading.hide();
                
                if(data.status){
                    $scope.overallData = data.response;
                    $scope.renderInfo();
                    $scope.renderFailed = false;
                }
                else{
                    $scope.overallData = {};
                    $scope.renderFailed = true;

                    $ionicLoading.show({
                        template:  data.error,
                        duration: 3000
                    });                    
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
           .error(function(data){
            $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');

          });
              
      }

      $scope.fetchData();

      $scope.doRefresh = function(){
        $scope.fetchData();
      }



      $scope.isRenderLoaded = false;

      $scope.renderInfo = function(){

                    $scope.isRenderLoaded = true;

                    //CALENDAR
                        $scope.selected = moment();
                        $scope.month = $scope.selected.clone();

                        $scope.displayCalendarMonth = moment($scope.selected).format('MMMM YYYY');

                        var start = $scope.selected.clone();
                        start.date(1);
                        _removeTime(start.day(0));

                        _buildMonth($scope, start, $scope.month);



                    //GRAPH - Month Trend

                      $scope.data = [];
                      var tempCurrent = [];

                      $scope.labels = [];
                      var n = 0;
                      while($scope.overallData.monthwise[n]){
                        $scope.labels.push($scope.getMyFancyMonth($scope.overallData.monthwise[n].month));
                        tempCurrent.push($scope.overallData.monthwise[n].amount);

                        n++;

                        if(n == 7){ //last iteration
                            $scope.data.push(tempCurrent);
                        }
                      }

                      $scope.series = ['Monthly Sales'];

                      $scope.colors = ['#2ecc71'];


                      $scope.datasetOverride = [{ yAxisID: 'y-axis' }];
                      $scope.options = {
                        scales: {
                          yAxes: [
                            {
                              id: 'y-axis',
                              type: 'linear',
                              display: true,
                              position: 'left'
                            }
                          ]
                        }
                      };




                    //PieChart - Payemnt Modes

                      $scope.labelsPaymentMode = [];
                      $scope.dataPaymentMode = [];

                      var m = 0;
                      while($scope.overallData.paymentModes[m]){
                        $scope.labelsPaymentMode.push($scope.overallData.paymentModes[m].name + ' ('+(Math.round(($scope.overallData.paymentModes[m].amount/$scope.overallData.paymentModesSum) * 1000) / 10)+'%)');
                        $scope.dataPaymentMode.push($scope.overallData.paymentModes[m].amount);
                        m++;
                      }


                      $scope.optionsPaymentMode = {
                            legend: { display: true, position: 'bottom' }
                      }




                    //Line Chart - Daywise Trend


                      $scope.labelsDaywise = [];
                      $scope.dataDaywiseTemp = [];

                      var m = 0;
                      while($scope.overallData.daywise[m]){
                        $scope.labelsDaywise.push($scope.getFancyDay($scope.overallData.daywise[m].day));
                        $scope.dataDaywiseTemp.push($scope.overallData.daywise[m].amount);
                        m++;
                      }

                      $scope.dataDaywise = [];
                      $scope.dataDaywise.push($scope.dataDaywiseTemp);

                      $scope.colorsDaywise = ['#3498db'];


    }

                        $scope.select = function(day) {
                            $scope.selected = day.date;  
                        };

                        $scope.next = function() {
                            var next = $scope.month.clone();
                            _removeTime(next.month(next.month()+1).date(1));
                            $scope.month.month($scope.month.month()+1);
                            _buildMonth($scope, next, $scope.month);
                        };

                        $scope.previous = function() {
                            var previous = $scope.month.clone();
                            _removeTime(previous.month(previous.month()-1).date(1));
                            $scope.month.month($scope.month.month()-1);
                            _buildMonth($scope, previous, $scope.month);
                        };


                function _removeTime(date) {
                    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
                }

                function _buildMonth(scope, start, month) {
                    scope.weeks = [];

                    $scope.displayCalendarMonth = moment(month).format('MMMM YYYY');

                    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
                    while (!done) {
                        scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                        date.add(1, "w");
                        done = count++ > 2 && monthIndex !== date.month();
                        monthIndex = date.month();
                    }
                }

                function _buildWeek(date, month) {
                    var days = [];
                    var statusToSet = '';
                    var amountToSet = '';
                    for (var i = 0; i < 7; i++) {

                        var tempFormatted = moment(date).format('DD-MM-YYYY');
                        
                        statusToSet = '';
                        amountToSet = '';

                        for(var j = 0; j < $scope.overallData.current.length; j++){
                            if($scope.overallData.current[j].date == tempFormatted){
                                statusToSet = parseInt($scope.overallData.current[j].flag);
                                amountToSet = parseInt($scope.overallData.current[j].sales);
                                break;
                            }
                        }

                        days.push({
                            number: date.date(),
                            isCurrentMonth: date.month() === month.month(),
                            isToday: date.isSame(new Date(), "day"),
                            status: statusToSet,
                            amount: amountToSet
                        });

                        date = date.clone();
                        date.add(1, "d");
                    }
                    return days;
                }

                $scope.getMyStyle = function(day){

                    if(!day.isCurrentMonth){
                        return {'color': '#bdc3c7'};
                    }
                    else{
                        return {
                            "font-weight": "bold"
                        }
                    }                  

                }

                $scope.getMyAmountStyle = function(day){

                    if(!day.isCurrentMonth){
                        return {
                                    "display": "block",
                                    "font-size": "80%",
                                    "font-weight": "300"
                                }
                    }
                    else{

                        switch(day.status){
                            case 1:{ //low
                                return {
                                    "display": "block",
                                    "font-size": "80%",
                                    "font-weight": "400",
                                    "color": "#e74c3c"
                                }
                            }
                            case 2:{ //high
                                return {
                                    "display": "block",
                                    "font-size": "80%",
                                    "font-weight": "400",
                                    "color": "#27ae60"
                                }
                            }
                            default:{
                                return {
                                    "display": "block",
                                    "font-size": "80%",
                                    "font-weight": "400"
                                }
                            }

                        }    

                        
                    }                  

                }


                


                $scope.getDayClass = function(day){

                    if(!day.isCurrentMonth){
                        return 'different-month';
                    }

                    switch(day.status){
                        case 0:{
                            return 'unknown';
                        }
                        case 1:{
                            return 'halfday';
                        }
                        case 2:{
                            return 'present';
                        }
                        case 5:{
                            return 'absent';
                        }
                        default:{
                            return '';
                        }

                    }       
                }

                  $scope.getMyFancyMonth = function(month){
                    return month.substring(0, 3);
                  }


                  $scope.getFancyDay = function(day){
                    return day.substring(0, 3);
                  }




        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

        $scope.getRevenueClass = function(current, previous){
            if(current >= previous){
                return 'ion-arrow-graph-up-right specialGreen';
            }
            else{
                return 'ion-arrow-graph-down-right specialRed';
            }
            
        }


        $scope.getFancyAmount = function(amount){
            amount = Math.abs(amount);
            if(amount < 10000){
                return amount;
            }
            else if(amount >= 10000 && amount < 100000){
                amount = amount/1000;
                amount = Math.round(amount * 10) / 10;
                return amount + "" + " K";
            }
            else if(amount >= 100000 && amount < 10000000){
                amount = amount/100000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " L";
            }
            else if(amount >= 10000000){
                amount = amount/10000000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " Cr";
            }
        }






 })





 .controller('overallCtrl', function(changeSlotService, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


$scope.getRatingColor = function(rating){

        if(rating >= 4){
            return {'color': '#305D02'}
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

  $scope.getMyFancyDate = function(date){
    var myDate = date.split('-');

    if(myDate[0]%10 == 1){
        return myDate[0]+'st';
    }
    else if(myDate[0]%10 == 2){
        return myDate[0]+'nd';
    }
    else if(myDate[0]%10 == 3){
        return myDate[0]+'rd';
    }
    else{
        return myDate[0]+'th';
    }
  }








    //Filter Options


    $scope.getTodayDefaultDate = function(){
                var temp = new Date();
                var mm = temp.getMonth() + 1;
                var dd = temp.getDate();
                var yyyy = temp.getFullYear();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                var date = dd + '-' + mm + '-' + yyyy;

                return date;
    }

    $scope.resetFilter = function(){
        $scope.isFilterEnabled = false;
        $scope.filterBranch = 'All Outlets';
        $scope.filterBranchCode = 'ALL';
        $scope.filterFrom = $scope.getTodayDefaultDate();
        $scope.filterTo = $scope.getTodayDefaultDate();

        $scope.filterBranchBackup = $scope.filterBranch;
        $scope.filterBranchCodeBackup = $scope.filterBranchCode;
        $scope.filterFromBackup = $scope.filterFrom;
        $scope.filterToBackup = $scope.filterTo;

        $scope.filterPendingApply = false;
    }

    $scope.resetFilter();

    $scope.applyFilterCancel = function(){
        $scope.filterPendingApply = false;

        $scope.filterBranch = $scope.filterBranchBackup;
        $scope.filterBranchCode = $scope.filterBranchCodeBackup;
        $scope.filterFrom = $scope.filterFromBackup;
        $scope.filterTo = $scope.filterToBackup;

    }

    $scope.applyFilterConfirm = function(){
        $scope.filterPendingApply = false;

        //Send Post request.
        $scope.fetchData();
    }

    $scope.triggerFilter = function(){
        if($scope.isFilterEnabled){
            $scope.resetFilter();
            //Fetch default results
            $scope.fetchData();
        }
        else{
            $scope.isFilterEnabled = true;
            //show filter options window
        }
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterFromBackup = $scope.filterFrom;
                $scope.filterFrom = date;
                $scope.filterPendingApply = true;
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

        $scope.changeFilterFrom = function() {
            ionicDatePicker.openDatePicker(filterFromDate);
        }


        var filterToDate = {
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterToBackup = $scope.filterTo;
                $scope.filterTo = date;
                $scope.filterPendingApply = true;
                $ionicScrollDelegate.scrollTop();
            },
            disabledDates: [ //Optional
            ],
            //from:, //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.changeFilterTo = function() {
            ionicDatePicker.openDatePicker(filterToDate);
        }


        //Filter by branch
        $scope.changeFilterBranch = function() {

                //Get all the outlets
                $http.get('https://www.zaitoon.online/services/fetchoutlets.php')
                    .then(function(response) {
                        $scope.allList = response.data.response;

                            outletsPopup = $ionicPopup.show({
                                cssClass: 'popup-outer edit-shipping-address-view',
                                templateUrl: 'views/common/templates/outlets-popup.html',
                                scope: angular.extend($scope, {}),
                                buttons: [{
                                    text: 'Close'
                                }]
                            });


                    });



                //Callback
                $scope.setBranchFilter = function(val) {
                    $scope.filterBranchBackup = $scope.filterBranch;
                    $scope.filterBranchCodeBackup = $scope.filterBranchCode;
                    $scope.filterBranch = val.name;
                    $scope.filterBranchCode = val.code;
                    $scope.filterPendingApply = true;
                    $ionicScrollDelegate.scrollTop();

                    outletsPopup.close();
                }
        }


//Fetch Data

var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


      
      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");

            if($scope.isFilterEnabled){
                data.filterBranch = $scope.filterBranchCode;
                data.filterFrom = $scope.filterFrom;
                data.filterTo = $scope.filterTo;
            }

            //LOADING 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpanalyticsoverall.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                $ionicLoading.hide();
                
                if(data.status){
                    $scope.overallData = data.response;
                    $scope.renderInfo();
                    $scope.renderFailed = false;
                }
                else{
                    $scope.overallData = {};
                    $scope.renderFailed = true;

                    $ionicLoading.show({
                        template:  data.error,
                        duration: 3000
                    });                    
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
           .error(function(data){
            $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');

          });
              
      }

      $scope.fetchData();

      $scope.doRefresh = function(){
        $scope.fetchData();
      }



      $scope.isRenderLoaded = false;

      $scope.renderInfo = function(){

                $scope.isRenderLoaded = true;

                //LINE GRAPH - Current vs Previous week sales.

                  $scope.data = [];
                  var tempCurrent = [];
                  var tempPrevious = [];

                  $scope.labels = [];
                  var n = 0;
                  while($scope.overallData.current[n]){
                    $scope.labels.push($scope.getMyFancyDate($scope.overallData.current[n].date));
                    tempCurrent.push($scope.overallData.current[n].sales);
                    tempPrevious.push($scope.overallData.previous[n].sales);

                    n++;

                    if(n == 7){ //last iteration
                        $scope.data.push(tempCurrent);
                        $scope.data.push(tempPrevious);
                    }
                  }

                  $scope.series = ['This Week', 'Last Week'];

                  $scope.colors = ['#2ecc71', '#bdc3c7'];


                  $scope.datasetOverride = [{ yAxisID: 'y-axis' }];
                  $scope.options = {
                    scales: {
                      yAxes: [
                        {
                          id: 'y-axis',
                          type: 'linear',
                          display: true,
                          position: 'left'
                        }
                      ]
                    }
                  };


                //DOUGHNUT - Branchwise

                  $scope.labelsBranch = [];
                  $scope.dataBranch = [];

                  var m = 0;
                  while($scope.overallData.outletInfo[m]){
                    $scope.labelsBranch.push($scope.overallData.outletInfo[m].name + ' ('+(Math.round(($scope.overallData.outletInfo[m].amount/$scope.overallData.outletsTotal) * 1000) / 10)+'%)');
                    $scope.dataBranch.push($scope.overallData.outletInfo[m].amount);
                    m++;
                  }


                  $scope.optionsBranch = {
                        legend: { display: true, position: 'right' }
                  }

      }




        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

        $scope.getRevenueClass = function(current, previous){
            if(current >= previous){
                return 'ion-arrow-graph-up-right specialGreen';
            }
            else{
                return 'ion-arrow-graph-down-right specialRed';
            }
            
        }


        $scope.getFancyAmount = function(amount){
            amount = Math.abs(amount);
            if(amount < 10000){
                return amount;
            }
            else if(amount >= 10000 && amount < 100000){
                amount = amount/1000;
                amount = Math.round(amount * 10) / 10;
                return amount + "" + " K";
            }
            else if(amount >= 100000 && amount < 10000000){
                amount = amount/100000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " L";
            }
            else if(amount >= 10000000){
                amount = amount/10000000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " Cr";
            }
        }



    })







 .controller('accountsCtrl', function(changeSlotService, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


$scope.getRatingColor = function(rating){

        if(rating >= 4){
            return {'color': '#305D02'}
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

$scope.getRevenueStyle = function(amount){
    if(amount < 0){
        return {'color': '#e74c3c'}
    }
    else if(amount > 0){
        return {'color': '#27ae60'}
    }
}

$scope.getFancyCurrency = function(x){
    return x.toLocaleString('en-US', {maximumSignificantDigits : 9});
}





    //Filter Options


    $scope.getTodayDefaultDate = function(){
                var temp = new Date();
                var mm = temp.getMonth() + 1;
                var dd = temp.getDate();
                var yyyy = temp.getFullYear();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                var date = dd + '-' + mm + '-' + yyyy;

                return date;
    }

    $scope.resetFilter = function(){
        $scope.isFilterEnabled = false;
        $scope.filterBranch = 'All Outlets';
        $scope.filterBranchCode = 'ALL';
        $scope.filterFrom = $scope.getTodayDefaultDate();
        $scope.filterTo = $scope.getTodayDefaultDate();

        $scope.filterBranchBackup = $scope.filterBranch;
        $scope.filterBranchCodeBackup = $scope.filterBranchCode;
        $scope.filterFromBackup = $scope.filterFrom;
        $scope.filterToBackup = $scope.filterTo;

        $scope.filterPendingApply = false;
    }

    $scope.resetFilter();

    $scope.applyFilterCancel = function(){
        $scope.filterPendingApply = false;

        $scope.filterBranch = $scope.filterBranchBackup;
        $scope.filterBranchCode = $scope.filterBranchCodeBackup;
        $scope.filterFrom = $scope.filterFromBackup;
        $scope.filterTo = $scope.filterToBackup;

    }

    $scope.applyFilterConfirm = function(){
        $scope.filterPendingApply = false;

        //Send Post request.
        $scope.fetchData();
    }

    $scope.triggerFilter = function(){
        if($scope.isFilterEnabled){
            $scope.resetFilter();
            //Fetch default results
            $scope.fetchData();
        }
        else{
            $scope.isFilterEnabled = true;
            //show filter options window
        }
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterFromBackup = $scope.filterFrom;
                $scope.filterFrom = date;
                $scope.filterPendingApply = true;
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

        $scope.changeFilterFrom = function() {
            ionicDatePicker.openDatePicker(filterFromDate);
        }


        var filterToDate = {
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterToBackup = $scope.filterTo;
                $scope.filterTo = date;
                $scope.filterPendingApply = true;
                $ionicScrollDelegate.scrollTop();
            },
            disabledDates: [ //Optional
            ],
            //from:, //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.changeFilterTo = function() {
            ionicDatePicker.openDatePicker(filterToDate);
        }


        //Filter by branch
        $scope.changeFilterBranch = function() {

                //Get all the outlets
                $http.get('https://www.zaitoon.online/services/fetchoutlets.php')
                    .then(function(response) {
                        $scope.allList = response.data.response;

                            outletsPopup = $ionicPopup.show({
                                cssClass: 'popup-outer edit-shipping-address-view',
                                templateUrl: 'views/common/templates/outlets-popup.html',
                                scope: angular.extend($scope, {}),
                                buttons: [{
                                    text: 'Close'
                                }]
                            });


                    });



                //Callback
                $scope.setBranchFilter = function(val) {
                    $scope.filterBranchBackup = $scope.filterBranch;
                    $scope.filterBranchCodeBackup = $scope.filterBranchCode;
                    $scope.filterBranch = val.name;
                    $scope.filterBranchCode = val.code;
                    $scope.filterPendingApply = true;
                    $ionicScrollDelegate.scrollTop();

                    outletsPopup.close();
                }
        }


//Fetch Data

var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


      
      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");

            if($scope.isFilterEnabled){
                data.filterBranch = $scope.filterBranchCode;
                data.filterFrom = $scope.filterFrom;
                data.filterTo = $scope.filterTo;
            }

            //LOADING 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpanalyticsaccounts.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                $ionicLoading.hide();
                
                if(data.status){
                    $scope.overallData = data.response;
                    $scope.renderInfo();
                    $scope.renderFailed = false;
                }
                else{
                    $scope.overallData = {};
                    $scope.renderFailed = true;

                    $ionicLoading.show({
                        template:  data.error,
                        duration: 3000
                    });
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
           .error(function(data){
              $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');

          });
              
      }

      $scope.fetchData();

      $scope.doRefresh = function(){
        $scope.fetchData();
      }



      $scope.isRenderLoaded = false;

      $scope.renderInfo = function(){

                $scope.isRenderLoaded = true;
                //nothing to render!!!
      }





        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

        $scope.getRevenueClass = function(current, previous){
            if(current >= previous){
                return 'ion-arrow-graph-up-right specialGreen';
            }
            else{
                return 'ion-arrow-graph-down-right specialRed';
            }
            
        }


        $scope.getFancyAmount = function(amount){

            amount = Math.abs(amount);

            if(amount < 10000){
                return amount;
            }
            else if(amount >= 10000 && amount < 100000){
                amount = amount/1000;
                amount = Math.round(amount * 10) / 10;
                return amount + "" + " K";
            }
            else if(amount >= 100000 && amount < 10000000){
                amount = amount/100000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " L";
            }
            else if(amount >= 10000000){
                amount = amount/10000000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " Cr";
            }
        }



    })







 .controller('customersCtrl', function(changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */

$scope.getFancyCommaNumber = function(x){
    return x.toLocaleString('en-US', {maximumSignificantDigits : 12});
}


//Fetch Data

      var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';

      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");

            //LOADING 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpanalyticscustomers.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 1000
             })
             .success(function(data) {

                $ionicLoading.hide();
                
                if(data.status){
                    $scope.overallData = data.response;
                    $scope.renderInfo();
                    $scope.renderFailed = false;
                }
                else{
                    $scope.overallData = {};
                    $scope.renderFailed = true;                 
                }

            })
           .error(function(data){
                $ionicLoading.hide();
                $scope.renderFailed = true;
            });
              
      }

      $scope.fetchData();


      $scope.isRenderLoaded = false;
      $scope.renderInfo = function(){
                $scope.isRenderLoaded = true;
                //nothing to render!!!
      }








        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };


        $scope.getFancyAmount = function(amount){

            amount = Math.abs(amount);

            if(amount < 10000){
                return amount;
            }
            else if(amount >= 10000 && amount < 100000){
                amount = amount/1000;
                amount = Math.round(amount * 10) / 10;
                return amount + "" + " K";
            }
            else if(amount >= 100000 && amount < 10000000){
                amount = amount/100000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " L";
            }
            else if(amount >= 10000000){
                amount = amount/10000000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " Cr";
            }
        }



      $scope.viewGuestProfile = function(guestObj){

        $scope.limiter = 0; //to be safe

        $scope.isViewingProfile = true;
        $scope.viewingGuestData = guestObj;
      }

      $scope.goBackToResults = function(){
        $scope.isViewingProfile = false;
      }


      $scope.getRatingColor = function(rating){

            if(rating >= 4){
                return {'color': '#305D02'}
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



      $scope.search = function(search_key){

            if(search_key == '' || !search_key){
                return '';
            }

            $scope.isViewingProfile = false; //to be safe
            $scope.limiter = 0;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");
            data.key = search_key;
            data.id = $scope.limiter;


            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpfetchguest.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                if(data.status){
                  $scope.isSearched = true;
                  $scope.isFound = true;
                  $scope.guestData = data.response;

                  if($scope.guestData.length == 1){
                    $scope.singleGuest = true;
                    $scope.viewGuestProfile($scope.guestData[0]); //single result, directly load info page
                  }
                  else{
                    $scope.singleGuest = false;

                    //more left to load
                    if($scope.guestData.length % 10 == 0){
                      $scope.isMoreLeft = true;
                    }
                    else{
                      $scope.isMoreLeft = false;
                    }

                  }

                  $scope.errorMessage = '';
                }
                else{
                  $scope.isSearched = true;
                  $scope.isFound = false;
                  $scope.isMoreLeft = false;
                  $scope.guestData = {};
                  $scope.errorMessage = "No Results found.";
                }

            })
            .error(function(data){
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });
            });
              
      }



    $scope.searchMore = function(search_key){
            
            $scope.limiter = $scope.limiter + 10;


            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");
            data.key = search_key;
            data.id = $scope.limiter;

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpfetchguest.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                if(data.status){

                  $scope.guestData = $scope.guestData.concat(data.response);
                    
                    //more left to load
                    if($scope.guestData.length % 10 == 0){
                      $scope.isMoreLeft = true;
                    }
                    else{
                      $scope.isMoreLeft = false;
                    }

                  $scope.errorMessage = '';
                }
                else{
                  $scope.isMoreLeft = false;
                }

            })
            .error(function(data){
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });
            });
    }





      $scope.resetSearchView = function(){

        $scope.isSearched = false;
        $scope.isFound = false;
        $scope.singleGuest = false;
        
        $scope.guestData = "";

        $scope.searchKey = {};
        $scope.searchKey.value = '';
        
        $scope.limiter = 0;
        $scope.isMoreLeft = false;
        $scope.errorMessage = "";

        $scope.isViewingProfile = false;
      }

      $scope.resetSearchView();



       $scope.defaultDisplayTitle = 'Guest Profiles';


})






 .controller('staffCtrl', function(changeSlotService, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */


  $scope.getMyFancyDate = function(date){
    var myDate = date.split('-');

    if(myDate[0]%10 == 1){
        return myDate[0]+'st';
    }
    else if(myDate[0]%10 == 2){
        return myDate[0]+'nd';
    }
    else if(myDate[0]%10 == 3){
        return myDate[0]+'rd';
    }
    else{
        return myDate[0]+'th';
    }
  }




    //Filter Options

    $scope.getTodayDefaultDate = function(){
                var temp = new Date();
                var mm = temp.getMonth() + 1;
                var dd = temp.getDate();
                var yyyy = temp.getFullYear();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                var date = dd + '-' + mm + '-' + yyyy;

                return date;
    }


    $scope.resetFilter = function(){
        $scope.isFilterEnabled = false;
        $scope.filterBranch = 'All Outlets';
        $scope.filterBranchCode = 'ALL';
        $scope.filterFrom = $scope.getTodayDefaultDate();
        $scope.filterTo = $scope.getTodayDefaultDate();

        $scope.filterBranchBackup = $scope.filterBranch;
        $scope.filterBranchCodeBackup = $scope.filterBranchCode;
        $scope.filterFromBackup = $scope.filterFrom;
        $scope.filterToBackup = $scope.filterTo;

        $scope.filterPendingApply = false;
    }

    $scope.resetFilter();

    $scope.applyFilterCancel = function(){
        $scope.filterPendingApply = false;

        $scope.filterBranch = $scope.filterBranchBackup;
        $scope.filterBranchCode = $scope.filterBranchCodeBackup;
        $scope.filterFrom = $scope.filterFromBackup;
        $scope.filterTo = $scope.filterToBackup;

    }

    $scope.applyFilterConfirm = function(){
        $scope.filterPendingApply = false;

        //Send Post request.
        $scope.fetchData();
    }

    $scope.triggerFilter = function(){
        if($scope.isFilterEnabled){
            $scope.resetFilter();
            //Fetch default results
            $scope.fetchData();
        }
        else{
            $scope.isFilterEnabled = true;
            //show filter options window
        }
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterFromBackup = $scope.filterFrom;
                $scope.filterFrom = date;
                $scope.filterPendingApply = true;
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

        $scope.changeFilterFrom = function() {
            ionicDatePicker.openDatePicker(filterFromDate);
        }


        var filterToDate = {
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
                //var fancyDate = dd + ' ' + monthNames[temp.getMonth()] + ', ' + yyyy;

                $scope.filterToBackup = $scope.filterTo;
                $scope.filterTo = date;
                $scope.filterPendingApply = true;
                $ionicScrollDelegate.scrollTop();
            },
            disabledDates: [ //Optional
            ],
            //from:, //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.changeFilterTo = function() {
            ionicDatePicker.openDatePicker(filterToDate);
        }


        //Filter by branch
        $scope.changeFilterBranch = function() {

                //Get all the outlets
                $http.get('https://www.zaitoon.online/services/fetchoutlets.php')
                    .then(function(response) {
                        $scope.allList = response.data.response;

                            outletsPopup = $ionicPopup.show({
                                cssClass: 'popup-outer edit-shipping-address-view',
                                templateUrl: 'views/common/templates/outlets-popup.html',
                                scope: angular.extend($scope, {}),
                                buttons: [{
                                    text: 'Close'
                                }]
                            });


                    });



                //Callback
                $scope.setBranchFilter = function(val) {
                    $scope.filterBranchBackup = $scope.filterBranch;
                    $scope.filterBranchCodeBackup = $scope.filterBranchCode;
                    $scope.filterBranch = val.name;
                    $scope.filterBranchCode = val.code;
                    $scope.filterPendingApply = true;
                    $ionicScrollDelegate.scrollTop();

                    outletsPopup.close();
                }
        }


//Fetch Data

var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';


      
      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");

            if($scope.isFilterEnabled){
                data.filterBranch = $scope.filterBranchCode;
                data.filterFrom = $scope.filterFrom;
                data.filterTo = $scope.filterTo;
            }

            //LOADING 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpanalyticsstaff.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              timeout : 10000
             })
             .success(function(data) {

                $ionicLoading.hide();
                
                if(data.status){
                    $scope.overallData = data.response;
                    $scope.renderInfo();
                    $scope.renderFailed = false;
                }
                else{
                    $scope.overallData = {};
                    $scope.renderFailed = true;

                    $ionicLoading.show({
                        template:  data.error,
                        duration: 3000
                    });                    
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
           .error(function(data){
            $ionicLoading.hide();
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });

              $scope.renderFailed = true;
              $scope.$broadcast('scroll.refreshComplete');

          });
              
      }

      $scope.fetchData();

      $scope.doRefresh = function(){
        $scope.fetchData();
      }



      $scope.isRenderLoaded = false;

      $scope.renderInfo = function(){

                $scope.isRenderLoaded = true;

                //BAR CHART - Outletwise Staff Distribution

                  $scope.data = [];
                  $scope.labels = [];
                  var n = 0;
                  while($scope.overallData.outletWiseEmployees[n]){
                    $scope.labels.push($scope.overallData.outletWiseEmployees[n].name);
                    $scope.data.push($scope.overallData.outletWiseEmployees[n].count);

                    n++;
                  }

                  $scope.datasetOverride = [{ yAxisID: 'y-axis' }];
                  $scope.options = {
                    scales: {
                      yAxes: [
                        {
                          id: 'y-axis',
                          type: 'linear',
                          display: true,
                          position: 'left'
                        }
                      ]
                    }
                  };


                //DOUGHNUT - Attendance
                  $scope.labelsAttendance = ['Present ('+$scope.overallData.attendance.present+')', 'Half Day ('+$scope.overallData.attendance.halfday+')', 'Absent ('+$scope.overallData.attendance.absent+')',  'Unknown ('+$scope.overallData.attendance.unknown+')'];
                  $scope.colorsAttendance = ['#27ae60',  '#f39c12', '#c0392b', '#7f8c8d']
                  $scope.dataAttendance = [$scope.overallData.attendance.present, $scope.overallData.attendance.halfday, $scope.overallData.attendance.absent, $scope.overallData.attendance.unknown];

                  $scope.optionsAttendance = {
                        legend: { display: true, position: 'bottom' }
                  }

    }




        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

        $scope.getRevenueClass = function(current, previous){
            if(current >= previous){
                return 'ion-arrow-graph-up-right specialGreen';
            }
            else{
                return 'ion-arrow-graph-down-right specialRed';
            }
            
        }


        $scope.getFancyAmount = function(amount){
            amount = Math.abs(amount);

            if(amount < 10000){
                return amount;
            }
            else if(amount >= 10000 && amount < 100000){
                amount = amount/1000;
                amount = Math.round(amount * 10) / 10;
                return amount + "" + " K";
            }
            else if(amount >= 100000 && amount < 10000000){
                amount = amount/100000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " L";
            }
            else if(amount >= 10000000){
                amount = amount/10000000;
                amount = Math.round(amount * 100) / 100;
                return amount + "" + " Cr";
            }
        }



    })


                



.controller('staffInfoCtrl', function(changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */

      var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';



      $scope.day = moment();

      $scope.search = function(search_key){

            if(search_key == '' || !search_key){
                return '';
            }

            $scope.isViewingProfile = false; //to be safe

            var data = {};
            data.token = TEMP_TOKEN; //$cookies.get("dashManager");
            data.key = search_key;


            $http({
              method  : 'POST',
              url     : 'https://www.zaitoon.online/services/erpfetchpeople.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {

                if(response.data.status){
                  $scope.isSearched = true;
                  $scope.isFound = true;
                  $scope.staffData = response.data.response;

                  if($scope.staffData.length == 1){
                    $scope.singleStaff = true;
                  }
                  else{
                    $scope.singleStaff = false;
                  }

                  $scope.errorMessage = '';
                }
                else{
                  $scope.isSearched = true;
                  $scope.isFound = false;
                  $scope.staffData = {};
                  $scope.errorMessage = "No Results found.";
                }

            });
              
      }


      $scope.resetSearchView = function(){

        $scope.isSearched = false;
        $scope.isFound = false;
        $scope.singleStaff = false;
        
        $scope.staffData = "";

        $scope.searchKey = {};
        $scope.searchKey.value = "";

        $scope.errorMessage = "";

        $scope.isViewingProfile = false;
        $scope.isViewingProfileAttendance = false;
        $scope.isViewingProfileSalary = false;
      }

      $scope.resetSearchView();

     

      $scope.viewStaffProfile = function(staffObj){

        //default options for attendance and salary display
        $scope.isViewingProfileAttendance = false;
        $scope.isViewingProfileSalary = false;

        $scope.isViewingProfile = true;
        $scope.viewingStaffData = staffObj;

        console.log($scope.viewingStaffData)

      }

      $scope.goBackToResults = function(){
        $scope.isViewingProfile = false;
      }

      $scope.triggerSalaryButton = function(){
        if($scope.isViewingProfileSalary){
            $scope.isViewingProfileSalary = false;
        }
        else{
            $scope.showSalarySummary();
        }
      }

      $scope.showSalarySummary = function(){
        //LOAD SALARY SUMMARY
        $scope.isViewingProfileSalary = true;
      }


      $scope.triggerAttendanceButton = function(){
        if($scope.isViewingProfileAttendance){
            $scope.isViewingProfileAttendance = false;
        }
        else{
            $scope.showAttendanceSummary();
        }
      }


      $scope.showAttendanceSummary = function(){

                    var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';

                    var tempFormattedMonth = moment($scope.day).format('YYYYMM');

                    var data = {};
                    data.token = TEMP_TOKEN; //$cookies.get("dashManager");
                    data.month = tempFormattedMonth;

                    //LOADING 
                    $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                    $http({
                      method  : 'POST',
                      url     : 'https://www.zaitoon.online/services/erpanalyticsstaffattendance.php',
                      data    : data,
                      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                      timeout : 10000
                     })
                     .success(function(data) {

                        $ionicLoading.hide();
                        
                        if(data.status){
                            $scope.attendanceList = data.response;
                            $scope.renderCalender();
                        }
                        else{
                            $scope.attendanceList = [];

                            $ionicLoading.show({
                                template:  data.error,
                                duration: 3000
                            });                    
                        }
                    })
                   .error(function(data){
                    $ionicLoading.hide();
                      $ionicLoading.show({
                        template:  "Not responding. Check your connection.",
                        duration: 3000
                      });
                    });      
      }


      $scope.renderCalender = function(){

            $scope.isViewingProfileAttendance = true;

            $scope.selected = moment();
            $scope.month = $scope.selected.clone();

            $scope.displayCalendarMonth = moment($scope.selected).format('MMMM YYYY');

            var start = $scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

             _buildMonth($scope, start, $scope.month);
      }

                        $scope.select = function(day) {
                            $scope.selected = day.date;  
                        };

                        $scope.next = function() {
                            var next = $scope.month.clone();
                            _removeTime(next.month(next.month()+1).date(1));
                            $scope.month.month($scope.month.month()+1);

                            var tempFormattedMonth = moment($scope.month).format('YYYYMM');

                            //Call POST method
                            var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';

                            var data = {};
                            data.token = TEMP_TOKEN; //$cookies.get("dashManager");
                            data.month = tempFormattedMonth;

                            //LOADING 
                            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                            $http({
                              method  : 'POST',
                              url     : 'https://www.zaitoon.online/services/erpanalyticsstaffattendance.php',
                              data    : data,
                              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                              timeout : 10000
                             })
                             .success(function(data) {

                                $ionicLoading.hide();
                                
                                if(data.status){
                                    $scope.attendanceList = data.response;

                                    //make calender
                                    _buildMonth($scope, next, $scope.month);
                                }
                                else{
                                    $scope.attendanceList = [];

                                    $ionicLoading.show({
                                        template:  data.error,
                                        duration: 3000
                                    });                    
                                }
                            })
                           .error(function(data){
                            $ionicLoading.hide();
                              $ionicLoading.show({
                                template:  "Not responding. Check your connection.",
                                duration: 3000
                              });
                            }); 

                        };

                        $scope.previous = function() {
                            var previous = $scope.month.clone();
                            _removeTime(previous.month(previous.month()-1).date(1));
                            $scope.month.month($scope.month.month()-1);

                            var tempFormattedMonth = moment($scope.month).format('YYYYMM');


                            //Call POST method
                            var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOikSRf7xi1G0alsgJTZKK9YvpLRtnhL5iK3X5xhKyQh5A==';

                            var data = {};
                            data.token = TEMP_TOKEN; //$cookies.get("dashManager");
                            data.month = tempFormattedMonth;

                            //LOADING 
                            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

                            $http({
                              method  : 'POST',
                              url     : 'https://www.zaitoon.online/services/erpanalyticsstaffattendance.php',
                              data    : data,
                              headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                              timeout : 10000
                             })
                             .success(function(data) {

                                $ionicLoading.hide();
                                
                                if(data.status){
                                    $scope.attendanceList = data.response;

                                    //make calender
                                    _buildMonth($scope, previous, $scope.month);
                                }
                                else{
                                    $scope.attendanceList = [];

                                    $ionicLoading.show({
                                        template:  data.error,
                                        duration: 3000
                                    });                    
                                }
                            })
                           .error(function(data){
                            $ionicLoading.hide();
                              $ionicLoading.show({
                                template:  "Not responding. Check your connection.",
                                duration: 3000
                              });
                            });                             
                            
                        };


                function _removeTime(date) {
                    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
                }

                function _buildMonth(scope, start, month) {
                    scope.weeks = [];

                    $scope.displayCalendarMonth = moment(month).format('MMMM YYYY');

                    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
                    while (!done) {
                        scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                        date.add(1, "w");
                        done = count++ > 2 && monthIndex !== date.month();
                        monthIndex = date.month();
                    }
                }

                function _buildWeek(date, month) {
                    var days = [];
                    var statusToSet = '';
                    for (var i = 0; i < 7; i++) {

                        var tempFormatted = moment(date).format('DD-MM-YYYY');
                        
                        statusToSet = '';

                        for(var j = 0; j < $scope.attendanceList.length; j++){
                            if($scope.attendanceList[j].date == tempFormatted){
                                statusToSet = parseInt($scope.attendanceList[j].status);
                                break;
                            }
                        }

                        days.push({
                            number: date.date(),
                            isCurrentMonth: date.month() === month.month(),
                            isToday: date.isSame(new Date(), "day"),
                            status: statusToSet
                        });

                        date = date.clone();
                        date.add(1, "d");
                    }
                    return days;
                }

                $scope.getDayClass = function(day){

                    if(!day.isCurrentMonth){
                        return 'different-month';
                    }

                    switch(day.status){
                        case 0:{
                            return 'unknown';
                        }
                        case 1:{
                            return 'halfday';
                        }
                        case 2:{
                            return 'present';
                        }
                        case 5:{
                            return 'absent';
                        }
                        default:{
                            return '';
                        }

                    }       
                }




        $scope.defaultDisplayTitle = 'Registered Employees';


        $scope.showOptionsMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
            $scope.navToggled = !$scope.navToggled;
        };

})





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
            $state.go('main.app.landing');
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
                    url: 'https://www.kopperkadai.online/services/deskfetchfeedbackfigures.php',
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
                    url: 'https://www.kopperkadai.online/services/deskfetchreviews.php',
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
                    url: 'https://www.kopperkadai.online/services/deskfetchreviews.php',
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
            $state.go('main.app.landing');
        }

        $scope.showFree = function() {
            $state.go('main.app.free');
        }



    })

    .controller('summaryCtrl', function($timeout, summaryService, changeSlotService, $ionicLoading, ionicDatePicker, $scope, $ionicPopup, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {
        if (_.isUndefined(window.localStorage.admin)) {
            $state.go('main.app.login');
        }

        $scope.goHome = function() {
            $state.go('main.app.landing');
        }

        $scope.fromDate = summaryService.getFromDate();
        $scope.toDate = summaryService.getToDate();

        $scope.displayFromDate = $scope.fromDate;
        $scope.displayToDate = $scope.toDate;
		
		$scope.analytics = "";
		$scope.summary = "";

        $scope.init = function() {
			console.log('starting init')
            //POST to fetch list of reservations
            var data = {};
            data.fromDate = summaryService.getFromDate();
            data.toDate = summaryService.getToDate();

                data.token = window.localStorage.admin;
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

console.log(data)				

            $http({
                    method: 'POST',
                    url: 'https://www.kopperkadai.online/services/deskreservationsummary.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
					timeout: 10000
                })
                .success(function(response) {
					$ionicLoading.hide();
					
                    if (response.status) {
                        $scope.summary = response.response;
                        $scope.analytics = response.analytics;
                        $scope.error = "";
                    } else {
                        $scope.error = response.error;
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

        $scope.init();


        //Analytics Graph
        $scope.labels = ["", "", "", "", "", "", ""];
        $scope.series = ['This Week', 'Last Week'];
        $scope.data = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        $scope.initGraph = function() {
            var data = {};
            data.fromDate = summaryService.getFromDate();
            data.toDate = summaryService.getToDate();
			data.token = window.localStorage.admin;
			
            $http({
                    method: 'POST',
                    url: 'https://www.kopperkadai.online/services/deskreservationssummarygraph.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
					timeout: 10000
                })
                .success(function(response) {
                    
                    if (response.status) {
                        $scope.data = [
                            response.current,
                            response.previous
                        ];

                        $scope.labels = response.labels;
                    }
                })
                    .error(function(data) {

                    });				
        }

        $scope.initGraph();



        //Summary options
        $scope.getSummary = function() {
            var myPopup = $ionicPopup.show({
                title: 'Select Dates',
                cssClass: 'popup-outer edit-shipping-address-view',
                templateUrl: 'views/common/summary-options.html',
                scope: angular.extend($scope, {}),
                buttons: [{
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Proceed</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            summaryService.setFromDate($scope.fromDate);
                            summaryService.setToDate($scope.toDate);

                            $scope.displayFromDate = $scope.fromDate;
                            $scope.displayToDate = $scope.toDate;

                            myPopup.close();
                            $scope.init();
                        }
                    }
                ]
            });
        }



        //Setting Dates
        $scope.fromDateFormatted = $scope.fromDate;
        $scope.toDateFormatted = $scope.toDate;

        //Default Dates
        var temp = new Date();
        var mm = temp.getMonth() + 1;
        var dd = temp.getDate();
        var yyyy = temp.getFullYear();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        var date = dd + '-' + mm + '-' + yyyy;
        $scope.fromDate = date;
        $scope.toDate = date;


        //Date Picker stuff
        var dateObj1 = {
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
                $scope.fromDate = date;
                $scope.fromDateFormatted = fancyDate;

            },
            disabledDates: [ //Optional
            ],
            //from: new Date(), //Optional
            to: new Date(2020, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };


        var dateObj2 = {
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
                $scope.toDate = date;
                $scope.toDateFormatted = fancyDate;

            },
            disabledDates: [ //Optional
            ],
            //from: new Date(), //Optional
            to: new Date(2020, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };


        $scope.changeFromDate = function() {
            ionicDatePicker.openDatePicker(dateObj1);
        }

        $scope.changeToDate = function() {
            ionicDatePicker.openDatePicker(dateObj2);
        }



    })



    .controller('landingCtrl', function($scope, $state, $http, $ionicPopup, $ionicPopover, $ionicLoading, $timeout, mappingService, ionicDatePicker) {


        if (_.isUndefined(window.localStorage.admin) || window.localStorage.admin == '') {
            $state.go('main.app.login');
        }

		
		        //last regenerate date not set
        if (_.isUndefined(window.localStorage.lastRegenerate) || window.localStorage.lastRegenerate == '') {
            var d = new Date();
            window.localStorage.lastRegenerate = d.getDate();
        } else {
            var date = new Date();
            var today = date.getDate();
            if (window.localStorage.lastRegenerate != today) {

                var mydata = {};
                mydata.token = window.localStorage.admin;

                //Regenrating token
                $http({
                        method: 'POST',
                        url: 'https://www.kopperkadai.online/services/admintokenregenerate.php',
                        data: mydata,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
						timeout : 10000
                    })
                    .success(function(response) {
						$ionicLoading.hide();
                        if (response.status) {
                            window.localStorage.admin = response.response;
                            window.localStorage.lastRegenerate = today;
                        } else {
                            window.localStorage.admin = "";
                            window.localStorage.lastRegenerate = "";
                            $state.go('main.app.login');
                        }

                    })
                    .error(function(data) {});
            } else {
                //Do not regenerate
            }

        }


        $scope.logoutNow = function() {
            window.localStorage.admin = "";
            window.localStorage.lastRegenerate = "";
            $state.go('main.app.login');
        }
		
		
		

        $scope.dateList = [];

        //Pre-populate time and date list:
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var i = 0;
        var today = new Date();
        var dd, mm, yyyy;
        while (i < 7) {

            var date = new Date();
            date.setDate(today.getDate() + i);

            dd = date.getDate();
            mm = date.getMonth() + 1;
            yyyy = date.getFullYear();

            //Format Date and Month
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            if (i == 0) { //Today
                $scope.dateList.push({
                    value: dd + '-' + mm + '-' + yyyy,
                    name: "Today, " + date.getDate() + ' ' + months[date.getMonth()]
                });
            } else if (i == 1) { //Tomorrow
                $scope.dateList.push({
                    value: dd + '-' + mm + '-' + yyyy,
                    name: "Tomorrow, " + date.getDate() + ' ' + months[date.getMonth()]
                });
            } else { //Day Name
                $scope.dateList.push({
                    value: dd + '-' + mm + '-' + yyyy,
                    name: days[date.getDay()] + ", " + date.getDate() + ' ' + months[date.getMonth()]
                });
            }
            i++;
        }

        //Date DEFAULT option
        $scope.dateSelected = $scope.dateList[0];
        mappingService.setDate($scope.dateSelected.value, $scope.dateSelected.name);

        $scope.dateListSize = $scope.dateList.length;

        //Choose Date
        $timeout(function() { //Time delay is added to give time gap for popup to load!!
            $ionicPopover.fromTemplateUrl('views/common/date-chooser-popover.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.date_popover = popover;
            });
        }, 1000);

        $scope.openDatePopover = function($event) {
            $scope.date_popover.show($event);
        };

        $scope.setDate = function(date) {
            mappingService.setDate(date.value, date.name);
            $scope.dateSelected = date;
            $scope.date_popover.hide();
        };



        $scope.fetchReservations = function() {
            $state.go('main.app.reservations');
        };

        $scope.fetchSummary = function() {
            $state.go('main.app.summary');
        };

        $scope.viewFeedbacks = function() {
            $state.go('main.app.feedbacks');
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
                mappingService.setDate(date, fancyDate);

                var mydate = {};
                mydate.value = date;
                mydate.name = fancyDate;
                $scope.dateSelected = mydate;
            },
            disabledDates: [ //Optional
            ],
            //from: new Date(), //Optional
            to: new Date(2020, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: true, //Optional
            disableWeekdays: [], //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.selectCalendarDate = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        }



    })




    .controller('reservationsCtrl', function(changeSlotService, $ionicLoading, ionicDatePicker, $scope, $interval, $ionicPopup, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {

        if (_.isUndefined(window.localStorage.admin) || window.localStorage.admin == '') {
            $state.go('main.app.login');
        }

        $scope.myDate = mappingService.getFancyDate();
        $scope.myActualDate = mappingService.getDate();

        if ($scope.myDate == "") {
            $state.go('main.app.landing');
        }




        //DONE RESERVATIONS to show or not
        $scope.history = {};
        if (window.localStorage.displayFlag == 'true' || window.localStorage.displayFlag == 'false') {
            $scope.history.checked = window.localStorage.displayFlag == 'true' ? true : false;
        } else {
            $scope.history.checked = false;
        }

        $scope.displayFlagChange = function() {

            window.localStorage.displayFlag = $scope.history.checked;
        }



        //Search Key
        $scope.isSearched = false;
        $scope.searchID = '';
        $scope.isReservationsFound = false;
        $scope.resultMessage = '';
        $scope.filterTitle = 'Today\'s Reservations';
        $scope.isMoreLeft = false;

        $scope.activeLunchCount = 0;
        $scope.activeDinnerCount = 0;
        $scope.doneLunchCount = 0;
        $scope.doneDinnerCount = 0;

        $scope.activeLunchPAX = 0;
        $scope.activeDinnerPAX = 0;
        $scope.doneLunchPAX = 0;
        $scope.doneDinnerPAX = 0;

        $scope.showHistory = false; //Dont show history by default

        //Default Results : Reservations of the Week
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy;

        $scope.todayDate = today;


        //Lunch = 1 or Dinner = 2 or All = 0
        $scope.timeFilterFlag = 0;
        if (window.localStorage.timeFilter == 0 || window.localStorage.timeFilter == 1 || window.localStorage.timeFilter == 2) {
            $scope.timeFilterFlag = window.localStorage.timeFilter;
        }

        $scope.changeTimeFilter = function() {

            if ($scope.timeFilterFlag == 2) {
                $scope.timeFilterFlag = 0;
            } else {
                $scope.timeFilterFlag++;
            }
            window.localStorage.timeFilter = $scope.timeFilterFlag;
        }


        //Time Filter not found warning
        $scope.displayWarningCheck = function() {

            var showHistory = $scope.history.checked;

            //Show all, no restrictions
            if ($scope.timeFilterFlag == 0) {
                if (showHistory) {
                    if ($scope.activeLunchCount + $scope.activeDinnerCount == 0 && $scope.doneLunchCount + $scope.doneDinnerCount == 0) {
                        //No reservations found
                        return 0;
                    }
                } else {
                    if ($scope.activeLunchCount + $scope.activeDinnerCount == 0 && $scope.doneLunchCount + $scope.doneDinnerCount == 0) {
                        //No reservations found
                        return 0;
                    } else if ($scope.activeLunchCount + $scope.activeDinnerCount == 0 && $scope.doneLunchCount + $scope.doneDinnerCount != 0) {
                        //No active..  All in history
                        return 1;

                    }
                }
            } else if ($scope.timeFilterFlag == 1) { //Show only lunch
                if (showHistory) {
                    if ($scope.activeLunchCount == 0 && $scope.doneLunchCount == 0) {
                        //No reservations found
                        return 10;
                    }
                } else {
                    if ($scope.activeLunchCount == 0 && $scope.doneLunchCount == 0) {
                        //No reservations found
                        return 10;
                    } else if ($scope.activeLunchCount == 0 && $scope.doneLunchCount != 0) {
                        //No active..  All in history
                        return 1;

                    }
                }
            } else if ($scope.timeFilterFlag == 2) { //Show only dinner
                if (showHistory) {
                    if ($scope.activeDinnerCount == 0 && $scope.doneDinnerCount == 0) {
                        //No reservations found
                        return 20;
                    }
                } else {
                    if ($scope.activeDinnerCount == 0 && $scope.doneDinnerCount == 0) {
                        //No reservations found
                        return 20;
                    } else if ($scope.activeDinnerCount == 0 && $scope.doneDinnerCount != 0) {
                        //No active..  All in history
                        return 1;

                    }
                }
            }
        }



        //Reservation Filter
        $scope.getReservationsFiltered = function(myReservation) {

            var showHistory = $scope.history.checked;

            //Show all, no restrictions
            if ($scope.timeFilterFlag == 0) {
                if (myReservation.statusCode == 0 && !showHistory) {
                    return true;
                } else if (showHistory) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.timeFilterFlag == 1) { //Show only lunch
                if (myReservation.statusCode == 0 && !showHistory && myReservation.isLunch) {
                    return true;
                } else if (showHistory && myReservation.isLunch) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.timeFilterFlag == 2) { //Show only dinner
                if (myReservation.statusCode == 0 && !showHistory && !myReservation.isLunch) {
                    return true;
                } else if (showHistory && !myReservation.isLunch) {
                    return true;
                } else {
                    return false;
                }
            }
        }



        /* Various Counts */

        $scope.activeLunchCount = 0; //Want to Count only reservations with status 0
        $scope.activeDinnerCount = 0;
        $scope.doneLunchCount = 0;
        $scope.doneDinnerCount = 0;

        $scope.activeLunchPAX = 0;
        $scope.activeDinnerPAX = 0;
        $scope.doneLunchPAX = 0;
        $scope.doneDinnerPAX = 0;


        $scope.initReservations = function() {

            var data = {};
            data.token = window.localStorage.admin;
            data.key = $scope.myActualDate;

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            $http({
                    method: 'POST',
                    url: 'https://kopperkadai.online/services/deskfetchreservations.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                })
                .success(function(response) {
                    $ionicLoading.hide();
                    if (response.status) {

                        $scope.isReservationsFound = true;
                        $scope.reservationsList = response.response;

                        $scope.activeLunchCount = response.activeLunchCount;
                        $scope.activeDinnerCount = response.activeDinnerCount;
                        $scope.doneLunchCount = response.doneLunchCount;
                        $scope.doneDinnerCount = response.doneDinnerCount;

                        $scope.activeLunchPAX = response.activeLunchPAX;
                        $scope.activeDinnerPAX = response.activeDinnerPAX;
                        $scope.doneLunchPAX = response.doneLunchPAX;
                        $scope.doneDinnerPAX = response.doneDinnerPAX;

                    } else {
                        $scope.isReservationsFound = false;
                        $scope.resultMessage = "There are no Reservations found";
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "Not responding. Check your connection.",
                        duration: 3000
                    });
                });
        }
        $scope.initReservations();


        $scope.quickSummary = function() {

            var myTemplate = '<div class="row" style="color: #34495e; font-weight: bold; text-transform: uppercase; font-size: 12px"><div class="col" style="text-align: center; border-bottom: 1px solid #3c5064;">Lunch Session</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e; font-weight: 300; text-transform: uppercase; font-size: 10px"><div class="col col-50">Status</div><div class="col col-25" style="text-align: center">Count</div><div class="col col-25" style="text-align: center">PAX</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e;"><div class="col col-50">Pending</div><div class="col col-25" style="text-align: center">' + $scope.activeLunchCount + '</div><div class="col col-25" style="text-align: center">' + $scope.activeLunchPAX + '</div></div>'; // <--- Lunch Pending

            myTemplate = myTemplate + '<div class="row" style="color: #34495e;"><div class="col col-50">Completed</div><div class="col col-25" style="text-align: center">' + $scope.doneLunchCount + '</div><div class="col col-25" style="text-align: center">' + $scope.doneLunchPAX + '</div></div>'; // <--- Lunch Done

            /* Dinner */
            myTemplate = myTemplate + '<div class="row" style="color: #34495e; font-weight: bold; text-transform: uppercase; font-size: 12px"><div class="col" style="text-align: center; border-bottom: 1px solid #3c5064;">Dinner Session</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e; font-weight: 300; text-transform: uppercase; font-size: 10px"><div class="col col-50">Status</div><div class="col col-25" style="text-align: center">Count</div><div class="col col-25" style="text-align: center">PAX</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e;"><div class="col col-50">Pending</div><div class="col col-25" style="text-align: center">' + $scope.activeLunchCount + '</div><div class="col col-25" style="text-align: center">' + $scope.activeDinnerPAX + '</div></div>'; // <--- Dinner Pending

            myTemplate = myTemplate + '<div class="row" style="color: #34495e;"><div class="col col-50">Completed</div><div class="col col-25" style="text-align: center">' + $scope.doneLunchCount + '</div><div class="col col-25" style="text-align: center">' + $scope.doneDinnerPAX + '</div></div>'; // <--- Dinner Done


            /* All */
            myTemplate = myTemplate + '<div class="row" style="color: #34495e; font-weight: bold; text-transform: uppercase; font-size: 12px"><div class="col" style="text-align: center; border-bottom: 1px solid #3c5064;">Lunch & Dinner</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e; font-weight: 300; text-transform: uppercase; font-size: 10px"><div class="col col-50">Status</div><div class="col col-25" style="text-align: center">Count</div><div class="col col-25" style="text-align: center">PAX</div></div>';

            myTemplate = myTemplate + '<div class="row" style="color: #34495e;"><div class="col col-50">Completed</div><div class="col col-25" style="text-align: center">' + $scope.doneLunchCount + '</div><div class="col col-25" style="text-align: center">' + ($scope.doneDinnerPAX + $scope.doneLunchPAX) + '</div></div>'; // <--- All Done




            $ionicPopup.alert({
                title: 'Quick Summary',
                template: myTemplate,
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-balanced button-outline'
                }]
            });
        }



        $scope.openOptions = function(type, reservation) {

            if (type == 'SEATER' && reservation.statusCode <= 1) {
                currentBooking.setBooking(reservation);
                $state.go('main.app.map');
                return '';
            }

            var myPopup = "";

            if (reservation.statusCode == 0) {

                myPopup = $ionicPopup.show({
                    title: 'Options',
                    template: '<button class="button icon-left ion-edit button-outline button-positive button-block" ng-click="initModifyReservation()">Edit Reservation</button>' +
                        '<button class="button icon-left ion-android-cancel button-outline button-assertive button-block" ng-click="initCancelReservation()">Cancel Reservation</button>' +
                        '<button class="button icon-left ion-trash-a button-outline button-assertive button-block" ng-click="initDeleteReservation()">Mark Spam and Delete</button>',
                    scope: $scope,
                    buttons: [{
                        text: 'Close'
                    }]
                });

            } else if (reservation.statusCode == 1) {
                if (type == 'OPTIONS') {
                    myPopup = $ionicPopup.show({
                        title: 'Options',
                        template: '<button class="button icon-left ion-android-done button-outline button-balanced button-block" ng-click="initCompleteReservation()">Mark as Completed</button>' +
                            '<button class="button icon-left ion-android-cancel button-outline button-assertive button-block" ng-click="initCancelReservation()">Mark as Cancelled</button>',
                        scope: $scope,
                        buttons: [{
                            text: 'Close'
                        }]
                    });
                }
            } else if (reservation.statusCode == 2) {
                if (type == 'OPTIONS') {
                    myPopup = $ionicPopup.show({
                        title: 'Options',
                        template: '<button class="button icon-left ion-android-cancel button-outline button-assertive button-block" ng-click="initCancelReservation()">Mark as Cancelled</button>',
                        scope: $scope,
                        buttons: [{
                            text: 'Close'
                        }]
                    });
                } else if (type == 'SEATER') {
                    $ionicLoading.show({
                        template: "This reservation is already <b style='color: #2ecc71'>Completed</b>",
                        duration: 2000
                    });
                }
            } else if (reservation.statusCode == 4) {
                if (type == 'OPTIONS') {
                    myPopup = $ionicPopup.show({
                        title: 'Options',
                        template: '<button class="button icon-left ion-android-done button-outline button-balanced button-block" ng-click="initCompleteReservation()">Mark as Completed</button>' +
                            '<button class="button icon-left ion-android-cancel button-outline button-assertive button-block" ng-click="initCancelReservation()">Mark as Cancelled</button>',
                        scope: $scope,
                        buttons: [{
                            text: 'Close'
                        }]
                    });
                } else if (type == 'SEATER') {
                    $ionicLoading.show({
                        template: "This reservation is already getting <b style='color: #f39c12'>Billed</b>",
                        duration: 2000
                    });
                }
            } else if (reservation.statusCode == 5 || reservation.statusCode == 6) {
                $ionicLoading.show({
                    template: "This reservation is <b style='color: #e74c3c'>Cancelled</b>",
                    duration: 2000
                });
            } else {
                $ionicLoading.show({
                    template: "This reservation can not be edited",
                    duration: 2000
                });
            }

            //Initialisers
            $scope.initCancelReservation = function() {
                myPopup.close();
                $scope.cancelReservation(reservation);
            }

            $scope.initDeleteReservation = function() {
                myPopup.close();
                $scope.deleteReservation(reservation);
            }

            $scope.initModifyReservation = function() {
                myPopup.close();
                $scope.modifyReservation(reservation);
            }

            $scope.initCompleteReservation = function() {
                myPopup.close();
                $scope.completeReservation(reservation);
            }

        }

        $scope.quickView = function(reservation) {

            $ionicPopup.alert({
                title: 'Comments',
                template: '<p style="margin: 0; text-align: center; font-size: 16px; font-weight: 400; color: #2980b9;">' + reservation.comments + '</p>',
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-stable button-outline'
                }]
            });
        }


        //For Gen View only
        $scope.openSeatPlanView = function() {
            $state.go('main.app.map');
        }




        $scope.getClass = function(code, status) {

            if (code == 'COUNT') {
                if (status == 0) {
                    return 'resReceivedCount';
                } else if (status == 1) {
                    return 'resSeatedCount';
                } else if (status == 2) {
                    return 'resFinishedCount';

                } else if (status == 4) {
                    return 'resBilledCount';

                } else if (status == 5) {

                    return 'resCancelledCount';
                }
            } else if (code == 'STATUS') {
                if (status == 0) {
                    return 'resReceived';
                } else if (status == 1) {
                    return 'resSeated';
                } else if (status == 2) {
                    return 'resFinished';
                } else if (status == 4) {
                    return 'resBilled';

                } else if (status == 5) {

                    return 'resCancelled';
                }
            }


        }


        $scope.getShortBrief = function(resObj) {
            if (resObj.statusCode == 0) {
                return resObj.time;
            } else if (resObj.statusCode == 1) {
                return resObj.timeLapse != '' ? resObj.timeLapse : resObj.time;
            } else if (resObj.statusCode == 2) {
                return 'Completed';
            } else if (resObj.statusCode == 4) {
                return 'Billing';
            } else if (resObj.statusCode == 5) {
                return 'Cancelled';
            }

        }


        $scope.Timer = $interval(function() {
            $scope.initReservations();
        }, 60000);

        $scope.$on('$destroy', function() {
            $interval.cancel($scope.Timer);
        });


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
            $state.go('main.app.landing');
        }

    })


    .controller('TablesCtrl', function($scope, $http, $state, $rootScope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading) {

        if (_.isUndefined(window.localStorage.admin) || window.localStorage.admin == '') {
            $state.go('main.app.login');
        }


        /**** ACTUAL BEGINNING ***/
        $scope.isGeneralView = true;

        //Seater Area

        $scope.seatPlan = "";
        $scope.freeingAllList = "";
        $scope.seatPlanError = "";
        $scope.fetchTime = 'now';
        $scope.initSeatPlan = function() {

            $scope.seatPlanError = "";

            var data = {};
            data.token = window.localStorage.admin;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            $http({
                    method: 'POST',
                    url: 'https://kopperkadai.online/services/deskfetchtables.php',
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 10000
                })
                .success(function(response) {
                    $ionicLoading.hide();
                    if (response.status) {
                        $scope.seatPlanError = '';
                        $scope.fetchTime = response.time;
                        $scope.seatPlan = response.response;
                        $scope.freeingAllList = response.freeingList;
                    } else {
                        $scope.seatPlanError = response.error;
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

        $scope.initSeatPlan();


        $scope.isGeneralView = true;

        $scope.getMyClass = function(seat) {
            if (seat.status == 0) {
                return "button-balanced";
            } else if (seat.status == 1) {
                return "button-assertive";
            } else if (seat.status == 2) {
                return "button-energized";
            }
        }

        $scope.goBack = function() {
            $state.go('main.app.reservations');
        };
    })


.controller('AppCtrl', function(changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


})



// ONLINE ORDERS

 .controller('pendingOrdersCtrl', function($ionicActionSheet, changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
      /*  if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
            $state.go('main.app.landing');
        }
    */



var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOgFE1kpUfdk49ICSFMlFpeEQmANKHwckmtqJx2jKY6r1jd0GfFSLnBi7Lho856b/d8=';
    

    //List or Details View?
    $scope.isViewingOrder = false;

    $scope.searchKey = {};
    $scope.searchKey.value = '';


    $scope.initializePendingOrders = function(){

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 0;

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/fetchorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
            $scope.pending_orders = response.data.response;
            $scope.pending_orders_length = response.data.count;
       });
    }


    $scope.initializePendingOrders();

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



var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOgFE1kpUfdk49ICSFMlFpeEQmANKHwckmtqJx2jKY6r1jd0GfFSLnBi7Lho856b/d8=';
    

    //List or Details View?
    $scope.isViewingOrder = false;

    $scope.searchKey = {};
    $scope.searchKey.value = '';


    $scope.initializeConfirmedOrders = function(){

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 1;

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/fetchorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
            $scope.confirmed_orders = response.data.response;
            $scope.confirmed_orders_length = response.data.count;
       });
    }


    $scope.initializeConfirmedOrders();

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



var TEMP_TOKEN = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOgFE1kpUfdk49ICSFMlFpeEQmANKHwckmtqJx2jKY6r1jd0GfFSLnBi7Lho856b/d8=';
    

    //List or Details View?
    $scope.isViewingOrder = false;

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

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/filterorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
            $scope.completed_orders = response.data.response;
            $scope.completed_orders_length = $scope.completed_orders.length;
       });
    }


    $scope.initializeCompletedOrders();

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

      var data = {};
      data.token = TEMP_TOKEN; //$cookies.get("zaitoonAdmin");
      data.status = 2;
      data.key = temp_key;

      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/filterorders.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
            $scope.completed_orders = response.data.response;
            $scope.completed_orders_length = $scope.completed_orders.length;
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