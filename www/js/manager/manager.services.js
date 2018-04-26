angular.module('manager.services', [])

.service('changeSlotService', function ($http, $q){

  var requestFlag = false;

  //Default Parameters
  var mobile = "";
  var name = "";
  var count = "";
  var date = "";
  var start = "";
  var comments = "";
  var mode = "";
  var id = "";


  this.setValues = function (reservation){
    requestFlag = true;

     mobile = reservation.mobile;
     name = reservation.name;
     count = reservation.count;
     date = reservation.date;
     start = reservation.start;
     comments = reservation.comments;
     mode = reservation.mode;
     id = reservation.id;
  }

  this.getValues = function(){
    var data = {
      "mobile" : mobile,
      "name" : name,
      "count" : count,
      "date" : date,
      "start" : start,
      "comments" : comments,
      "mode" : mode,
      "id" : id
    }

    return data;
  }



})


.service('currentBooking', function ($http, $q){

    //Default Parameters
    var mobile = "";
    var start = "";
    var duration = "";
    var stamp = "";
    var count = "";
    var id = "";

    this.setBooking = function (mob, time, interval, stam, num, reqid){
      mobile = mob;
      start = time;
      duration = interval;
      stamp = stam;
      count = num;
      id = reqid;
    }

    this.getBooking = function(){
      var data = {
        "mobile":mobile,
        "start":start,
        "duration": duration,
        "stamp": stamp,
        "count":count,
        "id":id
      }

      return data;
    }

})



.service('summaryService', function ($http, $q){

            //Default Dates
            var temp = new Date();
            var mm = temp.getMonth() + 1;
            var dd = temp.getDate();
            var yyyy = temp.getFullYear();
            if (mm < 10) mm = '0' + mm;
            if (dd < 10) dd = '0' + dd;
            var date = dd + '-' + mm + '-' + yyyy;
			
			
  //Default Parameters
  var fromDate = date;
  var toDate = date;

  this.setFromDate = function(mydate){
    fromDate = mydate;
  }

  this.setToDate = function(mydate){
    toDate = mydate;
  }

  this.getFromDate = function(){
    return fromDate;
  }

  this.getToDate = function(){
    return toDate;
  }
})


.service('mappingService', function ($http, $q){

  //Default Parameters
  var date = "";
  var dateName = "";

  this.setDate = function(dateFormatted, dateFancyName){
    date = dateFormatted;
    dateName = dateFancyName;
  }

  this.getDate = function(){
    return date;
  }

  this.getFancyDate = function(){
    return dateName;
  }

  this.clearAll = function(){
    rating = "";
  }

})

;
