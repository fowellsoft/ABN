var app = angular.module('escaleraDecimalApp', []);
app.controller('escaleraDecimalCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 700;
    
    $scope.numOrigen = 0.0;
    $scope.numDestino = 0.0;
    $scope.resultadoFinal = { "valor": "", "withError": false };

    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = ($scope.i == -1 && $scope.j == -1)? $scope.resultadoFinal.valor :
                                                          $scope.matrizEscalera[$scope.i][$scope.j].valor;
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                if($scope.i == -1 && $scope.j == -1)
                { $scope.resultadoFinal.valor = textAux; }
                else
                {   $scope.matrizEscalera[$scope.i][$scope.j].valor = textAux;  }
            }
        }
        else if(value == ",")
        {
            if(textAux && textAux.length > 0 && textAux.indexOf(",") == -1)
            {
                if($scope.i == -1 && $scope.j == -1)
                { $scope.resultadoFinal.valor += value; }
                else
                {   $scope.matrizEscalera[$scope.i][$scope.j].valor += value;  }
            }
        }
        else
        {
            if($scope.i == -1 && $scope.j == -1)
                { $scope.resultadoFinal.valor += value; }
                else
                {   $scope.matrizEscalera[$scope.i][$scope.j].valor += value;  }
        }
        
        // Resetea el error al cambiar algún dato
        if($scope.i == -1 && $scope.j == -1)
        {
            if($scope.resultadoFinal.withError)
                $scope.resultadoFinal.withError = false;
        }
        else
        {
            if($scope.matrizEscalera[$scope.i][$scope.j].withError)
                $scope.matrizEscalera[$scope.i][$scope.j].withError = false;
        }
    });

    $scope.selectField = ((i, j) =>
    {
        if((i == -1 && j == -1) ||
           ($scope.matrizEscalera && 
            $scope.matrizEscalera[i] &&
            $scope.matrizEscalera[i][j]))
        {
            $scope.i = i;
            $scope.j = j;
        }
    });

    $scope.isSelected = ((i, j) =>
    {
        return ($scope.i == i && $scope.j == j);
    });

    $scope.isSelectedWithError = ((i, j) =>
    {
        return (($scope.i == i && $scope.j == j) && 
                $scope.hasError(i, j));
    });

    $scope.isSelected = ((i, j) =>
    {
        return (($scope.i == i && $scope.j == j) &&
                !$scope.hasError(i, j));
    });

    $scope.hasError = ((i, j) => {

        if(i == -1 && j == -1)
        {
            return $scope.resultadoFinal.withError;
        }
        else
        {
            return($scope.matrizEscalera && i < $scope.matrizEscalera.length &&
                   $scope.matrizEscalera[i] && j < $scope.matrizEscalera[i].length &&
                   $scope.matrizEscalera[i][j].withError)
        }
    });


    $scope.validaResultados = (() => {

        $scope.resultadoOperaciones = { someoneWithError: false,
                                        finalMessage: ""
                                      };

        let result = $scope.numDestino - $scope.numOrigen;
        result = Math.round((result + Number.EPSILON) * 100) / 100;
        
        let aux = $scope.matrizEscalera.filter(e => e[0].valor != "" || e[1].valor != "");
        let refValue = $scope.numOrigen;
        let resultUser = Number(0.0);

        // Valida las operaciones de cada una de las filas
        for(let i=0; i < aux.length; i++)
        {
            let valoresList = aux[i];
            let showError = true;
            
            if(aux.length >= 2)
            {
                let npResult = Number(valoresList[0].valor.replace(",", "."));
                resultUser += npResult;
                resultUser = Math.round((resultUser + Number.EPSILON) * 100) / 100;

                let parcialResult = Number(refValue) + npResult;
                parcialResult = Math.round((parcialResult + Number.EPSILON) * 100) / 100;
                if(parcialResult != Number(valoresList[1].valor.replace(",", ".")))
                {
                    $scope.resultadoOperaciones.someoneWithError = true;
                    $scope.resultadoOperaciones.finalMessage = "Revisa las operaciones..."
                    valoresList[0].withError = showError;
                    valoresList[1].withError = showError;

                }
                refValue = Number(valoresList[1].valor.replace(",", "."));
            }
            else
            {
                $scope.resultadoOperaciones.someoneWithError = true;
                if($scope.resultadoOperaciones.finalMessage == "")
                    $scope.resultadoOperaciones.finalMessage = "Completa las operaciones..."
            }
        }

        if(resultUser == result && 
           $scope.resultadoFinal.valor.replace(",", ".") == result)
        {   showError = false; }
        else
        {   
            $scope.resultadoOperaciones.someoneWithError = true;
            $scope.resultadoOperaciones.finalMessage = "Revisa las operaciones..."
        }

        if(!$scope.resultadoOperaciones.someoneWithError)
        {
            $scope.resultadoOperaciones.finalMessage = "Bien hecho! Sigue practicando.";
        }

    });

    // ----------------------------------------------------------------------------

    let randomIntFromInterval = ((min, max) =>
    { 	// min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    });

    let loadValues = (() =>
    {
        let aux = randomIntFromInterval(1, 999);
        aux = aux / 100;
        $scope.numOrigen = aux;
        $scope.numDestino = 10;
    });
    loadValues();

    let numRows = 4;
    $scope.matrizEscalera = [];
    for(let i=0; i <= numRows; i++)
    {
        $scope.matrizEscalera[i] = [{ "valor": "" },
                                    { "valor": "" } ];
    }
});
