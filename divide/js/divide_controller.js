var app = angular.module('divideApp', []);
app.controller('divideCtrl', function($scope, $window) 
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
    let getOperationValue = ((dividendoNumElements, divisoresValidList, dividendosElements, exacto) => 
    {
        let returnObj = { values: [], operator: "", cocienteResult: 0, restoResult: 0 };

        // Calcula el número "dividendo" el función del número de elementos establecido
        if(dividendoNumElements && dividendoNumElements > 0)
        {
            let dividendoValue = "";

            for(let i=0; i<dividendoNumElements; i++)
            {
                dividendoValue += randomIntFromInterval(0, 9);
            }
            
            returnObj.values.push(Number(dividendoValue));
        }

        if(!dividendosElements || dividendosElements <= 0)
            dividendosElements = 1;
        
        if(!divisoresValidList || divisoresValidList.length <= 0) // Si no se ha especificado lista todos valen
        divisoresValidList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        // Calcula el divisor
        let divisorValue = "";
        for(let i=0; i<dividendosElements; i++)
        {
            divisorValue += divisoresValidList[randomIntFromInterval((i == 0)? 1 : 0, 
                                                                                divisoresValidList.length-1)];
        }
        returnObj.values.push(Number(divisorValue));

        // Añade el operador
        returnObj.operator = "/";

        if(returnObj && returnObj.values && returnObj.values.length >= 2)
        {
            returnObj.cocienteResult = Math.floor(Number(returnObj.values[0]) / Number(returnObj.values[1]));
            returnObj.restoResult = Number(returnObj.values[0]) % Number(returnObj.values[1]);
        }

        if(exacto && returnObj.restoResult != 0)
        {
            returnObj.values[0] += (Number(returnObj.values[1]) - Number(returnObj.restoResult));
            returnObj.cocienteResult = Math.floor(Number(returnObj.values[0]) / Number(returnObj.values[1]));
            returnObj.restoResult = Number(returnObj.values[0]) % Number(returnObj.values[1]);
        }

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
            // Se queda con las líneas que tienen contenido
            let lines = result.line.filter(l => (l != null && 
                                                 l.length > 0 &&
                                                 l.find(e => e != "") != null));


            if(lines && lines.length > 0)
            {
                // Se queda con la última línea
                let line = lines[lines.length-1];

                // Se coge el valor más a la derecha
                let resultFinal = line[line.length-1];
                let restoFinal = line[0];

                let resultFinalAux = 0;
                for(let i=lines.length-2; i >= 0; i--)
                {   
                    if(lines[i][lines[i].length-1] && line[lines[i].length-1].trim() != "")
                        resultFinalAux += Number(lines[i][lines[i].length-1]);
                }
                
                if(resultFinal && 
                    resultFinal >= 0 &&
                    restoFinal &&
                    resultFinal == resultFinalAux &&
                    $scope.operationValues.cocienteResultx != 0 &&
                    Number(resultFinal) == $scope.operationValues.cocienteResult &&
                    Number(restoFinal) == $scope.operationValues.restoResult) 
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
    let divisoresValidList = [0, 2, 3, 4, 5, 6, 7, 8, 9];
    let dividendoNumElements = 3;
    let numElementsDivisor = 1; // Número de elemento divisor
    // ==============================

    $scope.operationValues = getOperationValue(dividendoNumElements, divisoresValidList, numElementsDivisor, true);

    $scope.numLines = 5;

    $scope.result = { line: []};
    
    for(let i= 0; i < $scope.numLines; i++)
    {   $scope.result.line[i] = [];
        let numColums = 3;
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
                $scope.operationToPrint.push($scope.operationValues.operator);
            }
        }
    }
});
