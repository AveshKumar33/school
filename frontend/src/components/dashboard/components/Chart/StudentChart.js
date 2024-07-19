import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import palette from "../theme/palette";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
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
      text: "Student Growth Chart",
      font: {
        size: 20,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide the x-axis grid lines\
      },
      beginAtZero: true,
    },
    y: {
      grid: {
        display: false,
      },
      beginAtZero: true, // Start the y-axis at zero
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

const actualData1 = [
  200, 300, 450, 600, 800, 674, 896, 700, 850, 650, 800, 660, 874, 906,
];
const actualData2 = [
  190, 270, 430, 500, 790, 344, 796, 700, 825, 630, 799, 635, 673, 900,
];

export const data = {
  labels: labels,
  datasets: [
    {
      label: "This Year",
      data: actualData1,
      backgroundColor: palette.primary.main,
      barThickness: 15,
      borderRadius: 10,
      barPercentage: 0.5,
    },
    {
      label: "Last Year",
      data: actualData2,
      backgroundColor: palette.common.neutral,
      barThickness: 15,
      borderRadius: 10,
      barPercentage: 0.5,
    },
  ],
};
