import { Chart } from "frappe-charts";

const JSONQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(JSONQuery)
  });
  const data = await res.json();
  return data;
};

const chartData = async () => {
  const data = await getData();
  //console.log(Object.keys(data.dimension.Vuosi.category.label));
  const label_array = Object.values(data.dimension.Vuosi.category.label);
  const popuplation = data.value;
  //console.log(data.value);
  //console.log(label_array);
  const chartdata = {
    labels: label_array,
    datasets: [{ name: "Data", type: "line", values: popuplation }]
  };

  const chart = new Chart("#chart", {
    title: "Chart",
    data: chartdata,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};
chartData();

const municipalitydata = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "GET",
    headers: { "content-type": "application/json" }
  });
  const data = await res.json();
  //console.log(data.variables[1].values);
  return data;
};
const fetchnewpopulation = async (areacode) => {
  JSONQuery.query[1].selection.values[0] = String(areacode);
  console.log(JSONQuery);
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(JSONQuery)
  });
  const data = await res.json();
  console.log(data);
  return data;
};
//municipalitydata();
document.getElementById("submit-data").onclick = async function (event) {
  event.preventDefault();
  const municipalitycodes = await municipalitydata();
  const codes = municipalitycodes.variables[1].values;
  //console.log(codes);
  //const editarray = JSONQuery.query[1].selection.values;

  //for (let i = 1; i < codes.length; i++) {
  //  editarray.push(codes[i]);
  //}
  //console.log(JSONQuery);
  const input_code = document.getElementById("input-area").value;
  const correctcode =
    input_code.substring(0, 2).toUpperCase() + input_code.substring(2);
  console.log(correctcode);
  const municipalitypopdata = await fetchnewpopulation(correctcode);
  const years = Object.values(
    municipalitypopdata.dimension.Vuosi.category.label
  );
  const municipalitypop = municipalitypopdata.value;
  console.log(municipalitypop);
  //console.log(Object.values(municipalitypopdata));
  const newchart = {
    labels: years,
    datasets: [{ name: "Data", type: "line", values: municipalitypop }]
  };
  const chart = new Chart("#chart", {
    title: "Chart",
    data: newchart,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};
//myfunction();
//const inputdata = document.getElementById("submit-data");
//const input_code = document.getElementById("input-area").value;

//inputdata.addEventListener("click", function () {
//  const input_code = document.getElementById("input-area").value;
//  console.log(input_code);
//});
