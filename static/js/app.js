// Get the Samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise:", dataPromise);

// Fetch the JSON Data
d3.json(url).then(function (data) {
    console.log(data)
});

//Create the function using sample data and after that use d3.json with url
//Create variable called metadata and call the data
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        let array1 = metadata.filter(sampleObject => sampleObject.id == sample);
        let result = array1[0];
        // Use d3 to select the panel with id of `#sample-metadata
        let panel = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        panel.html("");
        // Use d3 to append new tags for each key-value in the metadata.
        for (key in result) {
            panel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`)
        }
    });
}

function buildChart(x) {
    d3.json(url).then(function (data) {
        let samples = data.samples;
        let array1 = samples.filter(sampleObject => sampleObject.id == x);
        let result = array1[0];
        console.log(result);
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sampleValues = result.sample_values;
        console.log(sampleValues);
        let sortedSampleValues = sampleValues.sort((a, b) => b.sampleValues - a.sampleValues);
        let slicedSampleValues = sortedSampleValues.slice(0, 10);
        function buildChart () {
            let trace1 = {
                x: slicedSampleValues,
                y: otu_ids,
                text: otu_labels,
                type: 'bar',
                orientation: 'h'
            };
            let data = [trace1];
            let layout = {
                title: 'Sample Values Bar Chart',
                margin: {
                    l: 100,
                    r: -50,
                    t: 50,
                    b: 100
                }
            }
            Plotly.newPlot("bar", data, layout);

            let trace2 = {
                x: otu_ids,
                y: sampleValues,
                text: otu_labels,
                type: 'bubble',
                mode: 'markers'
            };
            let data2 = [trace2];
            let layout2 = {
                title: 'Sample Values Bubble Chart',
                margin: {
                    l: 100,
                    r: -10,
                    t: 100,
                    b: 100
                }
            }
            Plotly.newPlot("bubble", data2, layout2);
        }    
        buildChart();
});
}

function optionChanged(params) {
    buildMetadata(params);
    buildChart(params);
}

function init() {
    let dropDown = d3.select("#selDataset");
    d3.json(url).then(function (data) {
        let names = data.names;
        for (let i = 0; i < names.length; i++) {
            dropDown.append("option").text(names[i]).property("value", names[i]);
        }
        buildMetadata(names[0]);
        buildChart(names[0]);
    });
}
init();