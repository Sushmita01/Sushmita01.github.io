// Hint: This is a good place to declare your global variables
var abortion_data;
const margin = { top:50, bottom: 50, right: 50, left: 50 };
const legendHeight = 50
const legendSquareLength = 12
const labelAxesPadding = 40

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
    
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/abortions_legal_opinion.csv')])
        .then(function (values) {
            data = values[0];

            //Wrangling the data
            abortion_data = data.map(function(d) {
            return {
                year: new Date(+d["Date"].split(" ")[0], 0, 0, 0, 0, 0, 0),
                legal_all: +d["Legal under any"],
                conditional: +d["Legal only under certain"],
                illegal_all: +d["Illegal in all"],
                no_opinion: +d["No opinion"],
            }
            });

            console.log(abortion_data);
            drawForChart();
            drawAgainstChart();
        });
});

function drawForChart() {
     // get a reference to the SVG
     var svg = d3.select('#for_svg');

     const g = svg.append('g')
     .attr('transform', 'translate('+margin.left+', '+margin.top+')');

     // get the width and height of the SVG
     const width = +svg.style('width').replace('px','');  
     const height = +svg.style('height').replace('px','');
     const innerWidth = width - margin.left - margin.right;
     const innerHeight = height - margin.top - margin.bottom;
     // set start and end dates for x axis
    const startYear = new Date(1990, 0, 0, 0, 0, 0, 0);
    const endYear = new Date(2022, 0, 0, 0, 0, 0, 0);

     // Add X axis --> it is a date format
    var x = d3.scaleTime()
    .domain([startYear, endYear])
    .range([ 0, innerWidth ]);

    g.append("g")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(x));

    let current_data = abortion_data.filter(item => item.year >= startYear);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(current_data, function(d) { return (+d.legal_all + +d.conditional); })])
        .range([ innerHeight, 10 ]);
    g.append("g")
        .call(d3.axisLeft(y));

    // adding y axis label
    g.append('text')
    .attr('y', 0)
    .attr('x', 130)
    .attr("fill", "grey")
    .attr("font-style", "italic")
    .attr('text-anchor','middle')
    .text('% who say abortion should be...')

    // Add the line
    g.append("path")
    .datum(current_data)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "green")
    .attr("d", d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(+d.legal_all + +d.conditional) })
    )

    g.append("path")
    .datum(current_data)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "darkred")
    .attr("d", d3.line()
     .curve(d3.curveMonotoneX)
     .x(function(d) { return x(d.year) })
     .y(function(d) { return y(+d.illegal_all) })
     )

    // adding y axis label
    g.append('text')
    .attr('class','axis-label')
    .attr('transform','rotate(-90)')
    .attr('y', -30)
    .attr('x', - innerHeight / 2)
    .attr('text-anchor','middle')
    .text('% votes')
    
    // adding x axis label
    g.append('text')
    .attr('class','axis-label')
    .attr('text-anchor','middle')
    .attr('x', innerWidth/2)
    .attr('y',innerHeight + labelAxesPadding)
    .text('Year')  


    let legendXAxisStart = 400;
    // Legal under any conditions
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 80)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "green");
    
    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', 80 + legendSquareLength)
    .attr('font-weight', '300')
    .text('Legal (all/most conditions)')  

    // Illegal in all
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 100)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "darkred");

    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', 100 + legendSquareLength)
    .attr('font-weight', '300')
    .text('Illegal')  

        
}

function drawAgainstChart() {
    // get a reference to the SVG
    var svg = d3.select('#against_svg')

    const g = svg.append('g')
            .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    console.log(svg)
    // get the width and height of the SVG
    const width = +svg.style('width').replace('px','');  
    const height = +svg.style('height').replace('px','');

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // set start and end dates for x axis
    const startYear = new Date(1990, 0, 0, 0, 0, 0, 0);
    const endYear = new Date(2022, 0, 0, 0, 0, 0, 0);

    // Add X axis --> it is a date format
   var x = d3.scaleTime()
   .domain([startYear, endYear])
   .range([ 0, innerWidth ]);

   g.append("g")
       .attr("transform", "translate(0," + innerHeight + ")")
       .call(d3.axisBottom(x));

    let current_data = abortion_data.filter(item => item.year >= startYear);

   // Add Y axis
   var y = d3.scaleLinear()
       .domain([0, d3.max(current_data, function(d) { return 100; })])
       .range([ innerHeight, 10 ]);
   g.append("g")
       .call(d3.axisLeft(y));


    // adding y axis label
    g.append('text')
    .attr('y', 0)
    .attr('x', 130)
    .attr("fill", "grey")
    .attr("font-style", "italic")
    .attr('text-anchor','middle')
    .text('% who say abortion should be...')

    // Add the line
   g.append("path")
   .datum(current_data)
   .attr("fill", "none")
   .attr("stroke-width", 2)
   .attr("stroke", "green")
   .attr("d", d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(+d.legal_all) })
    )

    g.append("path")
   .datum(current_data)
   .attr("fill", "none")
   .attr("stroke-width", 2)
   .attr("stroke", "orange")
   .attr("d", d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(+d.conditional) })
    )

    g.append("path")
    .datum(current_data)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "darkred")
    .attr("d", d3.line()
     .curve(d3.curveMonotoneX)
     .x(function(d) { return x(d.year) })
     .y(function(d) { return y(+d.illegal_all) })
     )

     g.append("path")
    .datum(current_data)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "lightgrey")
    .attr("d", d3.line()
     .curve(d3.curveMonotoneX)
     .x(function(d) { return x(d.year) })
     .y(function(d) { return y(+d.no_opinion) })
     )

    // adding y axis label
    g.append('text')
    .attr('class','axis-label')
    .attr('transform','rotate(-90)')
    .attr('y', -30)
    .attr('x', - innerHeight / 2)
    .attr('text-anchor','middle')
    .text('% votes')
    
    // adding x axis label
    g.append('text')
    .attr('class','axis-label')
    .attr('text-anchor','middle')
    .attr('x', innerWidth/2)
    .attr('y',innerHeight + labelAxesPadding)
    .text('Year')  
        
    let legendXAxisStart = 370;
    // Legal under any conditions
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 0)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "green");
    
    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', legendSquareLength)
    .attr('font-weight', '300')
    .text('Legal under any conditions')  

    // Legal only under certain
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 20)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "orange");

    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', 20 + legendSquareLength)
    .attr('font-weight', '300')
    .text('Legal only under certain conditions')  

    // Illegal in all
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 40)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "darkred");

    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', 40 + legendSquareLength)
    .attr('font-weight', '300')
    .text('Illegal in all conditions')  

    // No opinion
    g.append("rect")
    .attr("x", legendXAxisStart)
    .attr("y", 60)
    .attr("width", legendSquareLength)
    .attr("height", legendSquareLength)
    .style("fill", "lightgrey");

    g.append('text')
    .attr('class','legend-text')
    .attr('text-anchor','start')
    .attr('x', legendXAxisStart + legendSquareLength + 10)
    .attr('y', 60 + legendSquareLength)
    .attr('font-weight', '300')
    .text('No opinion')  

}
