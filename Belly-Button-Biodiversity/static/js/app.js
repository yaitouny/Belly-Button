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
        title: "Bubble Chart Hover Text",
      };

      Plotly.newPlot("bubble", data, layout);
    },
  });
}

// function gaugeChart(id) {
//   $.ajax({
//     type: "GET",
//     url: "../data/samples.json",
//     contentType: "application/json;charset=UTF-8",
//     success: function (data) {
//       let sampleData = data["samples"].filter((d) => d.id == id)[0];

//       var data = [
//         {
//           domain: { x: sampleData["otu_ids"], y: sampleData["sample_values"] },
//           title: { text: "Scrubs Per Week" },
//           type: "indicator",
//           mode: "gauge+number",
//         },
//       ];

//       var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
//       Plotly.newPlot("gauge", data, layout);
//     },
//   });
// }

function optionChanged(id) {
  loadMetaData(id);
  barPlot(id);
  bubbleChart(id);
  gaugeChart(id);
}
