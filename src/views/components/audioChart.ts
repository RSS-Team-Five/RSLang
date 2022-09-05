import { Chart, ChartItem, registerables } from 'chart.js';
import AudioChallengeModel from '../../models/AudioChallengeModel';
import CustomElement from '../../utils/customElement';

Chart.register(...registerables);

function drawChart(model: AudioChallengeModel, diagramChart: CustomElement<'canvas'>) {
  const correctAnswers = model.gameStatistic.win.length;
  const wrongAnswers = model.gameStatistic.lose.length;
  const inRow = model.gameStatistic.winSeries;

  const ctx = diagramChart.element as ChartItem;
  Chart.defaults.color = '#224347';
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ошибки'.toUpperCase(), 'Верно'.toUpperCase(), 'Серия верных ответов'.toUpperCase()],
      datasets: [
        {
          label: 'Sprint results',
          data: [wrongAnswers, correctAnswers, inRow],
          backgroundColor: ['#d69d66', '#3c6c79', '#bab8bb'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              size: 20,
            },
            padding: 38,
          },
        },
      },
    },
  });
  return myChart;
}

export default drawChart;
