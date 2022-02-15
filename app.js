/**
 * This app finds negative cycle given currency exchanges scraped online, or for future development, provides a base and a guide to calculate a negative cycle for
 * any graph that uses String source, String target and double weight.
 * @author Piotr Wojciechowski
 * Released 12/07/2020
 */
import { Graph } from './graph.js';
import { getEUR } from './getEUR.js';
import { getEURESP } from './getEURESP.js';
import { getPLN } from './getPLN.js';
import { getSEK } from './getSEK.js';
import { negativeCycleExtractor } from './extractor.js';
let myGraph = new Graph();
getSEK(myGraph);
getPLN(myGraph);
getEUR(myGraph);
getEURESP(myGraph);
let cycleOrNull = new negativeCycleExtractor(myGraph).extractNegativeCycleIfOneExists();
if (cycleOrNull != null) {
    console.log("Negative cycle found!");
}
else {
    console.log("No negative cycle found.");
}
export const encodeRatio = num => {
    /**
     * Encodes Edge weights. If one wants to test-run with a flat or random values, this method can alternate the values completely.
    */
    return -Math.log(num);
};
