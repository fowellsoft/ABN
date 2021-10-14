var app = angular.module('amigosApp', []);
app.controller('amigosCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 800;

    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.matrizAmigo[$scope.i][$scope.j].valor;
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.matrizAmigo[$scope.i][$scope.j].valor = textAux;
            }
        }
        else
            $scope.matrizAmigo[$scope.i][$scope.j].valor += value;
    });

    $scope.selectField = ((i, j) =>
    {
        if($scope.matrizAmigo && 
           $scope.matrizAmigo[i] &&
           $scope.matrizAmigo[i][j] &&
           $scope.matrizAmigo[i][j].editable)
        {
            $scope.i = i;
            $scope.j = j;
        }
    });

    $scope.isSelected = ((i, j) =>
    {
        return ($scope.i == i && $scope.j == j);
    });

    // ----------------------------------------------------------------------------

    let randomIntFromInterval = ((min, max) =>
    { 	// min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    });


    // Podrán ser la valores finales como (10, 100, 1000) o números aleatorios dentro 
    $scope.numAmigo = 10;

    // Número amigo <=10 => siempre derecha, numAmigo+1 (por el 0)
    // Número amigo >10 => alterna derecha e izquierda, numFilas configurable por defecto 10

    let numRows = 8;
    $scope.matrizAmigo = [];
    if($scope.numAmigo <= 10)
    {
        for(let i=0; i <= $scope.numAmigo; i++)
        {
            $scope.matrizAmigo[i] = [{ "valor": "", "editable": true},
                                     { "valor": "", "editable": true}];
        }
    }
    else
    {
        $scope.j = 1;
        for(let i=0; i < numRows; i++)
        {
            let v = randomIntFromInterval(1, $scope.numAmigo);
            $scope.matrizAmigo[i] = [];

            if(((i+1)%2)!=0) // Si es impar
            {
                $scope.matrizAmigo[i][0] = { "valor": v, "editable": false} ;
                $scope.matrizAmigo[i][1] = { "valor": "", "editable": true};
            }
            else // Si es par
            {
                $scope.matrizAmigo[i][0] = { "valor": "", "editable": true};
                $scope.matrizAmigo[i][1] = { "valor": v, "editable": false};
            }
        }
    }

    $scope.isEditable = ((i, j) => {



    });

});