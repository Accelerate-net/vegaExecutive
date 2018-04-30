angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('zaitoonFirst', [
  'ngCordova',

  'ionic',
  'zaitoonFirst.views',
  'common.directives',

  'manager.controllers',
  'manager.services',

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
            templateUrl: 'views/common/app.html',
            controller: 'AppCtrl'
          }
        }
      })


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



      .state('main.app.landing', {
        url: '/landing',
        views: {
          'main-view@main': {
            templateUrl: 'views/home/landing.html',
            controller: 'landingCtrl'
          }
        }
      })


          .state('main.app.map', {
            url: '/map',
            views: {
              'main-view@main': {
                templateUrl: 'views/reservations/tables.html',
                controller: 'TablesCtrl'
              }
            }
          })





          .state('main.app.reservations', {
            url: '/reservations',
            views: {
              'main-view@main': {
                templateUrl: 'views/reservations/reservations.html',
                controller: 'reservationsCtrl'
              }
            }
          })

          .state('main.app.summary', {
            url: '/summary',
            views: {
              'main-view@main': {
                templateUrl: 'views/reservations/summary.html',
                controller: 'summaryCtrl'
              }
            }
          })

          .state('main.app.feedbacks', {
            url: '/feedbacks',
            views: {
              'main-view@main': {
                templateUrl: 'views/review/feedbacks.html',
                controller: 'feedbacksCtrl'
              }
            }
          })

          .state('main.app.login', {
            url: '/login',
            views: {
              'main-view@main': {
                templateUrl: 'views/home/login.html',
                controller: 'loginCtrl'
              }
            }
          })



          .state('main.app.tiles', {
            url: '/tiles',
            views: {
              'main-view@main': {
                templateUrl: 'views/home/tiles.html',
                controller: 'tilesCtrl'
              }
            }
          })  


          .state('main.app.overall', {
            url: '/overall',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/overall.html',
                controller: 'overallCtrl'
              }
            }
          })  

          .state('main.app.sales', {
            url: '/sales',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/sales.html',
                controller: 'salesCtrl'
              }
            }
          })  

          .state('main.app.accounts', {
            url: '/accounts',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/accounts.html',
                controller: 'accountsCtrl'
              }
            }
          })  

          .state('main.app.customers', {
            url: '/customers',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/customers.html',
                controller: 'customersCtrl'
              }
            }
          })  

          .state('main.app.staff', {
            url: '/staff',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/staff.html',
                controller: 'staffCtrl'
              }
            }
          })  

          .state('main.app.staffinfo', {
            url: '/staffinfo',
            views: {
              'main-view@main': {
                templateUrl: 'views/pages/staffinfo.html',
                controller: 'staffInfoCtrl'
              }
            }
          })  




  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/app/login');
});
