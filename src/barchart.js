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
          "2021",
        ],
      },
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"],
      },
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"],
      },
    },
  ],
  response: {
    format: "json-stat2",
  },
};

const fetchBirthsandDeaths = async (code) => {
  JSONQuery.query[2].selection.values[0] = String(code); //"vm01";

  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(JSONQuery),
  });
  const data = await res.json();
  //console.log(data);
  return data;
};
const barchartbuilder = async () => {
  //event.preventDefault();
  const births = await fetchBirthsandDeaths("vm01");
  const years = Object.values(births.dimension.Vuosi.category.label);
  console.log(years);
  console.log(births.value);
  const deaths = await fetchBirthsandDeaths("vm11");
  console.log(deaths.value);
  const newchart = {
    labels: years,
    datasets: [
      { name: "Births", type: "bar", values: births.value, color: "#63d0ff" },
      { name: "Deaths", type: "bar", values: deaths.value, color: "#363636" },
    ],
  };
  const chartbar = new Chart("#chart", {
    title: "Chart",
    data: newchart,
    type: "bar",
    height: 450,
    colors: ["#63d0ff", "#363636"],
  });
};
barchartbuilder();
