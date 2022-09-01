import { Chart, ChartItem, registerables } from 'chart.js';
import IGameWord from '../../types/IGameWord';
import CustomElement from '../../utils/customElement';

Chart.register(...registerables);

function drawChart(gameWords: IGameWord[], diagramChart: CustomElement<'canvas'>) {
  const correctAnswers = gameWords.filter((word) => word.guess).length;
  const wrongAnswers = gameWords.filter((word) => word.guess !== null && !word.guess).length;
  let inRow = 0;
  let repeat = 0;
  gameWords.forEach((word) => {
    if (word.guess) repeat += 1;
    else {
      if (repeat > inRow) inRow = repeat;
      repeat = 0;
    }
  });
  if (repeat > inRow) inRow = repeat;

  const ctx = diagramChart.element as ChartItem;
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ошибки', 'Правильно отвечено', 'Серия правильных ответов подряд'],
      datasets: [
        {
          label: 'Sprint results',
          data: [wrongAnswers, correctAnswers, inRow],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
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
              size: 15,
            },
          },
        },
      },
    },
  });
  return myChart;
}

export default drawChart;
