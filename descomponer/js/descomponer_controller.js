var app = angular.module('descomponerApp', []);
app.controller('descomponerCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 700;
    $scope.numMaxDescompose = 999;
    let numRows = 5;

    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.matrizDescomposiciones[$scope.i].valores[$scope.j].valor;
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.matrizDescomposiciones[$scope.i].valores[$scope.j].valor = textAux;
            }
        }
        else
            $scope.matrizDescomposiciones[$scope.i].valores[$scope.j].valor += value;
        
        // Resetea el error al cambiar algún dato
        if($scope.matrizDescomposiciones[$scope.i].withError)
            $scope.matrizDescomposiciones[$scope.i].withError = false;
    });

    $scope.selectField = ((i, j) =>
    {
        if($scope.matrizDescomposiciones && 
           $scope.matrizDescomposiciones[i] &&
           $scope.matrizDescomposiciones[i].valores &&
           $scope.matrizDescomposiciones[i].valores[j] &&
           $scope.matrizDescomposiciones[i].valores[j].editable)
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
        return($scope.matrizDescomposiciones && i < $scope.matrizDescomposiciones.length &&
               $scope.matrizDescomposiciones[i] && j < $scope.matrizDescomposiciones[i].valores.length &&
               $scope.matrizDescomposiciones[i].valores[j].editable &&
               $scope.matrizDescomposiciones[i].valores[j].withError)
    });

    $scope.matrizDescomposiciones = [];
    
    // Para determinar el número de columnas calcula el número elementos del número
    // Lo convierte a string y mira su tamaño
    let numDescomposeAsString = $scope.numMaxDescompose.toString();

    // Construye la matriz con el número de filas que queremos que tenga
    for(let i=0; i < numRows; i++)
    {
        $scope.matrizDescomposiciones[i] = { valores: [] };

        for(let j=0; j < numDescomposeAsString.length; j++)
        {
            $scope.matrizDescomposiciones[i].valores[j] = { valor: "",
                                                            editable: true };
        }
    }

    const SISTEMA_DECIMAL = ["U", "D", "C", "M"];
    $scope.cabeceraDescomposiciones = [];

    // Determina el número menor y el mayor en función del tamaño del tamaño del número
    let minValue = 1;
    let maxValue = 9;

    for(let i=0; i < numDescomposeAsString.length; i++)
    {
        $scope.cabeceraDescomposiciones[i] = SISTEMA_DECIMAL[numDescomposeAsString.length-1-i];

        if(i < numDescomposeAsString.length-1)
        {
            minValue = minValue * 10;
            maxValue = ((maxValue * 10) + 9);
        }
    }
    
    let randomIntFromInterval = ((min, max) =>
    { 	// min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    });

    $scope.num2Descompose = randomIntFromInterval(minValue, maxValue);
    $scope.num2DescomposeList = Array.from($scope.num2Descompose.toString());

    $scope.validaResultados = (() => {

        $scope.resultadoOperaciones = { someoneWithError: false,
                                        finalMessage: ""
                                      };

        // Para cada una de las filas realiza la suma 
        for(let i=0; i < $scope.matrizDescomposiciones.length; i++)
        {
            let sumandosList = $scope.matrizDescomposiciones[i].valores;
            let showError = true;

            // Todos sumandos tienen valor
            let aux = sumandosList.filter(e => (e && e.valor && e.valor != ""));
            if(aux.length == sumandosList.length)
            {
                let total = 0;
                for(let j=0; j < sumandosList.length; j++)
                {
                    let numAux = 1;
                    for(let n = 0; n < sumandosList.length-j-1 ; n++){ numAux = numAux * 10}
                    total += Number(sumandosList[j].valor * numAux);
                }

                if(total == $scope.num2Descompose)
                {   showError = false; }
                else
                {   
                    $scope.resultadoOperaciones.someoneWithError = true;
                    $scope.resultadoOperaciones.finalMessage = "Revisa las operaciones..."
                }
            }
            else
            {
                $scope.matrizDescomposiciones[i].withError = true;

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

});