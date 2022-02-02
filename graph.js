function Graph () {
    let edgeSet = new Map(from, new Map(to, edge))
    /**
     * Object containing a nested HashMap. Read it as "HashMap<source, HashMap<target, Edge>>"
     */
    function insertOrImproveEdge(edge) {
        /**
         * Used when extracting data to update a better edge than an already existing one, if one exists. 
         * For example, getEURESP and getEUR both are base euro, but one may have a better ratio than the other. This method takes care of this.
         */
        if (edgeSet.has(edge.from)) {
            // if there is already an edge with the same source
            if (edgeSet.get(edge.from).has(edge.to)) {
                // if there is already an edge with the same source and destination
                if (edge.weight > edgeSet.get(edge.from).get(edge.to).weight) {
                    // choose the edge with better conversion rate (weight)
                    edgeSet.get(edge.from).set(edge.to, edge)
                } else {
                    //if source exists, but target doesn't
                    edgeSet.get(edge.from).set(edge.to, edge)
                }
            }
        } else {
            // if source node doesn't exist at all
            edgeSet.set(edge.from, new Map())
            edgeSet.get(edge.from).set(edge.to, edge)
        }
    }
}