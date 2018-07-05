(function ($) {
  
  setInterval(function(){

    var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://172.16.95.202:5000/api/getIO/", true);
  xhr.send();

  

  xhr.addEventListener("readystatechange", processRequest, false);

  xhr.onreadystatechange = processRequest;
 
    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
          console.log(response);
  		updateUsage(response);
        }
    }
  }, 1000)

  
    function updateUsage(response) {
    var consumo = response;
    document.getElementById("dvIO").innerHTML = consumo;}
  
})(jQuery);



/*(function ($) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://172.16.95.202:5000/api/getIO/", true);
  xhr.send();
  
  function callAPI(){
    xhr.addEventListener("readystatechange", processRequest, false);

    xhr.onreadystatechange = processRequest;
  }

 
  function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        updateUsage(response);
      }
    }

  function updateUsage(response) {
    var consumo = response;
    console.log(consumo);
    document.getElementById("dvIO").innerHTML = consumo;  
  }


  setInterval(function(){ 

    callAPI();    
    var ctx = document.getElementById("widgetChart4");
        if (ctx) {
          ctx.height = 115;
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Janeiro','Fevereiro','Março','Abril','Março','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              datasets: [
              {
                label: "My First dataset",
                data: [10,31,12,65,86,23,34,63,23,45,27,65,],
                borderColor: "transparent",
                borderWidth: "0",
                backgroundColor: "rgba(255,255,255,.3)"
              }
              ]
            },
            options: {
              maintainAspectRatio: true,
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  display: false,
                  categoryPercentage: 1,
                  barPercentage: 0.65
                }],
                yAxes: [{
                  display: false
                }]
              }
            }
          });
        }
    }, 1000);
})(jQuery);*/

