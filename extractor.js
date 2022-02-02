let distanceSet = new Map(String, Number)
let graph = new Graph()
let newLayer = new Set(String)
let currentLayer = new Set(String)
let predecessorMap = new Map(String, Edge)
let visitedSet = new Set(String)
let currentNode = ""
let cycle = [] //list of Edges

function negativeCycleExtractor(edges) {
    this.graph = edges
    edges.edgeSet.keys().array.forEach(entry => {
        distanceSet.set(entry, 0.0)
    });
    return extractNegativeCycleIfOneExists()
}

function extractNegativeCycleIfOneExists() {
    /**
        * Searches a negative cycle using Bellman-Ford algorithm. If one exists, returns it. Else, returns null list. Also calls a custom print function.
        * To save memory and time, uses hashsets and keys (nodes / edge.from) for the lookup and update complexity.
        * Reinitializes many variables per iteration, most notably predecessorMap as finding the negative cycle is based on it.
        * Switches layers so as not to repeat nodes and save memory this way.
    */
    graph.edgeSet.keys().array.forEach(entry => {
       newLayer.add(entry)
    });
    processedLayers = 0
    existsNegativeCycle = false;
    vertexCount = graph.edgeSet.keys().length
    console.log(vertexCount)
    while (!isEmpty(newLayer)) {
        predecessorMap.clear()
        currentLayer = newLayer
        newLayer = new Set(String)

        currentLayer.array.forEach(entry => {
            graph.edgeSet.get(entry).values.array.forEach(outgoingEdge => {
                let relaxed = relaxEdge(outgoingEdge)
                if (relaxed && processedLayers > vertexCount) {
                    existsNegativeCycle = true;
                    currentNode = outgoingEdge.to;
                }
            });
        });
        if (processedLayers > vertexCount) {
            break;
        } else {
            processedLayers++;
        }
    }
    System.out.println("existsNegativeCycle: " + existsNegativeCycle); // control statement

    if (existsNegativeCycle) {
        cycle = getArbitrage()
        printArbitrage(cycle)
        return cycle;
    }
    return null;
}
function relaxEdge(edge) {        
    /**
        * If distance can be improved, relaxes edge and puts it in predecessor map as it may belong to a negative cycle.
    */
    newToDistance = distanceSet.get(edge.from) + edge.weight
    if (newToDistance < distanceSet.get(edge.to)) {
        distanceSet.set(edge.to, newToDistance)
        newLayer.add(edge.to)
        predecessorMap.set(edge.to, edge)
        return true
    }
    return false
}
function getArbitrage(cycle) {
    /**
        * Prints the arbitrage. ExchangeRatio and Total Exchange Power prints are for problems check: If they are unusually high,
        * it means that something went wrong such as an inconsistency. See getSEK.java.
    */
    exchangeRatio = 1.0
    cycle.array.forEach(edge => {
        console.log(edge.from);
        console.log(" -> ");
        console.log(edge.to);
        console.log(" via ");
        console.logln(Math.exp(-edge.weight));
        console.log(" in ");
        console.log(edge.cantor);
        console.log("\n\n");
        exchangeRatio *= Math.exp(-edge.weight);
    })
    console.log("Total exchange power: "+ exchangeRatio)
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}