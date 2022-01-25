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
    let getOperationValue = ((level) => 
    {
        let returnObj = { values: [], r: -1, re: -1 };
        let maxValue = -1;

        switch(level)
        {
            case 1:
                    maxValue = 50;
                    break;
            case 2: 
                    maxValue = 100;
                    break;
            case 3: maxValue = 1000;
                    break;
        }

        // Genera 2 números aleatorios
        returnObj.values.push(randomIntFromInterval(1, maxValue));
        do
        {
            returnObj.values.push(Number(randomIntFromInterval(1, maxValue)));
        }
        while((returnObj.values[0] == returnObj.values[1]) ||
              ((((returnObj.values[0] - returnObj.values[1]) % 2) != 0)));

        let rAux = returnObj.values[0] - returnObj.values[1];
        let entra = false;
        if(returnObj.values[0] < returnObj.values[1])
        {   
            rAux *= -1;
            entra = true;
        }

        returnObj.r = rAux / 2;
        returnObj.re = (entra)? returnObj.values[0] + returnObj.r : 
                                returnObj.values[0] - returnObj.r;

        return returnObj;
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
            let lines = result.line.filter(l => {   
                                                    let c = 0;
                                                    l.forEach((e) => { if(e != "") c++; });
                                                    return (l != null && 
                                                            l.length > 0 &&
                                                            c == l.length);
                                                });

            if(lines && lines.length > 0)
            {
                let line = lines[lines.length-1];

                let rTotal = 0;
                lines.forEach(e => {    if(e[0] != ""){ rTotal += Number(e[0]); }});
                
                if(
                    line[line.length-1] == $scope.operationValues.re &&
                    line[line.length-2] == $scope.operationValues.re &&
                    rTotal == $scope.operationValues.r
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
    let level = 1;
    // ==============================

    $scope.operationValues = getOperationValue(level);

    $scope.numLines = 5;

    $scope.result = { line: []};
    
    for(let i= 0; i < $scope.numLines; i++)
    {   $scope.result.line[i] = [];
        let numColums = $scope.operationValues.values.length + 1;
        for(let j=0; j < numColums; j++)
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
                $scope.operationToPrint.push("<=>");
            }
        }
    }
});
