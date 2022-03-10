/**
 * This file is responsible for visualization of the data, as well as interactivity.
 * @author Piotr Wojciechowski
 * @version 1.0.0
 */
import { Graph } from './graph.js';
import * as d3 from 'd3' ;
import { myGraph } from './app.js';

let margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var fs = require('fs');
fs.writeFile("myGraph.json", myGraph.generateJSON(), function(err) {
    if (err) {
        console.log(err);
    }
});
export const visualization = (myGraph: Graph) => {
    d3.json("myGraph.json").then(function(data) {
    // Initialize the links
    let link = svg
        .selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    let node = svg
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

    // Let's list the force we wanna apply on the network
    // let simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    //     .force("link", d3.forceLink()                               // This force provides links between nodes
    //             .id(function(d) { return d.name; })                     // This provide  the id of a node
    //             .links(data.links)                               // and this the list of links
    //     )
    //     .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    //     .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    //     .on("end", ticked);

    // // This function is run at each iteration of the force algorithm, updating the nodes position.
    // function ticked() {
    //     link
    //         .attr("x1", function(d) { return d.from.x; })
    //         .attr("y1", function(d) { return d.from.y; })
    //         .attr("x2", function(d) { return d.to.x; })
    //         .attr("y2", function(d) { return d.to.y; });
    //     node
    //         .attr("cx", function (d) { return d.x+6; })
    //         .attr("cy", function(d) { return d.y-6; });
    // }
    });
}