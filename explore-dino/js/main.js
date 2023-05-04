var dinoData;
var svg;
var color = d3.scaleOrdinal() // D3 Version 4
  .domain(["sauropod", "large theropod", "euornithopod"])
  .range([d3.schemeSet3[2], d3.schemeSet3[11] , d3.schemeSet3[7]]);
const legendSquareLength = 12


var latlongMap = {
    Argentina1 : {
        lat: -25,
        lon: -64,
    },
    Argentina2 : {
        lat: -38,
        lon: -64,
    },
    Argentina3 : {
        lat: -35,
        lon: -78,
    },
    Argentina4 : {
        lat: -25,
        lon: -48,
    },
    Argentina5 : {
        lat: -40,
        lon: -52,
    },
    Argentina6 : {
        lat: -36,
        lon: -48,
    },
    USA1 : {
        lat: 35.58,
        lon: -103.46,
    },
    USA2 : {
        lat: 55.58,
        lon: -119.46,
    },
    USA3 : {
        lat: 50.58,
        lon: -103.46,
    },
    USA4 : {
        lat: 50.58,
        lon: -90.46,
    },
    USA5 : {
        lat: 44.58,
        lon: -90.46,
    },
    USA6 : {
        lat: 44.58,
        lon: -110.46,
    },
    USA7 : {
        lat: 50.58,
        lon: -113.46,
    },
    USA8 : {
        lat: 44.58,
        lon: -98.46,
    },
    China1 : {
        lat: 35,
        lon: 104,
    },
    China2 : {
        lat: 32,
        lon: 109,
    },
    Tanzania1 : {
        lat: -6,
        lon: 40,
    },
    Tanzania2 : {
        lat: -6,
        lon: 30,
    },
    Uruguay1 : {
        lat: -32,
        lon: -55,
    },
    Spain1 : {
        lat: 40,
        lon: -3,
    },
    "United Kingdom1" : {
        lat: 55,
        lon: -3,
    },
    "United Kingdom2" : {
        lat: 60,
        lon: -3,
    },
    "United Kingdom3" : {
        lat: 55,
        lon: -9,
    },
    Morocco1 : {
        lat: 31,
        lon: -7,
    },
    Egypt1 : {
        lat: 26,
        lon: 30,
    },
    France1 : {
        lat: 46,
        lon: 1,
    },
    Australia1 : {
        lat: -26,
        lon: 133,
    },
    "North Africa1" : {
        lat: 6,
        lon: 20,
    },
    Tunisia1 : {
        lat: 33,
        lon: 9,
    },
    India1 : {
        lat: 21,
        lon: 82,
    },
    Canada1 : {
        lat: 56,
        lon: -96,
    },
    Brazil1 : {
        lat: -14.2350,
        lon: -51.9253,
    },
    Mongolia1 : {
        lat: 46,
        lon: 103,
    }

}

var dinoImages = {
    sauropod_green: "data/sauropode_green.svg",
    sauropod_red: "data/sauropode_red.svg",
    "large theropod_green": "data/theropod_green.svg",
    "large theropod_red": "data/theropod_red.svg",
    "euornithopod_green": "data/euornithopod_green.svg",
    "euornithopod_red": "data/euornithopod_red.svg",
}

