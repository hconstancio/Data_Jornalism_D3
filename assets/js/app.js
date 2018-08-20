//define margins and area for graph
var svgWidth = 1000;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, 

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
var div = d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file and execute everything below

d3.csv("assets/data/data.csv", function(err, censusData) {
    if(err) throw err;
    censusData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.percBelowPov = +data.percBelowPov;
      data.physActive = +data.physActive;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //scaling
    // variables to store the min and max values of csv file
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(censusData, function(data) {
        return +data.percBelowPov * 0.85;
    });

    xMax = d3.max(censusData, function(data) {
        return +data.percBelowPov * 1;
    });

    yMin = d3.min(censusData, function(data) {
        return +data.physActive * 0.85;
    });

    yMax = d3.max(censusData, function(data) {
        return +data.physActive * 1;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    var state_text = "State: "
    var pov_perc = "In Poverty(%): "
    var active_perc = "Physically Active(%): "
    
    // create chart
    chart.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.percBelowPov);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.physActive);
        })
        .attr("r", 12)
        .attr("fill", "#0066cc")
        // display tooltip on click
        .on("mouseover", function (data) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.percBelowPov + "<text>%</text>" + "<br/>" + active_perc.bold() + data.physActive + "<text>%</text>")
                .style("left", (d3.event.pageX)+ 10 + "px")
                .style("top", (d3.event.pageY - 0) + "px");
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            div.transition()
                .duration(500)
                .style("opacity",0);
        });

    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.percBelowPov - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.physActive - 0.1);
            })
            .text(function(data) {
                return data.abbr
                });

    // Append an SVG group for the xaxis, then display x-axis 
    chart
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);

    chart
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Physically Active (%)");
  
    // Append x-axis labels
    chart
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");
});