angular.module('summary.controllers', ['ionic', 'ui.router', 'ionic-timepicker', 'ionic-datepicker', 'chart.js']) //, 'moment-picker'


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


   .controller('salesCtrl', function(changeSlotService, $ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


        //Already Logged in case
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
        }
    



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
    $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token =  window.localStorage.admin;

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
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
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

      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = window.localStorage.admin;

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
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
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

      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = window.localStorage.admin;

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
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
        }
    

$scope.getFancyCommaNumber = function(x){
    return x.toLocaleString('en-US', {maximumSignificantDigits : 12});
}


    //Fetch Data

      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = window.localStorage.admin;

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
            data.token = window.localStorage.admin;
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
            data.token = window.localStorage.admin;
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
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
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
      
      $scope.fetchData = function(){

            $scope.isRenderLoaded = false;
            $scope.renderFailed = false;

            var data = {};
            data.token = window.localStorage.admin;

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
        if (!_.isUndefined(window.localStorage.admin) && window.localStorage.admin != '') {
  
        }
        else{
          $state.go('main.app.login');
        }
    

      $scope.day = moment();

      $scope.search = function(search_key){

            if(search_key == '' || !search_key){
                return '';
            }

            $scope.isViewingProfile = false; //to be safe

            var data = {};
            data.token = window.localStorage.admin;
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

                    var tempFormattedMonth = moment($scope.day).format('YYYYMM');

                    var data = {};
                    data.token = window.localStorage.admin;
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

                            var data = {};
                            data.token = window.localStorage.admin;
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

                            var data = {};
                            data.token = window.localStorage.admin;
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

.controller('AppCtrl', function(changeSlotService, $ionicSideMenuDelegate, $scope, $ionicPopup, ionicTimePicker, ionicDatePicker, $state, $http, $ionicPopover, $ionicLoading, $timeout, mappingService, currentBooking) {


})

;