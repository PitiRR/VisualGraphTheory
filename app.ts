/**
 * This app finds negative cycle given currency exchanges scraped online, or for future development, provides a base and a guide to calculate a negative cycle for 
 * any graph that uses String source, String target and double weight.
 * @author Piotr Wojciechowski
 * Released 12/07/2020
 */
import { Graph } from './graph.js';
import { getEUR } from './getEUR.js';
import { getCRYPTO } from './getCRYPTO.js';
import { getPLN } from './getPLN.js';
import { getSEK } from './getSEK.js';
import { NegativeCycleExtractor } from './extractor.js';
import { Edge } from './Edge.js';

let myGraph: Graph = new Graph();
getSEK(myGraph);
getPLN(myGraph);
getEUR(myGraph);
getCRYPTO(myGraph);
console.log(myGraph.edgeSet)
let cycleOrNull: Edge[] = new NegativeCycleExtractor(myGraph).extractNegativeCycleIfOneExists();

if(cycleOrNull != null) {
    console.log("[app.ts 22] Success! Negative cycle found.");
} else { 
    console.log("[app.ts 24] No negative cycle found.");
}

export const encodeRatio = (num: number) => {
    /**
     * Encodes Edge weights. If one wants to test-run with a flat or random values, this method can alternate the values completely.
    */
    return -Math.log(num);
}