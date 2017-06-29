app.controller('dashboardController', ['$scope', '$http', '$timeout', '$interval', function($scope, $http, $timeout, $interval) {

    $("data_pane").hide();
    $scope.getData = function() {
      $http({
          
          method: 'GET',
          url: 'http://localhost/node/room_status.php'
          
      }).then(function (response) {
          
          // on success
          $scope.spice = response.data.result;
          $("data_pane").show();
          
      }, function (response) {
          
          // on error
          console.log(response.data,response.status);
          
      });
    };

    $scope.start = function() {
       $scope.myCall = $interval($scope.getData, 1000);        
    };

    $scope.stop = function() {
       $interval.cancel($scope.myCall);   
    };  

    $scope.start();

}]);

app.controller('reportController', ['$scope', '$http', function($scope, $http) {

    $("data_pane").hide();
    $scope.getData = function() {
      $http({
          
          method: 'GET',
          url: 'http://localhost/node/fetch.php'
          
      }).then(function (response) {

              response.data.result.forEach(function (dataItem) {



                var dt = moment(dataItem.date, ["YYYY-MM-DD hh:mm:ssa"]);
                var now = moment();
                var duration = moment.duration(now.diff(dt));
                var dateDiffInSec = duration.asSeconds();

/*
                console.log(
                  moment(hours)
                  .format('D[ day(s)] H[ hour(s)] m[ minute(s)] s[ second(s) ago.]')
                );

                console.log(dt)
                console.log(now)
                console.log(moment(duration).format("HH:mm:ss"))
                console.log(hours)
*/

                // Date Format : 2017-06-23 06:49:29pm
                dataItem.date = dt.format("dddd, MMMM Do YYYY, h:mm:ss a");

                //var dateDiffInSec = Math.abs(new Date() - new Date(dataItem.date));

                if(dateDiffInSec < 60){
                    var conditionTime = dateDiffInSec + " Seconds"
                } else if(dateDiffInSec > 60 && dateDiffInSec < 3600){
                    var conditionTime = Math.round(dateDiffInSec/60) + " Minutes"
                }else if(dateDiffInSec > 3600 && dateDiffInSec < 3600*60){
                    var conditionTime = Math.round(dateDiffInSec/(60*60),1) + " Hours"
                }else if(dateDiffInSec > 3600*24){
                    var conditionTime = Math.round(dateDiffInSec/(60*60*24),1) + " Days"
                }

                if(dataItem.status == 1){
                      dataItem.condition = "ON Since " + conditionTime;
                      dataItem.status = "ON";
                } else if(dataItem.status == 0){
                      dataItem.condition = "OFF Since " + conditionTime;
                      dataItem.status = "OFF";

                }

              });
          
          // on success
          $scope.spice = response.data.result;

          $("#searchResultsTbl").bootstrapTable({
                  data: $scope.spice
          });

          $("data_pane").show();
                    
      }, function (response) {
          
          // on error
          console.log(response.data,response.status);
          
      });
    };

    $scope.getData();

}]);
