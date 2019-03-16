function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Relates to app.py
  var urlMeta = `/metadata/${sample}`;
  d3.json(urlMeta).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    // Relates to index
      var sampleMetadata = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(([key, value]) => {
      sampleMetadata.append('h6').text(`${key}, ${value}`);
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
  };

function buildCharts(sample) {

  var urlCharts = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(urlCharts).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      marker: {
        size: data.sample_values,
        color: data.sample_values,
      },
      text: data.otu_labels
    }

    var data = [trace1];

    var layout = {
      xaxis: {
        title: 'OTU ID',
      }
    };
    
    Plotly.newPlot('Bubble Chart', data, layout);
    
    // @TODO: Build a Pie Chart
    var data = data.sample_values.sort((first, second) => second - first);
    var data = data.slice(0, 10)
  
    var trace2 = {
      labels: data.otu_ids,
      values: data.sample_values,
      text: data.otu_labels,
      type: "pie"
    };
    
    var data = [trace2];
    
    Plotly.newPlot("Pie Graph", data);
  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
