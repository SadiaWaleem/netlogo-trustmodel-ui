import axios from 'axios';

function getReports() {
  return axios.get(`http://localhost:8080/workspace/reports`)
    .then(function (response) {
      console.log('reports', response.data);
      return response.data;
    })
    .catch(error => {
      console.log(error.response)
    });
}

function getView() {
  return axios.get(`http://localhost:8080/workspace/view`)
    .then(function (response) {
      console.log('view', response.data);
      return response.data;
    })
    .catch(error => {
      console.log(error.response)
    });
}

function getPlots() {
  return axios.get(`http://localhost:8080/workspace/plots`)
    .then(function (response) {
      console.log('plots', response.data);
      return response.data;
    })
    .catch(error => {
      console.log(error.response)
    });
}

function formatPlots() {
  return Promise.resolve(
    getPlots()
  ).then((plots) => {
    let formattedPlots = [];
    let i;

    for (i = 0; i < plots.length; i++) {
      const pens = plots[i].pens;
      let formattedDataset = [];
      let j;
      for (j = 0; j < pens.length; j++) {
        const points = pens[j].points;
        formattedDataset.push(
          {
            label: pens[j].name,
            fill: false,
            showLine: true,
            lineTension: 0.1,
            backgroundColor: pens[j].color,
            borderColor: pens[j].color,
            borderCapStyle: 'butt',
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: pens[j].color,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: pens[j].color,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: points
          }
        )
      }

      formattedPlots.push({
        formattedData: {
          datasets: formattedDataset
        },

        options: {
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                beginAtZero: false,
                min: plots[i].xMin,
                max: plots[i].xMax
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: false,
                min: plots[i].yMin,
                max: plots[i].yMax
              }
            }]
          },
          legend: {
            display: plots[i].legendShown
          },
          title: {
            display: true,
            text: plots[i].name
          }
        }
      })
    }
    return formattedPlots
  })
}

export function getInitialData() {
  return Promise.resolve(
    axios.post(`http://localhost:8080/trust-model/setup`)
  ).then(() => {
      return Promise.all([
        getReports(),
        getView(),
        formatPlots()
      ]).then(([reports, view, plots]) => ({reports, view, plots}));
    })
    .catch(error => {
      console.log(error.response)
    });
}

export function getData() {
  return Promise.all([
    getReports(),
    getView(),
    formatPlots()
  ]).then(([reports, view, plots]) => ({reports, view, plots}));
}