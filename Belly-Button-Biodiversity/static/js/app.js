// using d3 library to read JSON file
// d3.json("../data/samples.json").then((sampleData) => {
//   console.log(sampleData);

//   var data = sampleData;
// });

// execute on page load
$(document).ready(function () {
  getData();
});

function getData() {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      console.log(data);
    },
  });
}

function getFilterID() {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      var dataName = data["names"];
      dataName.forEach(function (d) {
        $("#selDataset").append(`<option>${d}</option>`);
      });

      let initId = data["names"][0];

      optionChanged(initId);
    },
  });
}

getFilterID();

function loadMetaData(id) {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      let metaData = data["metadata"].filter((d) => d.id == id)[0];
      console.log(metaData);

      // clear data
      $("#sample-metadata").empty();

      Object.entries(metaData).forEach(function ([key, value]) {
        let info = `<p><b>${key}</b> : ${value} </p>`;
        $("#sample-metadata").append(info);
      });
    },
  });
}

// loadMetaData;

function barPlot(id) {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      let sampleData = data["samples"].filter((d) => d.id == id)[0];
      // console.log(sampleData);

      let plotData = sampleData["otu_ids"].map(function (e, i) {
        return [e, sampleData["sample_values"][i]];
      });

      var sortedData = plotData.sort(function sortFunction(a, b) {
        return b[1] - a[1];
      });

      var traces = [
        {
          x: sortedData
            .map((d) => d[1])
            .slice(0, 10)
            .reverse(),
          y: sortedData
            .map((d) => "OTU " + d[0])
            .slice(0, 10)
            .reverse(),
          type: "bar",
          orientation: "h",
        },
      ];

      var layout = {
        titles: "Top 10 OTUs found in that individual",
      };

      Plotly.newPlot("bar", traces, layout);
    },
  });
}

function bubbleChart(id) {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      let sampleData = data["samples"].filter((d) => d.id == id)[0];

      var trace1 = {
        x: sampleData["otu_ids"],
        y: sampleData["sample_values"],
        text: [
          "A<br>size: 40",
          "B<br>size: 60",
          "C<br>size: 80",
          "D<br>size: 100",
        ],
        mode: "markers",
        marker: {
          size: sampleData["sample_values"],
          color: sampleData["otu_ids"],
          colorscale: "Earth",
        },
      };

      var data = [trace1];

      var layout = {
        title: "Bubble Chart",
      };

      Plotly.newPlot("bubble", data, layout);
    },
  });
}

function gaugeChart(id) {
  $.ajax({
    type: "GET",
    url: "../data/samples.json",
    contentType: "application/json;charset=UTF-8",
    success: function (data) {
      let freqData = data["metadata"].map((d) => d.wfreq);
      console.log(freqData);
      var traceGauge = {
        type: "pie",
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81 / 9,
          81,
        ],
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgb(255,255,255",
            "rgb(247,252,245)",
            "rgb(224,243,219)",
            "rgb(199,233,192)",
            "rgb(161,217,155)",
            "rgb(116,196,118)",
            "rgb(65,171,93)",
            "rgb(35,139,69)",
            "rgb(0,109,44)",
            "white",
          ],
          labels: [
            "0-1",
            "1-2",
            "2-3",
            "3-4",
            "4-5",
            "5-6",
            "6-7",
            "7-8",
            "8-9",
          ],
          hoverinfo: "label",
        },
      };
      var data = [traceGauge];

      var layout = {
        shapes: [
          {
            type: "line",
            x0: 0.5,
            y0: 0.5,
            x1: 0.6,
            y1: 0.6,
            line: {
              color: "black",
              width: 3,
            },
          },
        ],
        title: "Chart",
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 },
      };

      Plotly.newPlot("gauge", data, layout);
    },
  });
}

function optionChanged(id) {
  loadMetaData(id);
  barPlot(id);
  bubbleChart(id);
  gaugeChart(id);
}
