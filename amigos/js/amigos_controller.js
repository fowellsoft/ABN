var app = angular.module('amigosApp', []);
app.controller('amigosCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 700;

    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.matrizAmigo[$scope.i][$scope.j].sumando;
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.matrizAmigo[$scope.i][$scope.j].sumando = textAux;
            }
        }
        else
            $scope.matrizAmigo[$scope.i][$scope.j].sumando += value;
        
        // Resetea el error al cambiar algún dato
        if($scope.matrizAmigo[$scope.i][$scope.j].withError)
            $scope.matrizAmigo[$scope.i][$scope.j].withError = false;
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
        return($scope.matrizAmigo && i < $scope.matrizAmigo.length &&
               $scope.matrizAmigo[i] && j < $scope.matrizAmigo[i].length &&
               $scope.matrizAmigo[i][j].editable &&
               $scope.matrizAmigo[i][j].withError)
    });

    $scope.validaResultados = (() => {

        $scope.resultadoOperaciones = { someoneWithError: false,
                                        finalMessage: ""
                                      };

        // Para cada una de las filas realiza la suma de los sumandos
        for(let i=0; i < $scope.matrizAmigo.length; i++)
        {
            let sumandosList = $scope.matrizAmigo[i];
            let showError = true;

            // Todos sumandos tienen valor
            let aux = sumandosList.filter(e => (e && e.sumando && e.sumando != ""));
            if(aux.length >= 2)
            {
                let total = 0;
                for(let j=0; j < sumandosList.length; j++)
                {
                    total += Number(sumandosList[j].sumando);
                }

                if(total == $scope.numAmigo)
                {   showError = false; }
                else
                {   
                    $scope.resultadoOperaciones.someoneWithError = true;
                    $scope.resultadoOperaciones.finalMessage = "Revisa las operaciones..."
                }
            }
            else
            {
                $scope.resultadoOperaciones.someoneWithError = true;
                if($scope.resultadoOperaciones.finalMessage == "")
                    $scope.resultadoOperaciones.finalMessage = "Completa las operaciones..."
            }

            
            // Filtra el editable
            for(j=0; j < sumandosList.length; j++)
            {
                if(sumandosList[j].editable)
                    sumandosList[j].withError = showError;
            }
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

    // Podrán ser la valores finales como (10, 100, 1000) o números aleatorios dentro 
    $scope.numAmigo = 10;
    let numLastre = 1;
    if((numLastre != 1 && $scope.numAmigo%10 != 0 && numLastre%10 != 0) ||
       (numLastre >= $scope.numAmigo))
        numLastre = 1;

    // Número amigo <=10 => siempre derecha, numAmigo+1 (por el 0)
    // Número amigo >10 => alterna derecha e izquierda, numFilas configurable por defecto 10

    let numRows = 8;
    $scope.matrizAmigo = [];
    if($scope.numAmigo <= 10)
    {
        for(let i=0; i <= $scope.numAmigo; i++)
        {
            $scope.matrizAmigo[i] = [{ "sumando": "", "editable": true},
                                     { "sumando": "", "editable": true}];
        }
    }
    else
    {
        $scope.j = 1;
        for(let i=0; i < numRows; i++)
        {
            // Evita que se repitan
            let v = -1;
            do
            {
                v = randomIntFromInterval(1, $scope.numAmigo/numLastre);
            }
            while($scope.matrizAmigo.find(m => m.find(e => e && e.sumando && e.sumando != "" && e.sumando == v*numLastre)))

            $scope.matrizAmigo[i] = [];

            if(((i+1)%2)!=0) // Si es impar
            {
                $scope.matrizAmigo[i][0] = { "sumando": v*numLastre, "editable": false} ;
                $scope.matrizAmigo[i][1] = { "sumando": "", "editable": true};
            }
            else // Si es par
            {
                $scope.matrizAmigo[i][0] = { "sumando": "", "editable": true};
                $scope.matrizAmigo[i][1] = { "sumando": v*numLastre, "editable": false};
            }
        }
    }
});
