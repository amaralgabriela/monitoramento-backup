
  (function ($) {
    //while(true){
      var header = ["Horário","Nome","Caminho","Status de Transferência"];
      var table;
      var vectorOfIps = ['172.16.95.200', '172.16.95.201'];
      var vectorSize = vectorOfIps.length;
      
      createTable();
      var xhr_1 = new XMLHttpRequest();
      var xhr_2 = new XMLHttpRequest();
      
      callAPIforMultipleIps();

      setInterval(function(){ 
        callAPIforMultipleIps(); 
      }, 1000);

      

      function callAPIforMultipleIps(){
        ip = vectorOfIps[0];
        console.log(ip);
        xhr_1.open('GET', "http://"+ip+":5000/api/getStatus/", true);
        xhr_1.send();

        xhr_1.addEventListener("readystatechange", processRequest_1, false);

        xhr_1.onreadystatechange = processRequest_1;

        ip = vectorOfIps[1];
        xhr_2.open('GET', "http://"+ip+":5000/api/getStatus/", true);
         xhr_2.send();

         xhr_2.addEventListener("readystatechange", processRequest_2, false);

         xhr_2.onreadystatechange = processRequest_2;
        
      }

      function processRequest_1(e) {
        if (xhr_1.readyState == 4 && xhr_1.status == 200) {
          var response = JSON.parse(xhr_1.responseText);
          if(response.status_transfer != null && response.status_transfer != undefined){
            populateTable(response);
          } 
        }
      }
      function processRequest_2(e) {
        if (xhr_2.readyState == 4 && xhr_2.status == 200) {
          var response = JSON.parse(xhr_2.responseText);
          if(response.status_transfer != null && response.status_transfer != undefined){
            populateTable(response);
          } 
        }
      }

      // Cria a tabela com o header
      function createTable(){
        table = $("<table />");

        // table table-borderless table-data3
        var columns = header; // gives ["init_time","name","path","status_transfer"]
        var columnCount = columns.length;
        var row = $(table[0].insertRow(-1));
        /*var theadElement = $("<thead />");
        row.append(theadElement);*/
        for (var i = 0; i < columnCount; i++) { 
          var headerCell = $("<th />");
          headerCell.html([columns[i]]);
          row.append(headerCell);   
        }
      }

      // Cria as linhas da tabela com os dados
      function populateTable(tabData) {
        var colTime = tabData.init_time;
        var colName = tabData.name;
        var colPath = tabData.path;
        var colStatus = tabData.status_transfer;


        if(colStatus == 100){
          colStatus = "Sucesso";
        } else if(colStatus == -1){
          colStatus = "Backup corrompido";
        } else if(colStatus == -2){
          colStatus = "Arquivo de hash não foi encontrado";
        } else{
          colStatus = colStatus.toString();
        }

        var rowCount = table[0].rows.length;

        // Adiciona ou atualiza os dados da tabela
        if(rowCount == 1){
          row = $(table[0].insertRow(-1));
          var cell = $("<td />");
          cell.html(colTime);
          row.append(cell);
          var cell = $("<td />");
          cell.html(colName);
          row.append(cell);
          var cell = $("<td />");
          cell.html(colPath);
          row.append(cell);
          var cell = $("<td />");
          cell.html(colStatus);
          row.append(cell);
        } else{
          var i;
          for(i=rowCount-1; i>=1; i--){
            var statusStr = table[0].rows[i].cells[3].innerText;
            if(colName.localeCompare(table[0].rows[i].cells[1].innerText) == 0){ // nome é igual
              if(colStatus != statusStr){ // status é diferente
                  table[0].rows[i].cells[3].innerHTML  = colStatus;
                  table[0].rows[i].cells[3].innerText = colStatus;
                  }
              i = -1;
            } 

          }
          if(i == 0){
            row = $(table[0].insertRow(-1));
            var cell = $("<td />");
            cell.html(colTime);
            row.append(cell);
            var cell = $("<td />");
            cell.html(colName);
            row.append(cell);
            var cell = $("<td />");
            cell.html(colPath);
            row.append(cell);
            var cell = $("<td />");
            cell.html(colStatus);
            row.append(cell);
          }

        }

        var dvTable = $("#dvCSV");
        dvTable.html("");
        dvTable.append(table);

        var tableElement = document.getElementsByTagName('table');
        var tableElement2 = tableElement[0];
        tableElement2.classList.add("table");
        tableElement2.classList.add("table-borderless");
        tableElement2.classList.add("table-data3");
      }

      var addValuesToDoughChart =  function(){
        var progressDone;
        var progressDoing;
        var progressValue;

        var table_aux = $( ".table-data3" );
        var table_aux2 = table_aux[0];

        if (table_aux2 == undefined){
          return [0,1];
        }

        for (var i = 1; i < table_aux2.rows.length; i++){
          progressValue = table_aux2.rows[i].cells[3].innerHTML;

          if  (progressValue == "Sucesso"){
            progressDone++;
          }else{
            progressDoing++;
          }
        }
        return [progressDone, progressDoing];
      }

var addValuesToDoughChart =  function(){
        var progressDone = 0;
        var progressDoing = 0;
        var progressValue = 0;

        var table_aux = $( ".table-data3" );
        var table_aux2 = table_aux[0];

        if (table_aux2 == undefined){
          return [0,1];
        }

        for (var i = 1; i < table_aux2.rows.length; i++){
          progressValue = table_aux2.rows[i].cells[3].innerHTML;

          if  (progressValue == "Sucesso"){
            progressDone++;
          }else{
            progressDoing++;
          }
        }
        return [progressDone, progressDoing];
      }

      var addValuesToPieChart =  function(){
        var statSuccess = 0;
        var statError = 0;
        var statTnProgress = 0;

        var table_aux = $( ".table-data3" );
        var table_aux2 = table_aux[0];

        if (table_aux2 == undefined){
          return [1,0,0];
        }

        for (var i = 1; i < table_aux2.rows.length; i++){
          statusValue = table_aux2.rows[i].cells[3].innerHTML;

          if  (statusValue == "Sucesso"){
            statSuccess++;
          }else if (statusValue == "Backup corrompido" || statusValue == "Arquivo de hash não foi encontrado"){
            statError++;
          }else{
            statTnProgress++;
          }
        }
        return [statSuccess, statError, statTnProgress];
      }



    // USE STRICT
    "use strict";

    /*try {

      // Percent Chart 2
      var ctx = document.getElementById("percent-chart2");
      if (ctx) {
        ctx.height = 209;
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [
            {
              label: "My First dataset",
              data: [60, 40],
              backgroundColor: [
              '#00b5e9',
              '#fa4251'
              ],
              hoverBackgroundColor: [
              '#00b5e9',
              '#fa4251'
              ],
              borderWidth: [
              0, 0
              ],
              hoverBorderColor: [
              'transparent',
              'transparent'
              ]
            }
            ],
            labels: [
            'Products',
            'Services'
            ]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 87,
            animation: {
              animateScale: true,
              animateRotate: true
            },
            legend: {
              display: false,
              position: 'bottom',
              labels: {
                fontSize: 14,
                fontFamily: "Poppins,sans-serif"
              }

            },
            tooltips: {
              titleFontFamily: "Poppins",
              xPadding: 15,
              yPadding: 10,
              caretPadding: 0,
              bodyFontSize: 16,
            }
          }
        });
      }

    } catch (error) {
      console.log(error);
    }*/

    try {
      //Sales chart
      var ctx = document.getElementById("sales-chart");
      if (ctx) {
        ctx.height = 150;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
            type: 'line',
            defaultFontFamily: 'Poppins',
            datasets: [{
              label: "Foods",
              data: [0, 30, 10, 120, 50, 63, 10],
              backgroundColor: 'transparent',
              borderColor: 'rgba(220,53,69,0.75)',
              borderWidth: 3,
              pointStyle: 'circle',
              pointRadius: 5,
              pointBorderColor: 'transparent',
              pointBackgroundColor: 'rgba(220,53,69,0.75)',
            }, {
              label: "Electronics",
              data: [0, 50, 40, 80, 40, 79, 120],
              backgroundColor: 'transparent',
              borderColor: 'rgba(40,167,69,0.75)',
              borderWidth: 3,
              pointStyle: 'circle',
              pointRadius: 5,
              pointBorderColor: 'transparent',
              pointBackgroundColor: 'rgba(40,167,69,0.75)',
            }]
          },
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Poppins',
              bodyFontFamily: 'Poppins',
              cornerRadius: 3,
              intersect: false,
            },
            legend: {
              display: false,
              labels: {
                usePointStyle: true,
                fontFamily: 'Poppins',
              },
            },
            scales: {
              xAxes: [{
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                scaleLabel: {
                  display: false,
                  labelString: 'Month'
                },
                ticks: {
                  fontFamily: "Poppins"
                }
              }],
              yAxes: [{
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Value',
                  fontFamily: "Poppins"

                },
                ticks: {
                  fontFamily: "Poppins"
                }
              }]
            },
            title: {
              display: false,
              text: 'Normal Legend'
            }
          }
        });
      }


    } catch (error) {
      console.log(error);
    }

    try {

      //Team chart
      var ctx = document.getElementById("team-chart");
      if (ctx) {
        ctx.height = 150;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
            type: 'line',
            defaultFontFamily: 'Poppins',
            datasets: [{
              data: [0, 7, 3, 5, 2, 10, 7],
              label: "Expense",
              backgroundColor: 'rgba(0,103,255,.15)',
              borderColor: 'rgba(0,103,255,0.5)',
              borderWidth: 3.5,
              pointStyle: 'circle',
              pointRadius: 5,
              pointBorderColor: 'transparent',
              pointBackgroundColor: 'rgba(0,103,255,0.5)',
            },]
          },
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              titleFontSize: 12,
              titleFontColor: '#000',
              bodyFontColor: '#000',
              backgroundColor: '#fff',
              titleFontFamily: 'Poppins',
              bodyFontFamily: 'Poppins',
              cornerRadius: 3,
              intersect: false,
            },
            legend: {
              display: false,
              position: 'top',
              labels: {
                usePointStyle: true,
                fontFamily: 'Poppins',
              },


            },
            scales: {
              xAxes: [{
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                scaleLabel: {
                  display: false,
                  labelString: 'Month'
                },
                ticks: {
                  fontFamily: "Poppins"
                }
              }],
              yAxes: [{
                display: true,
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Value',
                  fontFamily: "Poppins"
                },
                ticks: {
                  fontFamily: "Poppins"
                }
              }]
            },
            title: {
              display: false,
            }
          }
        });
      }


    } catch (error) {
      console.log(error);
    }

    try {
      //bar chart
      var ctx = document.getElementById("barChart");
      if (ctx) {
        ctx.height = 200;
        var myChart = new Chart(ctx, {
          type: 'bar',
          defaultFontFamily: 'Poppins',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
            {
              label: "My First dataset",
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: "rgba(0, 123, 255, 0.9)",
              borderWidth: "0",
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              fontFamily: "Poppins"
            },
            {
              label: "My Second dataset",
              data: [28, 48, 40, 19, 86, 27, 90],
              borderColor: "rgba(0,0,0,0.09)",
              borderWidth: "0",
              backgroundColor: "rgba(0,0,0,0.07)",
              fontFamily: "Poppins"
            }
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            scales: {
              xAxes: [{
                ticks: {
                  fontFamily: "Poppins"

                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontFamily: "Poppins"
                }
              }]
            }
          }
        });
      }


    } catch (error) {
      console.log(error);
    }

    try {

      //radar chart
      var ctx = document.getElementById("radarChart");
      if (ctx) {
        ctx.height = 200;
        var myChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: [["Eating", "Dinner"], ["Drinking", "Water"], "Sleeping", ["Designing", "Graphics"], "Coding", "Cycling", "Running"],
            defaultFontFamily: 'Poppins',
            datasets: [
            {
              label: "My First dataset",
              data: [65, 59, 66, 45, 56, 55, 40],
              borderColor: "rgba(0, 123, 255, 0.6)",
              borderWidth: "1",
              backgroundColor: "rgba(0, 123, 255, 0.4)"
            },
            {
              label: "My Second dataset",
              data: [28, 12, 40, 19, 63, 27, 87],
              borderColor: "rgba(0, 123, 255, 0.7",
              borderWidth: "1",
              backgroundColor: "rgba(0, 123, 255, 0.5)"
            }
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            scale: {
              ticks: {
                beginAtZero: true,
                fontFamily: "Poppins"
              }
            }
          }
        });
      }

    } catch (error) {
      console.log(error)
    }

    try {

      //line chart
      var ctx = document.getElementById("lineChart");
      if (ctx) {
        ctx.height = 150;
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            defaultFontFamily: "Poppins",
            datasets: [
            {
              label: "My First dataset",
              borderColor: "rgba(0,0,0,.09)",
              borderWidth: "1",
              backgroundColor: "rgba(0,0,0,.07)",
              data: [22, 44, 67, 43, 76, 45, 12]
            },
            {
              label: "My Second dataset",
              borderColor: "rgba(0, 123, 255, 0.9)",
              borderWidth: "1",
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              pointHighlightStroke: "rgba(26,179,148,1)",
              data: [16, 32, 18, 26, 42, 33, 44]
            }
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontFamily: "Poppins"

                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontFamily: "Poppins"
                }
              }]
            }

          }
        });
      }


    } catch (error) {
      console.log(error);
    }


    try {

      //doughut chart
      setInterval(function(){
      var ctx = document.getElementById("doughutChart");
      var valuesChart = addValuesToDoughChart();
      if (ctx) {
        ctx.height = 200;
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [valuesChart[0], valuesChart[1]],
              backgroundColor: [
              "rgba(12, 108, 148)",
              "rgba(41,182,197)"
              ],
              hoverBackgroundColor: [
              "rgba(12, 108, 148)",
              "rgba(41, 182, 197)"
              ]
            }],
            labels: [
              "Completos",
              "Faltantes"
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            responsive: true
          }
        });

      }
    }, 1000);


    } catch (error) {
      console.log(error);
    }


    try {

      //pie chart
      //Status de Todos os Backups 
setInterval(function(){
        var ctx = document.getElementById("pieChart");
        var valuesChart = addValuesToPieChart();
        if (ctx) {
          ctx.height = 200;
          var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
              datasets: [{
                data: [valuesChart[0],valuesChart[2],valuesChart[1]],
                backgroundColor: [
                "rgba(0, 178, 142)",
                "rgba(234, 155, 62)",
                "rgba(198, 72, 64)",
                ],
                hoverBackgroundColor: [
                "rgba(0, 178, 142)",
                "rgba(234, 155, 62)",
                "rgba(198, 72, 64)",
                ]

              }],
              labels: [
              "Concluído",
              "Em Progresso",
              "Falhou"
              ]
            },
            options: {
              legend: {
                position: 'top',
                labels: {
                  fontFamily: 'Poppins'
                }

              },
              responsive: true
            }
          });
        }
      }, 1000);



    } catch (error) {
      console.log(error);
    }

    try {

      // polar chart
      var ctx = document.getElementById("polarChart");
      if (ctx) {
        ctx.height = 200;
        var myChart = new Chart(ctx, {
          type: 'polarArea',
          data: {
            datasets: [{
              data: [15, 18, 9, 6, 19],
              backgroundColor: [
              "rgba(0, 123, 255,0.9)",
              "rgba(0, 123, 255,0.8)",
              "rgba(0, 123, 255,0.7)",
              "rgba(0,0,0,0.2)",
              "rgba(0, 123, 255,0.5)"
              ]

            }],
            labels: [
            "Green",
            "Green",
            "Green",
            "Green"
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            responsive: true
          }
        });
      }

    } catch (error) {
      console.log(error);
    }

    try {

      // single bar chart
      var ctx = document.getElementById("singelBarChart");
      if (ctx) {
        ctx.height = 150;
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["Sun", "Mon", "Tu", "Wed", "Th", "Fri", "Sat"],
            datasets: [
            {
              label: "My First dataset",
              data: [40, 55, 75, 81, 56, 55, 40],
              borderColor: "rgba(0, 123, 255, 0.9)",
              borderWidth: "0",
              backgroundColor: "rgba(0, 123, 255, 0.5)"
            }
            ]
          },
          options: {
            legend: {
              position: 'top',
              labels: {
                fontFamily: 'Poppins'
              }

            },
            scales: {
              xAxes: [{
                ticks: {
                  fontFamily: "Poppins"

                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontFamily: "Poppins"
                }
              }]
            }
          }
        });
      }

    } catch (error) {
      console.log(error);
    }

  })(jQuery);



  (function ($) {
      // USE STRICT
      "use strict";
      $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 900,
        outDuration: 900,
        linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'page-loader',
        loadingInner: '<div class="page-loader__spin"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'html',
        transition: function (url) {
          window.location.href = url;
        }
      });


    })(jQuery);
    (function ($) {
    // USE STRICT
    "use strict";

    // Map
    try {

      var vmap = $('#vmap');
      if(vmap[0]) {
        vmap.vectorMap( {
          map: 'world_en',
          backgroundColor: null,
          color: '#ffffff',
          hoverOpacity: 0.7,
          selectedColor: '#1de9b6',
          enableZoom: true,
          showTooltip: true,
          values: sample_data,
          scaleColors: [ '#1de9b6', '#03a9f5'],
          normalizeFunction: 'polynomial'
        });
      }

    } catch (error) {
      console.log(error);
    }

    // Europe Map
    try {

      var vmap1 = $('#vmap1');
      if(vmap1[0]) {
        vmap1.vectorMap( {
          map: 'europe_en',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          enableZoom: true,
          showTooltip: true
        });
      }

    } catch (error) {
      console.log(error);
    }

    // USA Map
    try {

      var vmap2 = $('#vmap2');

      if(vmap2[0]) {
        vmap2.vectorMap( {
          map: 'usa_en',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          enableZoom: true,
          showTooltip: true,
          selectedColor: null,
          hoverColor: null,
          colors: {
            mo: '#001BFF',
            fl: '#001BFF',
            or: '#001BFF'
          },
          onRegionClick: function ( event, code, region ) {
            event.preventDefault();
          }
        });
      }

    } catch (error) {
      console.log(error);
    }

    // Germany Map
    try {

      var vmap3 = $('#vmap3');
      if(vmap3[0]) {
        vmap3.vectorMap( {
          map: 'germany_en',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          onRegionClick: function ( element, code, region ) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();

            alert( message );
          }
        });
      }
      
    } catch (error) {
      console.log(error);
    }
    
    // France Map
    try {

      var vmap4 = $('#vmap4');
      if(vmap4[0]) {
        vmap4.vectorMap( {
          map: 'france_fr',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          enableZoom: true,
          showTooltip: true
        });
      }

    } catch (error) {
      console.log(error);
    }

    // Russia Map
    try {
      var vmap5 = $('#vmap5');
      if(vmap5[0]) {
        vmap5.vectorMap( {
          map: 'russia_en',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          hoverOpacity: 0.7,
          selectedColor: '#999999',
          enableZoom: true,
          showTooltip: true,
          scaleColors: [ '#C8EEFF', '#006491' ],
          normalizeFunction: 'polynomial'
        });
      }


    } catch (error) {
      console.log(error);
    }
    
    // Brazil Map
    try {

      var vmap6 = $('#vmap6');
      if(vmap6[0]) {
        vmap6.vectorMap( {
          map: 'brazil_br',
          color: '#007BFF',
          borderColor: '#fff',
          backgroundColor: '#fff',
          onRegionClick: function ( element, code, region ) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
            alert( message );
          }
        });
      }

    } catch (error) {
      console.log(error);
    }
  })(jQuery);
  (function ($) {
    // Use Strict
    "use strict";
    try {
      var progressbarSimple = $('.js-progressbar-simple');
      progressbarSimple.each(function () {
        var that = $(this);
        var executed = false;
        $(window).on('load', function () {

          that.waypoint(function () {
            if (!executed) {
              executed = true;
              /*progress bar*/
              that.progressbar({
                update: function (current_percentage, $this) {
                  $this.find('.js-value').html(current_percentage + '%');
                }
              });
            }
          }, {
            offset: 'bottom-in-view'
          });

        });
      });
    } catch (err) {
      console.log(err);
    }
  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";

    // Scroll Bar
    try {
      var jscr1 = $('.js-scrollbar1');
      if(jscr1[0]) {
        const ps1 = new PerfectScrollbar('.js-scrollbar1');      
      }

      var jscr2 = $('.js-scrollbar2');
      if (jscr2[0]) {
        const ps2 = new PerfectScrollbar('.js-scrollbar2');

      }

    } catch (error) {
      console.log(error);
    }

  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";

    // Select 2
    try {

      $(".js-select2").each(function () {
        $(this).select2({
          minimumResultsForSearch: 20,
          dropdownParent: $(this).next('.dropDownSelect2')
        });
      });

    } catch (error) {
      console.log(error);
    }


  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";

    // Dropdown 
    try {
      var menu = $('.js-item-menu');
      var sub_menu_is_showed = -1;

      for (var i = 0; i < menu.length; i++) {
        $(menu[i]).on('click', function (e) {
          e.preventDefault();
          $('.js-right-sidebar').removeClass("show-sidebar");        
          if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
            $(this).toggleClass('show-dropdown');
            sub_menu_is_showed = -1;
          }
          else {
            for (var i = 0; i < menu.length; i++) {
              $(menu[i]).removeClass("show-dropdown");
            }
            $(this).toggleClass('show-dropdown');
            sub_menu_is_showed = jQuery.inArray(this, menu);
          }
        });
      }
      $(".js-item-menu, .js-dropdown").click(function (event) {
        event.stopPropagation();
      });

      $("body,html").on("click", function () {
        for (var i = 0; i < menu.length; i++) {
          menu[i].classList.remove("show-dropdown");
        }
        sub_menu_is_showed = -1;
      });

    } catch (error) {
      console.log(error);
    }

    var wW = $(window).width();
      // Right Sidebar
      var right_sidebar = $('.js-right-sidebar');
      var sidebar_btn = $('.js-sidebar-btn');

      sidebar_btn.on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < menu.length; i++) {
          menu[i].classList.remove("show-dropdown");
        }
        sub_menu_is_showed = -1;
        right_sidebar.toggleClass("show-sidebar");
      });

      $(".js-right-sidebar, .js-sidebar-btn").click(function (event) {
        event.stopPropagation();
      });

      $("body,html").on("click", function () {
        right_sidebar.removeClass("show-sidebar");

      });


    // Sublist Sidebar
    try {
      var arrow = $('.js-arrow');
      arrow.each(function () {
        var that = $(this);
        that.on('click', function (e) {
          e.preventDefault();
          that.find(".arrow").toggleClass("up");
          that.toggleClass("open");
          that.parent().find('.js-sub-list').slideToggle("250");
        });
      });

    } catch (error) {
      console.log(error);
    }


    try {
      // Hamburger Menu
      $('.hamburger').on('click', function () {
        $(this).toggleClass('is-active');
        $('.navbar-mobile').slideToggle('500');
      });
      $('.navbar-mobile__list li.has-dropdown > a').on('click', function () {
        var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
        $(this).toggleClass('active');
        $(dropdown).slideToggle('500');
        return false;
      });
    } catch (error) {
      console.log(error);
    }
  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";

    // Load more
    try {
      var list_load = $('.js-list-load');
      if (list_load[0]) {
        list_load.each(function () {
          var that = $(this);
          that.find('.js-load-item').hide();
          var load_btn = that.find('.js-load-btn');
          load_btn.on('click', function (e) {
            $(this).text("Loading...").delay(1500).queue(function (next) {
              $(this).hide();
              that.find(".js-load-item").fadeToggle("slow", 'swing');
            });
            e.preventDefault();
          });
        })

      }
    } catch (error) {
      console.log(error);
    }

  })(jQuery);
  (function ($) {
    // USE STRICT
    "use strict";

    try {

      $('[data-toggle="tooltip"]').tooltip();

    } catch (error) {
      console.log(error);
    }

    // Chatbox
    try {
      var inbox_wrap = $('.js-inbox');
      var message = $('.au-message__item');
      message.each(function(){
        var that = $(this);

        that.on('click', function(){
          $(this).parent().parent().parent().toggleClass('show-chat-box');
        });
      });
      

    } catch (error) {
      console.log(error);
    }

  })(jQuery);