//define margins and area for graph
var svgWidth = 1000;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, 

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
var div = d3.select(".scatter").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file and execute everything below
console.log("get data...")

d3.csv("/assets/data/data.csv").then(successHandle, errorHandle)

function errorHandle(error){
    if(error) throw error;
}

function successHandle(censusData) {
    // console.log(JSON.stringify(censusData))

    censusData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
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

    xMin = d3.min(censusData.map(function(data) {
        return +data.poverty * 0.85;
    }));

    xMax = d3.max(censusData.map(function(data) {
        return +data.poverty * 1;
    }));

    yMin = d3.min(censusData.map(function(data) {
        return +data.healthcare * 0.85;
    }));

    yMax = d3.max(censusData.map(function(data) {
        return +data.healthcare* 1;
    }));

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xLinearScale(xMax));
    console.log(yLinearScale(yMin));

    var state_text = "State: "
    var pov_perc = "In Poverty(%): "
    var healthcare_perc = "Healthcare(%): "
    
    // create chart
    var circlesGroup = svg.selectAll("g circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.poverty);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.healthcare);
        })
        .attr("r", 12)
        .attr("fill", "#0066cc")
        // display tooltip on click
        // .on("mouseover", function (data) {
        //     div.transition()
        //         .duration(100)
        //         .style("opacity", .9);
        //     div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + healthcare_perc.bold() + data.healthcare + "<text>%</text>")
        //         .style("left", (d3.event.pageX)+ 10 + "px")
        //         .style("top", (d3.event.pageY - 0) + "px");
        // })
        // // hide tooltip on mouseout
        // .on("mouseout", function(data, index) {
        //     div.transition()
        //         .duration(500)
        //         .style("opacity",0);
        // });

    //     // display tooltip on click
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d){
            return ("test")
        })
    
    circlesGroup.call(toolTip)

    circlesGroup.on("mouseover", function (data) {
            toolTip.show(data.healthcare)
            // div.transition()
            //     .duration(100)
            //     .style("opacity", .9);
            // div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + healthcare_perc.bold() + data.healthcare + "<text>%</text>")
            //     .style("left", (d3.event.pageX)+ 10 + "px")
            //     .style("top", (d3.event.pageY - 0) + "px");
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data.healthcare)
        });

    svg.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.1);
            })
            .text(function(data) {
                return data.abbr
                });

    // Append an SVG group for the xaxis, then display x-axis 
    svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    svg.append("g").call(leftAxis);

    svg
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare (%)");
  
    // Append x-axis labels
    svg
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
}
