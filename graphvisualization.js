import { myGraph } from './app.js';
let data = {
    nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
    links: [
        { source: "Harry", target: "Sally" },
        { source: "Harry", target: "Alice" },
    ],
};
let myConfig = myGraph.generateJSON;
let onClickNode = function (nodeId) {
    window.alert(`Clicked node ${nodeId}`);
};
let onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
};
id;
"graph-id"; // id is mandatory
data = { data };
config = { myConfig };
onClickNode = { onClickNode };
onClickLink = { onClickLink }
    /  > ;
