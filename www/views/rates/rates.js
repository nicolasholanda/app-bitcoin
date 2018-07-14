angular.module('App')
.controller('RatesController', function ($scope, $http, $ionicPopover, Currencies) {

  $scope.currencies = Currencies;

  $ionicPopover.fromTemplateUrl('views/rates/help-popover.html', {
      scope: $scope,
  }).then(function(popover){
      $scope.popover = popover;
  })

  $scope.openHelp = function($event){
      $scope.popover.show($event);
  };
  $scope.$on('$destroy', function(){
      $scope.popover.remove();
  });

  $scope.load = function load(){
    angular.forEach($scope.currencies, function (currency){
        if(currency.selected){
            $http.get(`https://apiv2.bitcoinaverage.com/indices/global/ticker/BTC${currency.code}`).success(function (info) {
                currency.ticker = info
                currency.ticker.timestamp = new Date()
            }).finally(function(){
                $scope.$broadcast('scroll.refreshComplete')
            });
        }
    })
  }

  $scope.load()
})