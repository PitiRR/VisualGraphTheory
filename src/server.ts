import express from 'express';
import { arbitrage, downloadJSON } from '../src/app.js';
import { Edge } from '../src/Edge.js';
import { Graph, IJSON } from '../src/graph.js';
import path from 'path';
/**
 * This file handles all server logic, routing and controlling of the app. 
 * Due to architectural requirements and best practices, this app has a server and responds to client requests in RESTful form.
 * This is in main part the result of how d3 docs imply the library to be used, with examples, guides and docs code snippets.
 */
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});
app.get('/about', (req, res) => {
    res.render('pages/about');
});
app.get('/contact', (req, res) => {
    res.render('pages/contact');
});
app.get('/visualize', async (req, res) => {
    let resValues: [Edge[], Graph] = await arbitrage();
    let cycleOrNull: Edge[] = resValues[0];
    let myGraph: IJSON = resValues[1].generateJSON(cycleOrNull);
    downloadJSON("myGraph", myGraph);
    res.render('pages/visualize', {
        graph: myGraph,
        path: cycleOrNull
    });
});
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
});