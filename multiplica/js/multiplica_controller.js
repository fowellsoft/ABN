var app = angular.module('multiplicaApp', []);
app.controller('multiplicaCtrl', function($scope, $window) 
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
    let getOperationValue = ((multicandoNumElements, multiplicadoresValidList, multiplicadoresElements) => 
    {
        let returnObj = { values: [], operators: [] };

        // Calcula el número "multiplicando" el función del número de elementos establecido
        if(multicandoNumElements && multicandoNumElements > 0)
        {
            let multiplicandoValue = "";

            for(let i=0; i<multicandoNumElements; i++)
            {
                multiplicandoValue += randomIntFromInterval(0, 9);
            }
            
            returnObj.values.push(Number(multiplicandoValue));
        }

        if(!multiplicadoresElements || multiplicadoresElements <= 0)
            multiplicadoresElements = 1;
        
        if(!multiplicadoresValidList || multiplicadoresValidList.length <= 0)
            multiplicadoresValidList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        // Calcula el multiplicador
        let multiplicadorValue = "";
        for(let i=0; i<multiplicadoresElements; i++)
        {
            multiplicadorValue += multiplicadoresValidList[randomIntFromInterval((i == 0)? 1 : 0, 
                                                                                 multiplicadoresValidList.length-1)];
        }
        returnObj.values.push(Number(multiplicadorValue));

        // Añade el operador
        returnObj.operators.push("x");

        if(returnObj && returnObj.values && returnObj.values.length >= 2)
        {
            let totalValue = 0;
            // Realiza la operación
            for(let i=0; i < returnObj.values.length; i++)
            {
                if(i==0)
                { totalValue = Number(returnObj.values[i]); }
                else
                {
                    if(returnObj.operators[i-1] == "x")
                        totalValue *= Number(returnObj.values[i]);
                    else if(returnObj.operators[i-1] == "+")
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

                // Se coge el valor más a la derecha
                let resultFinal = -1;
                for(let i=line.length-1; i >= 0 && resultFinal < 0; i--)
                {   
                    if(line[i] && line[i].trim() != "")
                        resultFinal = line[i];
                }
                
                if((resultFinal && 
                    resultFinal >= 0 &&
                    $scope.operationValues.total != 0 &&
                    Number(resultFinal) == $scope.operationValues.total) ||
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
    let multiplicadoresValidList = [0, 2, 3, 5];
    let multicandoNumElements = 3;
    let multiplicadoresNumElements = 2;
    // ==============================

    $scope.operationValues = getOperationValue(multicandoNumElements, multiplicadoresValidList, multiplicadoresNumElements);

    $scope.numLines = $scope.operationValues.values[0].toString().length;

    $scope.result = { line: []};
    
    for(let i= 0; i < $scope.numLines; i++)
    {   $scope.result.line[i] = []; 
        for(let j=0; j < $scope.operationValues.values[1].toString().length+2; j++)
            $scope.result.line[i].push("");
    }
    
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
