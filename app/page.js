"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function Home() {
  const [csvData, setCsvData] = useState([]);


    // ------------- get the file data -------------
    async function getData() {
      try {
        const response = await fetch("/telemetry_data.csv");
        const data = await response.text();
  
        const table = data.split("\n").slice(1);
  
  
        const dataSplit = table.map((row) => {
          const cols = row.split("\r");
          return cols
        });
  
        setCsvData(dataSplit);
  
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
      // console.log(table[1].split("\t")[0]);
    }
//console.log(csvData)


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const xLine = [65, 59, 80, 81, 56, 55, 40];

 const data = {
  labels,
  datasets: [
 
    {
      label: 'Dataset 1',
      data: [1],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};








useEffect(() => {
  getData();

}, []);




  return (
    <body>
    <header className="pt-3">
      <div className="font-bold text-xl px-5">Line Chart</div>
    </header>

    <main className="max-w-full  mx-10 mt-16 ">
  
      <div className="w-full h-full ">
      <canvas id="chart"  className="max-w-full"></canvas>
      <Line options={options} data={data} />
      </div>
     
    </main>
  </body>
  )
}
