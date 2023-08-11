"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
;
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
  Legend,
);


export default function Home() {
  const [csvData, setCsvData] = useState([]);


  // ------------- get the file data -------------

  async function getDataTable() {
    try {
      const response = await fetch("/telemetry_data.csv");
      const dataCSV = await response.text();
      //each row in [] splited
      const array = dataCSV.split("\n").map((item) => item.split(","));//.slice(1); 
      //put each column in an array
      const newDataArray = [];
      for (let i = 0; i < array[0].length; i++) {
        let subArray = [];
        for (let row of array) {

          subArray.push(row[i]);
        }
        newDataArray.push(subArray);
      }
      setCsvData(newDataArray)
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }

  }
  useEffect(() => {
    getDataTable();

  }, []);


  const options = {
    responsive: true,
    plugins: {
      colors: {
        enabled: true,
        forceOverride: true
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Line Chart',
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          padding: 1,
          autoSkip: false,
          fontSize: 10,
        },
      }
    }
  };


  const yLineDate = [];//title x
  let eachEntry = [];

  for (let i = 1; i < csvData.length; i++) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let table = csvData;
    let colTitle = table[i].shift();
    let obj = {
      label: colTitle,
      data: table[i],
      borderColor: "rgb(" + r + ", " + g + ", " + b + ")",
      backgroundColor: "rgb(" + r + ", " + g + ", " + b + ")",
    }
    yLineDate.push(csvData[0][i]);
    eachEntry.push(obj)
  }

  //table  data
  const data = {
    labels: yLineDate,
    datasets:
      eachEntry
    ,
  };






  return (
    <body>
      <header className="pt-3">
        <div className="font-bold text-xl px-5">Line Chart</div>
      </header>

      <main className="max-w-full  mx-10 mt-16 ">

        <div className="">
          <canvas id="chart" className="w-1 h-full cursor-pointer"></canvas>
          <Line options={options} data={data} />
        </div>

      </main>
    </body>
  )
}
