import { Graph } from './graph.js'
import { Edge } from './Edge.js';

export class NegativeCycleExtractor {
    distanceSet: Map<string, number>;
    graph: Graph;
    newLayer: Set<string>;
    currentLayer: Set<string>;
    predecessorMap: Map<string, Edge>;
    visitedSet: Set<string>;
    currentNode: string;
    cycle: Array<Edge>; //list of Edges

    constructor(edges: Graph) {
        this.distanceSet = new Map<string, number>();
        this.newLayer = new Set<string>();
        this.currentLayer = new Set<string>();
        this.predecessorMap = new Map<string, Edge>();
        this.visitedSet = new Set<string>();
        this.currentNode = '';
        this.cycle = new Array<Edge>();
        this.graph = edges;
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
        */
        let processedLayers: number = 0;
        let existsNegativeCycle: boolean = false;
        let vertexCount: number = Object.keys(this.graph.edgeSet).length;

        for (let entry of this.graph.edgeSet.keys()) {
            console.log("L39 extractor.ts " + entry);
            this.newLayer.add(entry);
        }
        console.log("[extractor.ts 41] vertexCount: " + vertexCount);

        while (!this.isEmpty(this.newLayer)) {
            if(this.predecessorMap) {
                this.predecessorMap.clear();
            }
            this.currentLayer = this.newLayer;
            this.newLayer = new Set<string>()
            for (let [entry] of this.currentLayer.keys()) {
                for (let [_, outgoingEdge] of this.graph.edgeSet.get(entry)) {
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
            let cycle = this.getArbitrage();
            this.printArbitrage(cycle);
            return cycle;
        }
        return null;
    }
    relaxEdge(edge: Edge): boolean {        
        /**
         * If distance can be improved, relaxes edge and puts it in predecessor map as it may belong to a negative cycle.
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
         * Note to future self: Collections.reverse() returns void and alternates the param. Don't use it in print statements
         */
        while (!this.visitedSet.has(this.currentNode)) {
            this.visitedSet.add(this.currentNode);
            this.currentNode = this.predecessorMap.get(this.currentNode).from;
        }
        let sentinel = this.currentNode;
        console.log("sentinel: " + sentinel);
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
         * it means that something went wrong such as an inconsistency. See getSEK.java.
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
        return obj && Object.keys(obj).length == 0;
    }
}