
angular.module('ABNApp', [])
.controller('mainCtrl', function($scope){
    
    $scope.loadAmigos()
    {
        $state.go('amigos', {});
    }

    $scope.loadRejilla()
    {
        $state.go('rejilla', {});
    }

    $scope.loadAdosados()
    {
        $state.go('adosados', {});
    }
});