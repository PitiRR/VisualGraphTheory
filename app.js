/**
 * This app finds negative cycle given currency exchanges scraped online, or for future development, provides a base and a guide to calculate a negative cycle for
 * any graph that uses String source, String target and double weight.
 * @author Piotr Wojciechowski
 * @exports encodeRatio
 * @version 1.1.0
 */
import { Graph } from './graph.js';
import { getEUR } from './getEUR.js';
import { getCRYPTO } from './getCRYPTO.js';
import { getPLN } from './getPLN.js';
import { getSEK } from './getSEK.js';
import { NegativeCycleExtractor } from './extractor.js';
import * as fs from 'fs';
//import { transformGraph } from './visualization.js'
//import { visualization } from './visualization';
export const encodeRatio = (num) => {
    /**
     * Encodes Edge weights. If one wants to test-run with a flat or random values, this method can alternate the values completely.
     * @returns a natural log of the currency's value
     * @version 1.0.0
    */
    return -Math.log(num);
};
export let myGraph = new Graph();
await getSEK(myGraph);
await getPLN(myGraph);
await getEUR(myGraph);
await getCRYPTO(myGraph);
export let cycleOrNull = new NegativeCycleExtractor(myGraph).extractNegativeCycleIfOneExists();
if (cycleOrNull) {
    console.log("[app.ts 22] Success! Negative cycle found.");
}
else {
    console.log("[app.ts 24] No negative cycle found.");
}
fs.writeFile("myGraph.json", JSON.stringify(myGraph.generateJSON()), function (err) {
    if (err) {
        console.log(err);
    }
});
//visualization(myGraph);
// JSON.stringify(myGraph)
// for(let i of myGraph.edgeSet) {
//     console.log(myGraph.edgeSet)
// }
