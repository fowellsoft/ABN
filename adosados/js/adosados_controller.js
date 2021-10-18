var app = angular.module('adosadosApp', []);
app.controller('adosadosCtrl', function($scope, $window) 
{
    $scope.windowWidth = $window.innerWidth;
    $scope.minLgWith = 700;
    $scope.numMaxAdosado = 999;
    $scope.sumaActivated = true;
    let numRows = 5;

    let updateSuma = ((p) => {



    });

    $scope.printSuma = ((a) => {

        let sSumaValue = "";
        let sumaValue = 0;
        if($scope.matrizAdosados[a].valores)
        {
            for(let i=0; i < $scope.matrizAdosados[a].valores.length; i++)
            {
                let v = 0;
                if($scope.matrizAdosados[a].valores[i].valor != "")
                    v = Number($scope.matrizAdosados[a].valores[i].valor)
                
                let aux = 1;
                for(u = $scope.matrizAdosados[a].valores.length-1-i; u > 0; u--)
                {  aux *= 10; }

                v *= aux;

                sumaValue += v;
                sSumaValue += v;
                if(i < $scope.matrizAdosados[a].valores.length-1)
                    sSumaValue += " + "; 
            }

            sSumaValue += " = " + sumaValue; 
        }

        return sSumaValue;
    });
    
    $scope.i = 0;
    $scope.j = 0;
    $scope.insertValue = ((value) =>
    {
        let textAux = $scope.matrizAdosados[$scope.i].valores[$scope.j].valor;
        if(value == "B")
        {
            if(textAux && textAux.length > 0)
            {
                textAux = textAux.substring(0, textAux.length-1);
                $scope.matrizAdosados[$scope.i].valores[$scope.j].valor = textAux;
            }
        }
        else
            $scope.matrizAdosados[$scope.i].valores[$scope.j].valor += value;
        
        // Resetea el error al cambiar algún dato
        if($scope.matrizAdosados[$scope.i].withError)
            $scope.matrizAdosados[$scope.i].withError = false;

        updateSuma(i);
    });

    $scope.selectField = ((i, j, type) =>
    {
        if(!type &&
           $scope.matrizAdosados && 
           $scope.matrizAdosados[i] &&
           $scope.matrizAdosados[i].valores &&
           $scope.matrizAdosados[i].valores[j] &&
           $scope.matrizAdosados[i].valores[j].editable)
        {
            $scope.i = i;
            $scope.j = j;
        }
        else
        {
            // Si hay tipo es la suma

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
        return($scope.matrizAdosados && i < $scope.matrizAdosados.length &&
               $scope.matrizAdosados[i] && j < $scope.matrizAdosados[i].valores.length &&
               $scope.matrizAdosados[i].valores[j].editable &&
               $scope.matrizAdosados[i].valores[j].withError)
    });

    $scope.matrizAdosados = [];
    $scope.matrizSuma = [];
    
    // Para determinar el número de columnas calcula el número elementos del número
    // Lo convierte a string y mira su tamaño
    let numAdosadoAsString = $scope.numMaxAdosado.toString();

    // Construye la matriz con el número de filas que queremos que tenga
    for(let i=0; i < numRows; i++)
    {
        $scope.matrizAdosados[i] = { valores: [] };
        $scope.matrizSuma[i] = [];


        for(let j=0; j < numAdosadoAsString.length; j++)
        {
            $scope.matrizAdosados[i].valores[j] = { valor: "",
                                                    editable: true };
        }
    }

    const SISTEMA_DECIMAL = ["U", "D", "C", "M"];
    $scope.cabeceraAdosados = [];

    // Determina el número menor y el mayor en función del tamaño del tamaño del número
    let minValue = 1;
    let maxValue = 9;

    for(let i=0; i < numAdosadoAsString.length; i++)
    {
        $scope.cabeceraAdosados[i] = SISTEMA_DECIMAL[numAdosadoAsString.length-1-i];

        if(i < numAdosadoAsString.length-1)
        {
            minValue = minValue * 10;
            maxValue = ((maxValue * 10) + 9);
        }
    }
    
    let randomIntFromInterval = ((min, max) =>
    { 	// min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    });

    $scope.num2Adosado = randomIntFromInterval(minValue, maxValue);
    $scope.num2AdosadoList = Array.from($scope.num2Adosado.toString());

    $scope.validaResultados = (() => {

        $scope.resultadoOperaciones = { someoneWithError: false,
                                        finalMessage: ""
                                      };

        // Para cada una de las filas realiza la suma 
        for(let i=0; i < $scope.matrizAdosados.length; i++)
        {
            let sumandosList = $scope.matrizAdosados[i].valores;
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

                if(total == $scope.num2Adosado)
                {   showError = false; }
                else
                {   
                    $scope.resultadoOperaciones.someoneWithError = true;
                    $scope.resultadoOperaciones.finalMessage = "Revisa las operaciones..."
                }
            }
            else
            {
                $scope.matrizAdosados[i].withError = true;

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


    let autocompleta = (() => {


        let generateAdosados = (() => {

            let propuesta = [];
            // Pendiente
            let numPendiente = 0;
            for(let j=0; j < $scope.num2AdosadoList.length; j++)
            {
                let numAux = (numPendiente*10) + Number($scope.num2AdosadoList[j]);

                if(j < $scope.num2AdosadoList.length-1)
                {
                    // Calcula el número aleatorio
                    let numElem = (randomIntFromInterval(0, numPendiente)*10) +
                                  randomIntFromInterval(0, Number($scope.num2AdosadoList[j]));
                    numPendiente = numAux - numElem;
                    propuesta[j] = numElem.toString();
                }
                else
                {
                    propuesta[j] = numAux.toString();
                }
                       
            }

            return propuesta;
        });

        let exisist = ((propuesta) => {

            let encontrado = false;

            // Comprueba si la propuesta ya existe
            if($scope.matrizAdosados &&
               $scope.matrizAdosados.find(e => {
               
                encontrado = true;
                for(j=0; j < e.valores.length; j++)
                {   
                    if(e.valores[j].valor != propuesta[j])
                        encontrado = false;
                }
            }));

            return encontrado;
        });

        // Para cada una de las filas para las que aportar una descomposicion
        for(let i=0; i < $scope.matrizAdosados.length; i++)
        {
            let propuesta = null;
            
            do
            {
                propuesta = generateAdosados();
            }
            while(exisist(propuesta))
            
            for(j=0; j < $scope.matrizAdosados[i].valores.length; j++)
            {
                $scope.matrizAdosados[i].valores[j].valor = propuesta[j].toString();
                $scope.matrizAdosados[i].valores[j].editable = false;
            }
        }

        // Para cada una de las filas para las que aportar una descomposicion
        for(let i=0; i < $scope.matrizAdosados.length; i++)
        {
            let p2Remove = randomIntFromInterval(0, $scope.matrizAdosados[i].valores.length-1);
            $scope.matrizAdosados[i].valores[p2Remove].valor = '';
            $scope.matrizAdosados[i].valores[p2Remove].editable = true;
        }
    });
    autocompleta();
});