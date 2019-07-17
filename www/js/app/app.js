angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('vegaExecutive', [
  'ngCordova',

  'ionic',
  // 'vegaExecutive.views',
  'common.directives',
  'common.controllers',

  'summary.controllers',
  'summary.services',

  'feedbacks.controllers',

  'orders.controllers',
  'orders.services',

  'underscore',
  'angularMoment',
  'ngMap',
  'ngRangeSlider'
])

.run(function($ionicPlatform, amMoment, $rootScope) {

  $rootScope.previousView = [];

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    var last_state = _.last($rootScope.previousView);

    if(last_state && (last_state.fromState === toState.name)){
      $rootScope.previousView.pop();
    }else{
      $rootScope.previousView.push({ "fromState": fromState.name, "fromParams": fromParams });
    }
  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    amMoment.changeLocale('en-gb');
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.form.checkbox('circle');

  if(!ionic.Platform.isWebView())
  {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider



    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'views/common/main.html'
    })

    .state('main.app', {
        url: '/app',
        abstract: true,
        views: {
            'main-view@main': {
                templateUrl: 'views/common/app-orders.html',
                controller: 'AppCtrl'
            }
        }
    })

    /**********************
             LOGIN
    ***********************/

    .state('main.app.login', {
        url: '/login',
        views: {
            'main-view@main': {
                templateUrl: 'views/home/login.html',
                controller: 'loginCtrl'
            }
        }
    })



    /**********************
          MAIN LAYOUT
    ***********************/

    .state('main.app.tiles', {
        url: '/tiles',
        views: {
            'main-view@main': {
                templateUrl: 'views/home/tiles.html',
                controller: 'tilesCtrl'
            }
        }
    })




    /**********************
             ORDERS
    ***********************/

    .state('main.app.orderspending', {
        url: '/orderspending',
        views: {
            'orders-pending@main.app': {
                templateUrl: 'views/orders/pending-orders.html',
                controller: 'pendingOrdersCtrl'
            }
        }
    })


    .state('main.app.ordersconfirmed', {
        url: '/ordersconfirmed',
        views: {
            'orders-confirmed@main.app': {
                templateUrl: 'views/orders/confirmed-orders.html',
                controller: 'confirmedOrdersCtrl'
            }
        }
    })


    .state('main.app.orderscompleted', {
        url: '/orderscompleted',
        views: {
            'orders-completed@main.app': {
                templateUrl: 'views/orders/completed-orders.html',
                controller: 'completedOrdersCtrl'
            }
        }
    })


    /**********************
            FEEDBACKS
    ***********************/

    .state('main.app.feedbacks', {
        url: '/feedbacks',
        views: {
            'main-view@main': {
                templateUrl: 'views/feedbacks/feedbacks.html',
                controller: 'feedbacksCtrl'
            }
        }
    })




    /**********************
            SUMMARY
    ***********************/


    .state('main.app.overall', {
        url: '/overall',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/overall.html',
                controller: 'overallCtrl'
            }
        }
    })

    .state('main.app.sales', {
        url: '/sales',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/sales.html',
                controller: 'salesCtrl'
            }
        }
    })

    .state('main.app.accounts', {
        url: '/accounts',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/accounts.html',
                controller: 'accountsCtrl'
            }
        }
    })

    .state('main.app.customers', {
        url: '/customers',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/customers.html',
                controller: 'customersCtrl'
            }
        }
    })

    .state('main.app.staff', {
        url: '/staff',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/staff.html',
                controller: 'staffCtrl'
            }
        }
    })

    .state('main.app.staffinfo', {
        url: '/staffinfo',
        views: {
            'main-view@main': {
                templateUrl: 'views/summary/staffinfo.html',
                controller: 'staffInfoCtrl'
            }
        }
    })



  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/app/login');
});
