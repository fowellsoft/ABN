var app = angular.module('igualacionesApp', []);
app.controller('igualacionesCtrl', function($scope, $window) 
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
        returnObj.values.push(Number(randomIntFromInterval(1, maxValue)));
        let primero = true;

        do
        {
            if(!primero)
            {
                returnObj.values[1] = Number(randomIntFromInterval(1, maxValue));
                primero = false;
            }

            if(((returnObj.values[0] - returnObj.values[1]) % 2) != 0)
            {
                if(returnObj.values[0] < maxValue)
                    returnObj.values[0]++;
                else if(returnObj.values[1] < maxValue)
                    returnObj.values[1]++;
                
                console.log("Recalcula...");
            }
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
                
                let lr = 0;
                if(lines.length > 1)
                {
                    // Comprueba que el último valor sea el resultado de la suma
                    let lrs = result.line.filter(l => l[0] != "");
                    
                    if(lrs && lrs.length > 0)
                    {
                        lr = lrs[lrs.length-1][0];
                    }
                }

                if(
                    line[line.length-1] == $scope.operationValues.re &&
                    line[line.length-2] == $scope.operationValues.re &&
                    rTotal == $scope.operationValues.r &&
                    ((lr == 0) || (lr == $scope.operationValues.r))
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
        else if((value == "-" || value == "+"))
        {
            if($scope.j == 0)
            {
                if(value == "-")
                {
                    if(textAux && textAux.length > 0)
                    {
                        if(!textAux.startsWith("-"))
                        {
                            $scope.result.line[$scope.i][$scope.j] = value + $scope.result.line[$scope.i][$scope.j];
                        }
                    }
                    else
                    {   $scope.result.line[$scope.i][$scope.j] += value;    }
                }
                else
                {
                    if($scope.result.line[$scope.i][$scope.j] && 
                       $scope.result.line[$scope.i][$scope.j].length > 0 &&
                    $scope.result.line[$scope.i][$scope.j].startsWith("-"))
                    {
                        $scope.result.line[$scope.i][$scope.j] = $scope.result.line[$scope.i][$scope.j].substring(1);
                    }
                }
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
    let level = 3;
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
