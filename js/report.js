const ctx = document.getElementById("myChart");
let myChart;
let jsonData;
fetch("data.json") //this is callling the file
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    console.log(data);
    jsonData = data;
    createChart(data, "bar");
  });
function setChartType(chartType) {
  myChart.destory();
  createChart(jsonData, chartType);
}
function createChart(data, type) {
  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: data.map((row) => row.week),
      datasets: [
        {
          label: "# of Votes",
          data: data.map((row) => row.amount),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      // maintainAspectRatio: false,
    },
  });
}
