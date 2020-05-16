var summary;
var countryData;
var dates = [];
var confirmedCases = [];
var maxCase, minCase, chartYAxesInterval;

function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState ==  4 && this.status == 200) {
      summary=JSON.parse(this.responseText);
      console.log(summary);
      var countries = summary.Countries;
      var listContainer = document.getElementById("listContainer");

      for (i = 0; i < countries.length; i++) {
      var linkNode = document.createElement("a");
      linkNode.href="details.html?country=" + countries[i].Slug + "&countryCode=" + countries[i].CountryCode + "&totalConfirmed=" + countries[i].TotalConfirmed + "&totalRecovered=" + countries[i].TotalRecovered + "&totalDeaths=" + countries[i].TotalDeaths;
      console.log("CODE IS HERE");
      console.log(countries[i].CountryCode);
      var node = document.createElement("div");
      node.className = "countryContainer";
      var htmlContent = "";
      htmlContent = "<h4>" + countries[i].Country + " " + getFlagForCountryCode(countries[i].CountryCode) + "</h4>";
      htmlContent += "<p><b>Number of cases: </b>" + countries[i].TotalConfirmed + "</p>";
      htmlContent += "<p><b>Number of recoveries: </b>" + countries[i].TotalRecovered + "</p>";
      htmlContent += "<p><b>Number of deaths: </b>" + countries[i].TotalDeaths + "</p>";
      node.innerHTML = htmlContent;
      linkNode.appendChild(node);
      listContainer.appendChild(linkNode);
      }
    }
  };
  xhttp.open("GET", "https://api.covid19api.com/summary", true);
  xhttp.send();
}

function setChartGlobals() {
  Chart.defaults.global.elements.line.fill = false;
  Chart.defaults.global.elements.line.borderColor = 'red';
  Chart.defaults.global.elements.line.borderWidth = 1;
  Chart.defaults.global.elements.point.pointStyle = 'line';
  Chart.defaults.scale.gridLines.drawOnChartArea = false;
 }

function getFlagForCountryCode(code) {
  return code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0)+127397));
}

function fetchDataForSelectedCountry() {
  var urlParams = new URLSearchParams(window.location.search);
  const selectedCountry = urlParams.get('country');
  console.log(selectedCountry);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState ==  4 && this.status == 200) {
      var countryDataResponse = JSON.parse(this.responseText);
      countryData = countryDataResponse;
      console.log(countryData);
      getAxesData();
      renderDataOnChart();
      populateStatsBox();
    }
  };
  xhttp.open("GET", "https://api.covid19api.com/total/country/" + selectedCountry, true);
  xhttp.send();
}

function getAxesData() {
  for(i=0;i<countryData.length;i++) {
    confirmedCases.push(countryData[i].Confirmed);
    dates.push(new Date(countryData[i].Date));
  }
  console.log(confirmedCases);
  console.log(dates);
  maxCase = confirmedCases.reduce(function(a, b) {
    return Math.max(a, b);
  });

  minCase = confirmedCases.reduce(function(a, b) {
    return Math.min(a, b);
  })

  chartYAxesInterval = Math.round((maxCase + minCase)/confirmedCases.length);
  console.log(chartYAxesInterval);
}

function renderDataOnChart() {
  setChartGlobals();
  var config = {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: "Total Confirmed Cases",
        data: confirmedCases,
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
            stepSize: 7,
            displayFormats: {
              'day': 'MMM DD'
            }
          }
        }],
        yAxes: [{
          ticks: {
            min: Math.round(minCase),
            stepSize: chartYAxesInterval
        }
        }],
      },
    }
  };

  var ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, config);    
}

function populateStatsBox() {
  var urlParams = new URLSearchParams(window.location.search);
  var caseStatsContainer = document.getElementById("caseStatsContainer");

    var node1 = document.createElement("div");
    node1.className = "caseStatsBox";
    var htmlContent1 = "";
    htmlContent1 = "<b>Country:</b> " + countryData[0].Country + " " + getFlagForCountryCode(urlParams.get('countryCode'));
    node1.innerHTML = htmlContent1;

    var node2 = document.createElement("div");
    node2.className = "caseStatsBox";
    var htmlContent2 = "";
    htmlContent2 = "<b>Total Cases:</b> " + urlParams.get('totalConfirmed')
    node2.innerHTML = htmlContent2;

    var node3 = document.createElement("div");
    node3.className = "caseStatsBox";
    var htmlContent3 = "";
    htmlContent3 = "<b>Total Recoveries:</b> " + urlParams.get('totalRecovered');
    node3.innerHTML = htmlContent3;

    var node4 = document.createElement("div");
    node4.className = "caseStatsBox";
    var htmlContent4 = "";
    htmlContent4 = "<b>Total Deaths:</b> " + urlParams.get('totalDeaths');
    node4.innerHTML = htmlContent4;


    caseStatsContainer.appendChild(node1);
    caseStatsContainer.appendChild(node2);
    caseStatsContainer.appendChild(node3);
    caseStatsContainer.appendChild(node4);
  
}