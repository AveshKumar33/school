import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import palette from "../theme/palette";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Our Growth",
      font: {
        size: 20,
      },
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const actualData = [
  200, 300, 450, 600, 800, 674, 896, 700, 850, 650, 800, 660, 874, 906,
];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: "This Year",
      data: actualData,
      backgroundColor: palette.info.main,
      borderColor: "rgb(53, 162, 235)",
    },
  ],
};
