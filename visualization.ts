// /**
//  * This file is responsible for visualization of the data, as well as interactivity.
//  * The code is roughly based on JS implementation of a d3 network, with added TS flavor, like implementing interfaces.
//  * @author Piotr Wojciechowski
//  * @version 1.0.0
//  */
// import { Graph, Inodes, Ilinks } from './graph.js';
// import * as d3 from 'd3';

// let margin = { top: 10, right: 30, bottom: 30, left: 40 }
// let width = 400 - margin.left - margin.right
// let height = 400 - margin.top - margin.bottom

// // https://github.com/d3/d3-selection/issues/141#issuecomment-323759154
// let svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
// export const visualization = (myGraph: Graph) => {
//   // https://www.d3indepth.com/force-layout/
//   // https://www.d3-graph-gallery.com/graph/network_basic.html
//     d3.json(JSON.stringify(myGraph.generateJSON())).then(function(data) {
//     let link = svg
//       .selectAll("line")
//       .data(this.links)
//       .join("line")
//       .style("stroke", "#aaa");
//     let node = svg
//       .selectAll("circle")
//       .data(this.nodes)
//       .join("circle")
//       .attr("r", 20)
//       .style("fill", "#69b3a2");
    
//     // https://stackoverflow.com/a/42215310/18004804
//     // https://typescript.hotexamples.com/examples/d3-force/-/forceManyBody/typescript-forcemanybody-function-examples.html
//     let simulation = d3.forceSimulation<Inodes, Ilinks>(this.nodes) // Force algorithm is applied to data.nodes
//       //below: https://stackoverflow.com/a/63642213/18004804
//       .force("link", d3.forceLink().id((d: any) => d.source).strength(0.015))
//       .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Use positive values to create attraction.
//       .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
//       .on("tick", ticked);
//     // This function is run at each iteration of the force algorithm, updating the nodes position.
//     function ticked () {
//         link
//             .attr("x1", (d: any) => { return d.source.x; })
//             .attr("y1", (d: any) => { return d.source.y; })
//             .attr("x2", (d: any) => { return d.target.x; })
//             .attr("y2", (d: any) => { return d.target.y; });
//         node
//             .attr("cx", (d: any) => { return d.x+6; })
//             .attr("cy", (d: any) => { return d.y-6; });
//     }
//     return simulation;
//   });
// }