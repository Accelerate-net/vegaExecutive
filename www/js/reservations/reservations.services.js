angular.module('reservations.services', [])

.service('changeSlotService', function ($http, $q){

  var requestFlag = false;

  //Default Parameters
  var mobile = "";
  var name = "";
  var count = "";
  var date = "";
  var time = "";
  var id = "";

  this.setValues = function (reservation){
    requestFlag = true;

     mobile = reservation.mobile;
     name = reservation.user;
     count = reservation.count;
     date = reservation.date;
     time = reservation.time;
     id = reservation.id;
  }

  this.getValues = function(){
    var data = {
      "mobile" : mobile,
      "name" : name,
      "count" : count,
      "date" : date,
      "time" : time,
      "id" : id
    }

    return data;
  }



})


.service('currentBooking', function ($http, $q){

    //Default Parameters
    var currentBook = "";

    this.setBooking = function (bookObj){
		currentBook = bookObj;
    }

    this.getBooking = function(){
      return currentBook;
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
