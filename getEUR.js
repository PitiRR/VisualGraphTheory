import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
export const getEUR = async (graph) => {
    let url = 'https://www.reisebank.de/reisegeld';
    try {
        let { data } = await axios.get(url);
        const $ = cheerio.load(data);
        data = $('div.tripmoneySection__products');
        $('a').each((i, _) => {
            let tempBuy = $('div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span:nth-child(1').text().replace(/^\s+|\s+$/g, '');
            let tempSell = 1 / parseFloat($('div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)').text().replace(/^\s+|\s+$/g, ''));
            let shortName = $('div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').text().replace(/^\s+|\s+$/g, '');
            console.log(tempBuy + " " + tempSell + " " + shortName + " ");
            graph.insertOrImproveEdge(new Edge("EUR", shortName, encodeRatio(tempSell), url));
            graph.insertOrImproveEdge(new Edge(shortName, "EUR", encodeRatio(tempBuy), url));
        });
    }
    catch (error) {
        throw error;
    }
};
