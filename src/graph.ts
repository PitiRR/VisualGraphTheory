import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { Edge } from './Edge.js';
export interface IJSON {
    nodes: Inodes[],
    links: Ilinks[]
}
export interface Inodes extends SimulationNodeDatum {
    name: string | number //from/source node, can be used as a numeric ID
}

export interface Ilinks extends SimulationLinkDatum<SimulationNodeDatum> {
    source: string | number, //allows numeric identification in case numeric ID is used as a name
    target: string | number,
    weight: number,
    cantor: string,
    cycle: boolean
}
export class Graph {
    edgeSet: Map<string, Map<string, Edge>>;
    constructor() {
        this.edgeSet = new Map<string, Map<string, Edge>>();
    }
    /**
     * Object containing a nested HashMap. Read it as "HashMap<source, HashMap<target, Edge>>"
    */
    insertOrImproveEdge (edge: Edge): void {
        /**
         * Used when extracting data to create a new or update with a better edge, if one exists. 
         * For example, getEURESP (removed as website changed) and getEUR both are base euro, but one may have a better ratio than the other. This method takes care of this.
        */
        //console.log(`from: ${edge.from} to: ${edge.to} weight: ${edge.weight} cantor: ${edge.cantor}`)
        if (this.edgeSet.has(edge.from)) {
        // if there is already an edge with the same source
            if (this.edgeSet.get(edge.from).has(edge.to)) {
            // if there is already an edge with the same source and destination
                if (edge.weight > this.edgeSet.get(edge.from).get(edge.to).weight) {
                // choose the edge with better conversion rate (weight)
                    this.edgeSet.get(edge.from).set(edge.to, edge);
                }
            } else {
                //if source exists, but target doesn't
                this.edgeSet.get(edge.from).set(edge.to, edge);
            }
        } else {
          // if source node doesn't exist at all
            this.edgeSet.set(edge.from, new Map<string, Edge>());
            this.edgeSet.get(edge.from).set(edge.to, edge);
        }
    }
    
    generateJSON = (cycleOrNull: Edge[]): IJSON => {
    /**
     * d3 requires a specific format of a network;
     * A single JSON that contains two attributes, that in turn contains a list of nodes and links
     * Example: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
     * Since our map contains both, we need to 'expand' it. This method takes care of it.
     * Notice that d3 requires string, but I want to leave this method as an actual object for the purpose of abstraction.
     * https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/dc27c3788c00d279ae5ff61e8e2dfd568aae5e8e/types/d3-force/index.d.ts
     * @returns a JSON in a format ready for d3
     * @version 1.0.0
     */
        let nodes: Inodes[] = []
        let links: Ilinks[] = []
        for (let i of this.edgeSet) { //i is [source: string, Map<destination: string, edge: Edge>]
            let node = {name: `${i[0]}`}
            nodes.push(node)
            for (let j of i[1]) { //j is Map<destination: string, edge: Edge>
                let link = {source: j[1].from, target: j[1].to, weight: j[1].weight, cantor: j[1].cantor, cycle: isPartOfCycle(cycleOrNull, j)}
                links.push(link)
            }
        }
        let returnJSON: IJSON = {
            nodes: nodes,
            links: links
        };
        return returnJSON;
    }
}

const isPartOfCycle = (cycleOrNull: Edge[], j: [string, Edge]): boolean => {
    /**
     * In order for d3 to visualize (e.g. stroke colour, style, width) links that belong to a negative cycle/arbitrage, it must know if 
     * something belongs to a cycle. This method allows the optional parameter cycle? of ILinks to be in a link in the JSON object.
     * This allows d3 to know which links to colour differntly.
     * This method compares links in cycleOrNull (returns false if cycleOrNull is null obviously) to the one being compared in
     * generateJSON()
     * @returns true or false depending if the edge is in cycleOrNull
     * @version 1.0.0
     */
    if (!cycleOrNull) {
        return false;
    } return cycleOrNull.some(e => (e.from === j[1].from && 
                                e.to === j[1].to && 
                                e.cantor === j[1].cantor))
}