"use client";
import "./globals.css"
import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts/highstock'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}


function Home() {
  const [csvData, setCsvData] = useState([]);
  const [options, setOptions] = useState({});
  const [regions, setRegions] = useState([]);
  const [searchTable, setSearchTable] = useState([]); //input
  const [indexSearch, setIndexSearch] = useState(false);
  const [regionSelected, setRegionSelected] = useState("");
  //
  const [yLineDate, setYLineDate] = useState([]);
  const [entryData, setEntryData] = useState([]);
  const [number, setNumber] = useState(null); // selection

  //const dataTable = [];
  useEffect(() => {
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

    getDataTable();

  }, []);


  // console.log(yLineDate)

  useEffect(() => {
    if (csvData.length) {
      const yLineD = csvData[0];//dates and times 
      yLineD.shift()
      setYLineDate(yLineD);

      let eachEntry = [];
      let regionsArray = [];

      for (let i = 1; i < csvData.length; i++) {
        let table = csvData;
        let colTitle = table[i].shift();
        let obj = {
          name: colTitle,
          data: table[i].map(str => parseFloat(str)),
        }
        // console.log(table[i])
        eachEntry.push(obj)
        regionsArray.push(colTitle)
      }

      setRegions(regionsArray)
      setEntryData(eachEntry);


    }
  }, [csvData])


  //console.log(entryData)

  useEffect(() => {




    if (regionSelected !== "") {
      for (let index = 0; index < entryData.length; index++) {
        // console.log(index)
        if (entryData[index].name === regionSelected) { setNumber(index) }
      }
    }
    console.log(number)
    const options = {
      //data
      series: (number == null) ? entryData : entryData[number]
      ,

      chart: {
        zoomType: 'xy'
      },
      accessibility: {
        keyboardNavigation: {
          enabled: true, // Enable keyboard navigation
        },
      },

      title: {
        text: 'Line Chart',
        align: 'left'
      },
      subtitle: {
        text: 'Zoom out or Zoom in',
        align: 'left'
      },

      yAxis: {
        title: {
          text: ''
        },
        // min: 0,  // Set the initial minimum value of the x-axis
        // max: 1,
        // tickInterval: 10,
      },
      xAxis: {
        min: 0,  // Set the initial minimum value of the x-axis
        max: 50,
        scrollbar: {
          enabled: true, // Enable horizontal scrolling
          showFull: false, // Show only the visible range on scrollbar
          scrollPositionX: 1,
        },
        categories: yLineDate,
        accessibility: {
          rangeDescription: 'Range',

        },
        labels: {
          rotation: 70, // Rotate x-axis labels by 90 degrees

        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        padding: 15,
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          // pointStart: 0
        }
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      },

    }
    setOptions(options)
  }, [entryData, regionSelected, number, yLineDate])





  const handleRegionClick = (search, region) => {
    setIndexSearch(search)
    setRegionSelected(region);
    console.log(region)
    // You can do further processing with the index here
  };

  const clear = () => {
    setSearchTable(''); // Clear the search input
    setIndexSearch(false); // Clear the index search
    setNumber(null);
    setRegionSelected('');
  }

  return (

    <div className='mx-10 mt-32'>

      <div className='btns my-10 relative ml-44'>
        {/*******  search container *******/}

        <div className="flex  w-96   m-1">

          <input
            className="border py-2 px-5 mb-2  w-full rounded-l"
            type="text"
            placeholder="Search region"
            value={searchTable}
            onChange={(event) => setSearchTable(event.target.value.toUpperCase())} //change
          />
          {/* {regions.map(x => //change
            <div>{x}</div>)} */}
          <button
            className="bg-gray-300   rounded-r mb-2 w-20"
            onClick={() => clear()}
          >
            Clear
          </button>

        </div>

        {/*******  items container *******/}
        <div className="  h-60 w-96 overflow-scroll flex flex-col border p-5  cursor-pointer rounded-md ">
          {regions
            .filter(region => region.includes(searchTable))
            .map((region, index) => (

              <div key={index} className={`py-2 px-4 ${index === indexSearch ? 'bg-gray-300' : ''}`}
                onClick={() => handleRegionClick(index, region)}
              >
                {region}
              </div>
            ))}





        </div>
      </div>


      <div className=" px-0 cursor-pointer" >
        <HighchartsReact
          containerProps={{ style: { height: "800px", margin: "150px", with: "100%" } }}
          highcharts={Highcharts}
          //  constructorType={'stockChart'}
          options={options}
        />
      </div>

    </div >
  )
}


export default Home;


