angular.module('App')
.directive('hcChart', function(){
    return{
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function(scope, element){
            var chart = Highcharts.chart(element[0], scope.options)
            chart.setSize(window.innerWidth, window.innerHeight - 200)
        }
    };
})

.controller('HistoryController', function($scope, $http, $stateParams, $state, Currencies){
    $scope.currencies = Currencies;
    
    $scope.history = {
        currency: $stateParams.currency || 'USD'
    }
    $scope.changeCurrency = function(){
        $state.go('tabs.history', {currency: $scope.history.currency})
    }
    
    $scope.dados = []
    $scope.horas = []
    
    $http.get(`https://apiv2.bitcoinaverage.com/indices/global/history/BTC${$scope.history.currency}?period=monthly&?format=json`)
    .success(function(response){
        let i = 0;
        for(i=0; i<12; i++){
            //$scope.dados.push( parseInt(response[i].open) )
            //$scope.horas.push( parseInt(new Date(response[i].time).getHours()) ) 
            localStorage.setItem(`response${i}`, JSON.stringify(response[i]))
        }
    })

    for(i=0; i<12; i++){
        let aux = JSON.parse(localStorage.getItem(`response${i}`))
        $scope.dados.push(aux.average)
        $scope.horas.push( new Date(aux.time).toLocaleTimeString() )
    }

    console.log($scope.horas)
    $scope.chartOptions = {
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            categories: $scope.horas
        },
        yAxis:{
            title: false
        },
        series: [{
            title: 'prices',
            data: $scope.dados
        }],
        chart: {
            panning: false,
            pinchType: false
        },
        legend:{
            enabled: false
        },
        credits:{
            enabled: false
        }
        
    }
    
    $scope.$on('$ionicView.enter', function(){
        $scope.history = {
            currency: $stateParams.currency || 'USD'
        }
    })
})