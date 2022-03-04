export class Graph {
    edgeSet;
    constructor() {
        this.edgeSet = new Map();
    }
    /**
     * Object containing a nested HashMap. Read it as "HashMap<source, HashMap<target, Edge>>"
    */
    insertOrImproveEdge(edge) {
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
            }
            else {
                //if source exists, but target doesn't
                this.edgeSet.get(edge.from).set(edge.to, edge);
            }
        }
        else {
            // if source node doesn't exist at all
            this.edgeSet.set(edge.from, new Map());
            this.edgeSet.get(edge.from).set(edge.to, edge);
        }
    }
}