document.addEventListener('DOMContentLoaded', function () {   
    document.querySelector('body').style.backgroundImage="url(data/jungle.jpg)"; // specify the image path here
    svg = d3.select('svg');  
    // Loading two CSV files and store them into two arrays.
    Promise.all([d3.csv('data/dino.csv')])
         .then(function (values) {
            let data = values[0];

            
            //Wrangling the data
            dinoData = data.map(function(d) {
                return {
                   name: d.name,
                   diet: d.diet,
                   period: d.period,
                   country: d.lived_in,
                   homelat: d.lived_in ? (latlongMap[d.lived_in] ?  latlongMap[d.lived_in].lat : 0) : 0,
                   homelon: d.lived_in ? (latlongMap[d.lived_in] ?  latlongMap[d.lived_in].lon : 0) : 0,
                   type: d.type,
                   length: parseFloat(d.length.slice(0, -1)),
                   species: d.species
                }
                });

            //sort dinosaurs according to size
            dinoData = dinoData.sort((a, b) => parseFloat(b.length) - parseFloat(a.length)).slice(0,30);
            console.log(dinoData)
            drawWorldMap();
         });
 });

 function drawWorldMap() {
    // get the width and height of the SVG
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    // adding padding around the chart
    const margin = { top:50, bottom: 50, right: 100, left: 60 };

    // Map and projection
    const projection = d3.geoMercator()
    .center([0,20])                // GPS of location to zoom on
    .scale(220)                       // Initial zoom for the map
    .translate([ width/2, height/2 ])

    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        ]).then(function (initialize) {
            let dataGeo = initialize[0]        
            // Add a scale for bubble sizedata
            const valueExtent = d3.extent(dinoData, d => +d.length)
            const size = d3.scaleSqrt()
                .domain(valueExtent)  // What's in the data
                .range([ 10, 50])  // Size in pixel
        
            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(dataGeo.features)
                .join("path")
                    .attr("fill", "#b8b8b8")
                    .attr("id", (d,i) => {
                        return "country" + i
                    })
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )
                .style("stroke", "none")
                .style("opacity", .3)

            // Adding country labels to map
            //     path = d3.geoPath().projection(projection);

            //     svg
            //     .selectAll("dinoCircles")
            //     .data(dataGeo.features)
            //     .enter()
            //     .append("text")
            //     .attr("class", "country-label")
            //     .attr("transform", function(d) { return "translate(" +  path.centroid(d) + ")"; })
            //     .text(function(d) { return d.properties.name; })
            //     .attr("dx", function (d) {
            //     return "0.3em";

            // })
            // .attr("dy", function (d) {
            //     return "0.35em";
            // })
            // .style('fill', '#b3b3b3')
            // .attr('font-size', '10px');

            // Add circles
            var dinoCircles = svg
            .selectAll("dinoCircles")
            .data(dinoData)
            .join("circle")
            .attr("cx", d => projection([+d.homelon, +d.homelat])[0]) 
            .attr("cy", d => projection([+d.homelon, +d.homelat])[1])
            .attr("r", d => size(+d.length)) // size circles according to dino length
            .style("fill", d => {
                return color(d.type);
            }
                ) //color circles according to dino type
                .style("opacity", 0.5) 
                .attr("stroke", 
                d => {
                    return color(d.type);
                })
            .attr("stroke-width", d=> {if (d.length>20) {return 3} else {return 2}  })
            .on('mouseover', (event, d) => {
                console.log("mouseover", event)
                tooltip.transition().duration(10).style('opacity', 1);
                tooltip.html(`<span class="tooltip_section">Name: ${capitalizeFirstLetter(d.name)}</span> 
                <span class="tooltip_section">Country: ${d.country.slice(0, -1)}</span>
                <span class="tooltip_section">Diet: ${capitalizeFirstLetter(d.diet)}</span> 
                <span class="tooltip_section">Type: ${capitalizeFirstLetter(d.type)}</span>
                <span class="tooltip_section">Length: ${d.length}m</span>`)
                .style('left', event.layerX + "px")
                .style('top', `${(event.layerY - 28)}px`);

            })
            .on('mousemove', (event, d) => {
                tooltip
                .style('left', `${event.layerX}px`)
                .style('top', `${(event.layerY - 28)}px`)
            })
            .on('mouseout', () => {
                tooltip.transition().duration(500).style('opacity', 0);
            });

          
            var tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);


          // Add dinos
            svg
                .selectAll("dinos")
                .data(dinoData)
                .enter()
                .append("svg:image")
                .attr('class', function(d, i){
                    return "dino" + i;
                })   
                .attr("xlink:href",  d => {  //dino image according to dino type
                    if (d.diet == "herbivorous") {
                        return dinoImages[d.type + "_green"]
                    } else if (d.diet == "carnivorous") {
                        return dinoImages[d.type + "_red"]
                    } 
                })
                .attr("width", d => size(+d.length))
                .attr("height", d => size(+d.length))
                .attr("x",  d => projection([+d.homelon, +d.homelat])[0] - size(+d.length)/2)
                .attr("y", d => projection([+d.homelon, +d.homelat])[1] - size(+d.length)/2)
                .attr("stroke", 
                    d => {
                        if (d.diet == "herbivorous") {
                            return "darkgreen"
                        } else if (d.diet == "omnivorous") {
                            return "yellow"
                        } else if (d.diet == "carnivorous") {
                            return "darkred"
                        } 
                    })
                .attr("stroke-width", d=> {if (d.length>20) {return 2} else {return 1}  })
        
            // Add title and explanation
            svg
                .append("text")
                .attr("text-anchor", "end")
                .style("fill", "black")
                .attr("x", width - 10)
                .attr("y", height - 30)
                .attr("width", 90)
                .html("WHERE DINOSAURS LIVED")
                .style("font-size", 14)
            
            
            // --------------- //
            // ADD LEGEND //
            // --------------- //
            
            // Add legend: circles
            const valuesToShow = [20,30]
            const xCircle = 50
            const xLabel = 110
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("circle")
                .attr("cx", xCircle)
                .attr("cy", d => height - size(d))
                .attr("r", d => size(d))
                .style("fill", "lightgrey")
                .style("opacity", "0.5")
                .attr("stroke", "black")
            
            // Add legend: segments for size
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("line")
                .attr('x1', d => xCircle + size(d))
                .attr('x2', xLabel)
                .attr('y1', d => height - size(d))
                .attr('y2', d => height - size(d))
                .attr('stroke', 'black')
                .style('stroke-dasharray', ('2,2'))

            // Add legend: segments for type
            svg
            .selectAll("legend")
            .data([20])
            .join("line")
            .attr('x1', 50)
            .attr('x2', 50)
            .attr('y1', height - 65)
            .attr('y2', height - 120)
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))
            
            // Add legend: labels for size
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("text")
                .attr('x', xLabel)
                .attr('y', d => height - size(d))
                .text(d => d)
                .style("font-size", 10)
                .attr('alignment-baseline', 'middle')


             // adding labels for type

            // adding legend labels for dino type Sauropod
            svg.append("rect")
            .attr("x", 50)
            .attr("y", height - 170)
            .attr("width", legendSquareLength)
            .attr("height", legendSquareLength)
            .style("fill", d3.schemeSet3[2]);
            
            svg.append('text')
            .attr('class','legend-text')
            .attr('text-anchor','start')
            .attr('x', 50 + legendSquareLength + 5)
            .attr('y', height - 170 + legendSquareLength / 2)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
            .text('Sauropod')  

            // adding legend labels for dino type Large Theropod
            svg.append("rect")
            .attr("x", 50)
            .attr("y",  height - 155)
            .attr("width", legendSquareLength)
            .attr("height", legendSquareLength)
            .style("fill", d3.schemeSet3[11]);

            svg.append('text')
            .attr('class','legend-text')
            .attr('text-anchor','start')
            .attr('x', 50 + legendSquareLength + 5)
            .attr('y', height - 155 + legendSquareLength / 2)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
            .text('Large Theropod')  

            // adding legend labels for dino type Euornithopod
            svg.append("rect")
            .attr("x", 50)
            .attr("y",  height - 140)
            .attr("width", legendSquareLength)
            .attr("height", legendSquareLength)
            .style("fill", d3.schemeSet3[7]);

            svg.append('text')
            .attr('class','legend-text')
            .attr('text-anchor','start')
            .attr('x', 50 + legendSquareLength + 5)
            .attr('y', height - 140 + legendSquareLength / 2)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
            .text('Euornithopod')  

            // Add dino diet legend
            svg.append("svg:image")
                .attr("xlink:href", dinoImages["sauropod_green"])
                .attr("width", 35)
                .attr("height", 40)
                .attr("x", 32)
                .attr("y",  height - 50)
                .attr("stroke", "red")
                .attr("stroke-width", 1)

            // Add legend: segments for diet
            svg.selectAll("legend")
            .data([20])
            .join("line")
            .attr('x1', 50)
            .attr('x2', 140)
            .attr('y1', height - 30)
            .attr('y2', height - 100)
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))


            // adding legend labels for dino diet herb
            svg.append("rect")
            .attr("x", 150)
            .attr("y",  height - 125)
            .attr("width", legendSquareLength)
            .attr("height", legendSquareLength)
            .style("fill", "green")
            .style("opacity", 0.5);

            svg.append('text')
            .attr('class','legend-text')
            .attr('text-anchor','start')
            .attr('x', 150 + legendSquareLength + 5)
            .attr('y', height - 125 + legendSquareLength / 2)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
            .text('Herbivorous')  

            // adding legend labels for dino diet
            svg.append("rect")
            .attr("x", 150)
            .attr("y",  height - 110)
            .attr("width", legendSquareLength)
            .attr("height", legendSquareLength)
            .style("fill", "red")
            .style("opacity", 0.5);

            svg.append('text')
            .attr('class','legend-text')
            .attr('text-anchor','start')
            .attr('x', 150 + legendSquareLength + 5)
            .attr('y', height - 110 + legendSquareLength / 2)
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
            .text('Carnivorous')  


            

        })
           
        svg = svg
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content-responsive", true)
        // call d3 Zoom
        .call(d3.zoom()
        .scaleExtent([1,5])
        .translateExtent([[0,0], [width, height]])
        .on("zoom", function (event) {
            svg.attr("transform", event.transform)
            }))
        .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

