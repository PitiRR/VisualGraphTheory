import { Graph } from './graph.js'
import { Edge } from './Edge.js';

export class NegativeCycleExtractor {
    /**
    * This file contains all relevant algorithms to searching through the graphs as well as finding negative cycle (arbitrage).
    * This program uses Bellman-Ford algorithm. Since distances can be negative, this is preferable to Dijkstra's. 
    * Additionally, finding negative cycle is essentially equivalent to finding an arbitrage (taking advantage of differing prices to gain profit)
    * @exports NegativeCycleExtractor
    * @property {Map<string, number>} distanceSet 
    * @param {Graph} edges graph containing all currency information, imported from app.ts.
    * @property {Set<string>} newLayer 
    * @property {Set<string>} currentLayer 
    * @property {Map<string, Edge>} predecessorMap 
    * @property {Set<string>} visitedSet 
    * @property {string} currentNode 
    * @property {Array<Edge>} cycle list of edges in "correct" order
    * @version 1.0.0
    */
    distanceSet: Map<string, number>;
    edges: Graph;
    newLayer: Set<string>;
    currentLayer: Set<string>;
    predecessorMap: Map<string, Edge>;
    visitedSet: Set<string>;
    currentNode: string;
    cycle: Array<Edge>;

    constructor(edges: Graph) {
        this.distanceSet = new Map<string, number>();
        this.newLayer = new Set<string>();
        this.currentLayer = new Set<string>();
        this.predecessorMap = new Map<string, Edge>();
        this.visitedSet = new Set<string>();
        this.currentNode = '';
        this.cycle = new Array<Edge>();
        this.edges = edges;
        for (let entry of edges.edgeSet.keys()) {
            this.distanceSet.set(entry, 0.0);
        }
    }
    extractNegativeCycleIfOneExists(): Edge[] {
        /**
         * Searches a negative cycle using Bellman-Ford algorithm. If one exists, returns it. Else, returns null list. Also calls a custom print function.
         * To save memory and time, uses hashsets and keys (nodes / edge.from) for the lookup and update complexity.
         * Reinitializes many variables per iteration, most notably predecessorMap as finding the negative cycle is based on it.
         * Switches layers so as not to repeat nodes and save memory this way.
         * @property {number} processedLayers number of searches madein the graph. Used to find out if there is a negative cycle
         *      (if there are more iterations/searches/loops than there are vertices, then there is something going on.)
         * @property {boolean} existsNegativeCycle Checks if arbitrage (negative cycle) exists in the graph. Created to make detection readable and explicit.
         * @property {number} vertexCount parameterized number of edges in the graph. Created for readability and checking if negative cycle exists.
         * @property {boolean} relaxed verifies if the outgoing edge can be relaxed (improved). Used to verify if there is negative cycle, edge relaxation occurs
         * @returns {Edge[]} list of ordered edges that contain arbitrage
        */
        let processedLayers: number = 0;
        let existsNegativeCycle: boolean = false;
        let vertexCount: number = this.edges.edgeSet.size;

        for (let entry of this.edges.edgeSet.keys()) {
            //console.log("[extractor.ts 39] populating newLayer: " + entry);
            this.newLayer.add(entry);
        }
        console.log("[extractor.ts 41] vertexCount: " + vertexCount);

        while (!this.isEmpty(this.newLayer)) {
            if(this.predecessorMap) {
                this.predecessorMap.clear();
            }
            this.currentLayer = this.newLayer;
            this.newLayer = new Set<string>()
            for (let entry of this.currentLayer.keys()) {
                for (let [_, outgoingEdge] of this.edges.edgeSet.get(entry)) {
                    let relaxed: boolean = this.relaxEdge(outgoingEdge);
                    if (relaxed && processedLayers > vertexCount) {
                        existsNegativeCycle = true;
                        this.currentNode = outgoingEdge.to;
                    }
                }
            }
            if (processedLayers > vertexCount) {
                break;
            } else {
                processedLayers++;
            }
        }
        console.log("[extractor.ts 63] existsNegativeCycle: " + existsNegativeCycle); // control statement

        if (existsNegativeCycle) {
            let cycle: Edge[] = this.getArbitrage();
            this.printArbitrage(cycle);
            return cycle;
        }
        return null;
    }
    relaxEdge(edge: Edge): boolean {        
        /**
         * If distance can be improved, relaxes edge and puts it in predecessor map as it may belong to a negative cycle.
         * @param {number} newToDistance updates the TO distance
         * @returns {boolean}  
         * @version 1.0.0
        */
        let newToDistance: number = this.distanceSet.get(edge.from) + edge.weight;
        if (newToDistance < this.distanceSet.get(edge.to)) {
            this.distanceSet.set(edge.to, newToDistance);
            this.newLayer.add(edge.to);
            this.predecessorMap.set(edge.to, edge);
            return true;
        }
        return false;
    }
    getArbitrage(): Edge[] {
        /**
         * Finds negative cycle (repeated node in a set, called sentinel). 
         * Reverses the list for convienience of reading; top to bottom.
         * @returns {Edge[]} list of edges in order.
         */
        console.log("[extractor.ts 92] Getting arbitrage...")
        while (!this.visitedSet.has(this.currentNode)) {
            this.visitedSet.add(this.currentNode);
            this.currentNode = this.predecessorMap.get(this.currentNode).from;
        }
        let sentinel: string = this.currentNode;
        console.log("[extractor.ts 98] sentinel: " + sentinel);
        this.currentNode = this.predecessorMap.get(this.currentNode).from;
        this.cycle.push(this.predecessorMap.get(sentinel));
        while (this.currentNode != sentinel) {
            this.cycle.push(this.predecessorMap.get(this.currentNode));
            this.currentNode = this.predecessorMap.get(this.currentNode).from;
        }
        this.cycle.reverse();
        return this.cycle;
    }
    printArbitrage(cycle: Edge[]): void {
        /**
         * Prints the arbitrage. ExchangeRatio and Total Exchange Power prints are for problems check: If they are unusually high,
         * it means that something went wrong such as an inconsistency. Some cantors provide inconsistent data and formats to fight
         * against programs like this. 
         * @param {Edge[]} cycle list of edges to be printed
         * @version 1.0.0
        */
        let exchangeRatio: number = 1;
        for (let edge of cycle) {
            console.log(edge.from);
            console.log(" -> ");
            console.log(edge.to);
            console.log(" via ");
            console.log(Math.exp(-edge.weight));
            console.log(" in ");
            console.log(edge.cantor);
            console.log("\n\n");
            exchangeRatio *= Math.exp(-edge.weight);
        }
        console.log("Total exchange power: "+ exchangeRatio);
    }

    isEmpty(obj: Object): boolean {
        /** 
         * Custom method to check if an object (Map, Set, etc.) is empty
         * @param {Object} obj object that has KV pairs (or doesn't, we're checking).
        */
        return obj && Object.keys(obj).length == 0;
    }
}