var app = angular.module('dobleMitadApp', []);
app.controller('dobleMitadCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 800;
    
    let randomIntFromInterval = ((min, max) =>
    { 	// min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    });

    /**
     * Función que genera aleatoriamente operaciones
     */
    let getNumbers2Do = ((numElements, operationType, numPositions, level) => 
    {
        let returnObj = [];

        if(numElements && numElements > 0 &&
           operationType && operationType != "" &&
           numPositions && numPositions > 0 &&
           level && level > 0)
        {
            for(let i=0; i < numElements; i++)
            {
                let sNumber = "";
                let dificultyDone = false; // Para el nivel intermedio
                for(let j=0; j < numPositions; j++)
                {
                    let validNumbers = [];
                    if((level == 3 || (level == 2 && !dificultyDone )) &&
                       !(operationType == "M" && j == numPositions-1))
                    {   
                        validNumbers = ["0","1","2","3","4","5","6","7","8","9"];  
                    }
                    else if(operationType == "D")
                    {
                        if(level == 1 || level == 2)
                        {   validNumbers = ["0","1","2","3","4"];  }
                    }
                    else if(operationType = "M")
                    {
                        if((level == 1 || level == 2) ||
                           j == numPositions-1)
                        {   validNumbers = ["0","2","4","6","8"];  }
                    }

                    let aux = randomIntFromInterval((j==0)? 1 : 0, // Si es el primer elemento el 0 no lo coge. 
                                                    validNumbers.length-1);
                    
                    if(level == 2 &&
                       !dificultyDone &&
                       ((operationType == "D" && ["5", "6", "7", "8", "9"].includes(validNumbers[aux])) ||
                        (operationType == "M" && ["1", "3", "5", "7", "9"].includes(validNumbers[aux]))))
                    {
                        dificultyDone = true;
                    }

                                                    
                    sNumber += validNumbers[aux];
                }

                let n = Number(sNumber);
                let r = (operationType == "D")? (n*2) : (n/2);
                returnObj.push({ "value": n, "result": r })
            }
        }

        return returnObj;
    });



    /**
     * Función que corrige el resultado obtenido tras realizar los cálculos
     */ 
     $scope.validaResultados = (() => {

        $scope.resultadoOperaciones = { someoneWithError: false,
                                        finalMessage: ""
                                      };

        // Para cada una de las filas realiza la suma de los sumandos
        for(let i=0; i < $scope.result.line.length; i++)
        {
            let userResult = $scope.result.line[i][1];
            let showError = true;

            // Todos sumandos tienen valor
            if(userResult && userResult.trim() != "")
            {
                if(Number(userResult) == $scope.numberList[i].result)
                {   showError = false;
                    $scope.numberList[i].withError = false;
                }
                else
                {   
                    $scope.numberList[i].withError = true;
                    $scope.resultadoOperaciones.someoneWithError = true;
                    $scope.resultadoOperaciones.finalMessage = "Revisa los resultados..."
                }
            }
            else
            {
                $scope.numberList[i].withError = true;
                $scope.resultadoOperaciones.someoneWithError = true;
                if($scope.resultadoOperaciones.finalMessage == "")
                    $scope.resultadoOperaciones.finalMessage = "Completa los resultados..."
            }
        }

        if(!$scope.resultadoOperaciones.someoneWithError)
        {
            $scope.resultadoOperaciones.finalMessage = "Bien hecho! Sigue practicando.";
        }

    });


    $scope.i = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.result.line[$scope.i][1];
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.result.line[$scope.i][1] = textAux;
            }
        }
        else
            $scope.result.line[$scope.i][1] += value;
    });

    $scope.selectField = ((i) =>
    {
        $scope.i = i;
    });

    $scope.isSelected = ((i) =>
    {
        return (($scope.i == i) &&
                !$scope.hasError(i));
    });

    $scope.isSelectedWithError = ((i) =>
    {
        return (($scope.i == i) && 
                $scope.hasError(i));
    });

    $scope.hasError = ((i) => {
        return($scope.numberList && i < $scope.numberList.length &&
               $scope.numberList[i].withError)
    });

    
    // Configuración de variables
    let numElements = 5
    let operationType = "D" // "D" - Doble | "M" - Mitad
    let numPositions = 3;

    // Niveles: en función del nivel genera números más complejos
    // Doble:
    //  Nivel 1: números inferiores a 5 para que no sobrepase.
    //  Nivel 2: sólo 1 de los números es impar
    //  Nivel 3: sin restricciones
    // Mitad:
    //  Nivel 1: números pares
    //  Nivel 2: sólo 1 de los números sobrepasa
    //  Nivel 3: sin restricciones
    
    $scope.titulo = (operationType == "M")? "Escribe la MITAD de..." : "Escribe el DOBLE de..."

    let level = 3 // 

    // ==============================

    $scope.numberList = getNumbers2Do(numElements, operationType, numPositions, level);

    $scope.result = { line: []};
    
    for(let i= 0; i < $scope.numberList.length; i++)
    {   $scope.result.line[i] = [$scope.numberList[i].value, ""];
         
    }
});
