var app = angular.module('rejillaApp', []);
app.controller('rejillaCtrl', function($scope, $window) 
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
    let getOperationValue = ((maxValueList, maxTotal) => 
    {
        let returnObj = null;

        // Calcula los valores y operadores
        if(maxValueList && maxValueList.length >= 2)
        {
            returnObj = {};
            returnObj.values = [];
            for(let i=0; i<maxValueList.length; i++)
            {
                returnObj.values.push(randomIntFromInterval(1, maxValueList[i]));
            }
                
            returnObj.operators = [];
            for(let i=0; i<maxValueList.length-1; i++)
            {
                returnObj.operators.push(randomIntFromInterval(0, 1)? "+" : "-");
            }

            let totalValue = 0;
            // Realiza la operación
            for(let i=0; i < returnObj.values.length; i++)
            {
                if(i==0)
                { totalValue = Number(returnObj.values[i]); }
                else
                {
                    if(returnObj.operators[i-1] == "+")
                        totalValue += Number(returnObj.values[i]);
                    else if(returnObj.operators[i-1] == "-")
                        totalValue -= Number(returnObj.values[i]);
                }
            }
            returnObj.total = totalValue;
        }

        return returnObj;
    });

    /**
     * Función que valida que los valores calculados cumplen las necesidades
     */ 
    let validaOperationValues = ((operationValues, maxTotal) =>
    {
        let resultValid = true;

        if(operationValues &&
            operationValues.total &&
            Number(operationValues.total) <= maxTotal &&
            Number(operationValues.total) >= 0)
        {
            let totalValue = 0;
            // Realiza la operación
            for(let i=0; i < operationValues.values.length && resultValid; i++)
            {
                if(i==0)
                { totalValue = Number(operationValues.values[i]); }
                else
                {
                    if(operationValues.operators[i-1] == "+")
                        totalValue += Number(operationValues.values[i]);
                    else if(operationValues.operators[i-1] == "-")
                        totalValue -= Number(operationValues.values[i]);
                }

                if(totalValue < 0)
                    resultValid = false;
            }
        }
        else
            resultValid = false;

        return resultValid;
    });

    /**
     * Función que corrige el resultado obtenido tras realizar los cálculos
     */ 
    $scope.validaResultado = (() =>
    {
        let isOK = false;
        let finalMessage = "";

        let result = $scope.result;

        if(result &&
            result.line)
        {
            let lines = result.line.filter(l => (l != null && 
                                                 l.length > 0 &&
                                                 l.find(e => e != "") != null));

            if(lines && lines.length > 0)
            {
                let line = lines[lines.length-1];
                let resultFinal = line.filter((l, i) => (l != null && l.trim() != "0" && l.trim() != "" && i > 0));

                if((resultFinal && 
                    resultFinal.length == 1 &&
                    $scope.operationValues.total != 0 &&
                    Number(resultFinal[0]) == $scope.operationValues.total) ||
                   ($scope.operationValues.total == 0)
                  )
                {
                    isOK = true;
                    finalMessage = "Resultado correcto!!!";
                }
                else
                {
                    finalMessage = "Algo has hecho mal!!! Revísalo";
                }
            }
            else
            {
                finalMessage = "Primero debes realizar la operación";
            }
        }
        else
        {
            finalMessage = "Primero debes realizar la operación";
        }

        $scope.resultadoOperacion = { isOK: isOK,
                                        finalMessage: finalMessage };
    });

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
    
    // Configuración de variables
    let maxValueList = [300, 400];
    let maxTotal = 999;
    $scope.numLines = 5;
    // ==============================

    $scope.result = { line: []};
    
    for(let i= 0; i < $scope.numLines; i++)
    {   $scope.result.line[i] = []; 
        for(let j=0; j < maxValueList.length+1; j++)
            $scope.result.line[i].push("");
    }

    

    $scope.operationValues = null;

    do
    {
        $scope.operationValues = getOperationValue(maxValueList, maxTotal);

    }
    while (!validaOperationValues($scope.operationValues, maxTotal));
    
    $scope.operationToPrint = [];
    if($scope.operationValues && $scope.operationValues.values.length > 0)
    {
        for(let i=0; i < $scope.operationValues.values.length; i++)
        {
            $scope.operationToPrint.push($scope.operationValues.values[i]);
            if(i < $scope.operationValues.values.length-1)
            {
                $scope.operationToPrint.push($scope.operationValues.operators[i]);
            }
        }
    }
});