function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(metadata => {

    // Use d3 to select the panel with id of `#sample-metadata`

    var panel = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
     panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

      Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p")
           .html(`<b>${key}</b>: ${value}`);
    })

      // BONUS: Build the Gauge Chart
    buildGauge(metadata.WFREQ);
  });
}

function buildGauge(wfreq) {

  // Enter a speed between 0 and 180
  var level = wfreq * 20;

  // Trig to calc meter point
  var degrees = 180 - level,
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ 
    type: 'scatter',
    x: [0], 
    y:[0],
    marker: {
      size: 28, 
      color:'850000'
      },
    showlegend: false,
    text: level / 20,
    hoverinfo: 'text'}, { 
    values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 90],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {
      colors:['rgba(133, 180, 138, .5)', 'rgba(138, 187, 143, .5)',
              'rgba(140, 191, 136, .5)', 'rgba(183, 204, 146, .5)',
              'rgba(213, 228, 157, .5)', 'rgba(229, 231, 179, .5)', 
              'rgba(233, 230, 202, .5)', 'rgba(244, 241, 229, .5)',
              'rgba(248, 243, 236, .5)','rgba(255, 255, 255, 0)']
            },
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Belly Button Washing Frequency</b><br>Scrubs Per Week',
    height: 500,
    width: 650,
    margin: {
      l: 0,
      r: 0
    },
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot("gauge", data, layout);
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log("buid charts function");
    var pieChartData = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: "pie"
    }];

    var pieChartLayout = {
      height: 500,
      width: 450,
      margin: {
        l: 0,
        t: 0,
        r: 0 //commenting r 
      }
    }

    Plotly.newPlot("pie", pieChartData, pieChartLayout);

        // @TODO: Build a Bubble Chart using the sample data
      var bubbleChartData = [{
          x: data.otu_ids,
          y: data.sample_values,
          marker: {
            size: data.sample_values,
            color: data.otu_ids,
            colorscale: "Earth", // Added colorscale
          },
          text: data.otu_labels,
          mode: "markers"
        }];
    
        var bubbleChartLayout = {
          margin: {
            t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' }
        }
    
        Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

  });
}

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
    console.log("init function");
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
