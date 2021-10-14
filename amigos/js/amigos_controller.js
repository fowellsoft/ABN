var app = angular.module('amigosApp', []);
app.controller('amigosCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 800;

    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.result.line[$scope.i][$scope.j];
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.result.line[$scope.i][$scope.j] = textAux;
            }
        }
        else
            $scope.result.line[$scope.i][$scope.j] += value;
    });

    $scope.selectField = ((i, j) =>
    {
        $scope.i = i;
        $scope.j = j;
    });

    $scope.isSelected = ((i, j) =>
    {
        return ($scope.i == i && $scope.j == j);
    });

    // ----------------------------------------------------------------------------

    // Podrán ser la valores finales como (10, 100, 1000) o números aleatorios dentro 
    $scope.numAmigo = 100;
    $scope.numLines= 10;



});