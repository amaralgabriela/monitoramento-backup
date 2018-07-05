(function () {
  'use strict';

  angular.module('myApp')
  .controller('DirectoriesCtrl', ['$scope', '$http', function ($scope, $http) {

    // GET DOS DIRETORIOS DO SERVIDOR
    $http({
      //url: 'http://localhost:5000/',
      url: 'http://172.16.95.201:5000/api/getDirectories/',
      method: "GET"
    })
    // GET DOS DIRETORIOS SELECIONADOS PREVIAMENTE PELO USUARIO
    .then(function(response) {
      console.log(response);
      $scope.data = [response.data];
      $http({
        //url: 'http://localhost:5000/api/readFile/',
        url: 'http://172.16.95.201:5000/api/readFile/',
        dataType: 'json',
        method: 'GET',
        data: '',
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(function(response){
        if(response != "FileNotFound")
        {
          var directories = response.data;
          directories = directories.split("\n");
          for (var i = 0; i < directories.length; i++)
          {
            var parent;
            var folders = directories[i].split('\\');
            $("input[name=checkboxes]").each(function(){
              if (this.value == directories[i]){
                $(this).prop('checked', true);
              }
              if (i != 0)
              {
                var parent = ~~(this.id/10);
                if($("#" + parent + "").prop("checked") == true || $("#" + parent + "").prop("disabled") == true)
                {
                  $(this).prop('disabled', true);
                }
              }
            });
          }
        }
      });

    });

    // HABILITA E DESABILITA CHECKBOXES FILHOS DE ACORDO COM A SELEÇÃO DO CHECKBOX PAI
    $scope.updateChildren = function(id){
      var i = 1;
      var idNew = id * 10 + i;
      while ($("#"+ idNew + "").length)
      {
        $("#"+ idNew + "").prop('disabled', $("#" + id + "").prop("checked") || $("#" + id + "").prop("disabled"));
        $("#"+ idNew + "").prop('checked', false);
        $scope.updateChildren(idNew);
        i++;
        idNew = id * 10 + i;
      }
    }

    $scope.toggle = function (scope) {
      scope.toggle();
    };

    // SALVA OS DIRETORIOS SELECIONADOS EM ARQUIVO TXT NO SERVIDOR
    $scope.save = function () {
      var checkedValues = $("input[name=checkboxes]:checked").map(function() {
        return this.value;
      }).get();

      $http({
        //url: 'http://localhost:5000/api/writeFile/',
        url: 'http://172.16.95.201:5000/api/writeFile/',
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(checkedValues)
      })
      .then(function(response) {
        console.log(response);
      });


    };

  }]);

}());
