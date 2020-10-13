//1. Use d3 library to read in samples.json to work with the metadata
d3.json('samples.json').then(buttonData => {
    // window.buttonData = buttonData;
    console.log(buttonData);
});
// make a function to initialize the data
function init(){
    //select dropdown element
    var select = d3.select("#selDataset");
    //populate dropdown with ID's from sample.json's name
    d3.json('samples.json').then((data)=> {
        var ids = data.names;
        ids.forEach((id) => {
            select
            .append("option")
            .text(id)
            .property("value", id);
        });
        // build initial plots
        const initialplots = ids[0];
        charts(initialplots);
        demos(initialplots);
    });
}

// build function to populate the Demographic info using the metadata
// display each key-value pair from the metadata json
function demos(sample) {
    d3.json('samples.json').then((buttonData)=> {
        let metadata = buttonData.metadata;
        let array = metadata.filter(obj => obj.id == sample);
        let arrayResult = array[0];
        let metaPanel = d3.select("#sample-metadata");
        //clear metaPanel for each search
        metaPanel.html("");
        Object.entries(arrayResult).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}:${value}`)
        });
    });
}

// create bubble and bar chart
function charts(sample) {
    //read in data
    d3.json("samples.json").then((buttonData) => {
        let samples = buttonData.samples;
        let array = samples.filter(obj => obj.id == sample);
        let arrayResult = array[0];
        let sample_values = arrayResult.sample_values;
        let otu_ids = arrayResult.otu_ids;
        let otu_labels = arrayResult.otu_labels;
        let wfreq = buttonData.metadata.map(d => d.wfreq)
        //console.log(wfreq);
        // create bubble chart
        // setup trace
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
            size: sample_values,
            color: otu_ids,
            }
        };
        //create bubble chart layout
        let data =[trace1];
        var layout = {
            title: 'Bacteria per Sample',
            showlegend: false,
            hovermode: 'closest',
            xaxis: {title:"OTU ID " +sample},
            margin:{top:30}
        };
        //call in newPlot
        Plotly.newPlot('bubble', data, layout);
        
        //Create bar chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(ID=> `OTU ${ID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        //create bar layout
        let data2 =[trace1];
        var layout = {
            title: "Top Ten OTUs for Individual " +sample,
            margin: {
                top:100, 
                right: 100,
                left: 100,
                bottom: 100}
        };
        //call in newPlot
        Plotly.newPlot("bar", data2, layout);
        
        // gauge
        // Note to grader: for some reason I cannot get the gauge to update when selecting
        // a new ID on the dropdown. If you could leave a note on why that is that would be great
        // because I tried everything I could.
        var data3 = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: parseFloat(wfreq),
              title: { text: "Belly Button Washing Frequency Scrubs Per Week"},
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 9, increasing: {color: "green"}},
              gauge: {
                axis: { range: [0, 10] },
                steps: [
                  { range: [0, 4], color: "red" },
                  { range: [4, 7], color: "lightyellow"},
                  { range: [7, 10], color: "lightgreen"}
                ],
              }
            }
          ];
          
          var layout = { width: 500, height: 500, margin: { t: 0, b: 0 } };
          Plotly.newPlot("gauge", data3, layout);
    });
}

function optionChanged(newSample) {
    charts(newSample);
    demos(newSample);
}

//init dashboard
init();
