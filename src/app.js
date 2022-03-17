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
export const encodeRatio = (num) => {
    /**
     * Encodes Edge weights. If one wants to test-run with a flat or random values, this method can alternate the values completely.
     * @returns a natural log of the currency's value
     * @version 1.0.0
    */
    return -Math.log(num);
};
const downloadJSON = (name, myJSON) => {
    /**
     * This method saves a JSON (conforming to IJSON format, more in graph.ts) into a file.
     * Required for visualization.
     * @param name provided name for the JSON. Recommended: the same as the code variable
     * @param myJSON Object to be saved
     * @version 1.0.0
     */
    fs.writeFile(name, JSON.stringify(myJSON, null, 1), function (err) {
        if (err) {
            console.log(err);
        }
    });
};
export const arbitrage = async () => {
    let myGraph = new Graph();
    await getSEK(myGraph);
    await getPLN(myGraph);
    await getEUR(myGraph);
    await getCRYPTO(myGraph);
    let cycleOrNull = new NegativeCycleExtractor(myGraph).extractNegativeCycleIfOneExists();
    if (cycleOrNull) {
        console.log("Success! Negative cycle found.");
    }
    else {
        console.log("No negative cycle found.");
    }
    return [cycleOrNull, myGraph];
};
