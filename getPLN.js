import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
export const getPLN = async (graph) => {
    let url = 'https://internetowykantor.pl/kursy-walut/';
    try {
        let { data } = await axios.get(url);
        const $ = cheerio.load(data);
        data = $('tbody > tr:nth-child(-n+2)');
        $('tr').each((i, _) => {
            let tempBuy = $("td.currency_table_sell").text().trim();
            let tempSell = 1 / parseFloat($("td.currency_table_buy").text().trim());
            let shortName = $("a.bem-rate-table__currency-anchor").text().trim();
            graph.insertOrImproveEdge(new Edge("PLN", shortName, encodeRatio(tempSell), url));
            graph.insertOrImproveEdge(new Edge(shortName, "PLN", encodeRatio(tempBuy), url));
        });
    }
    catch (error) {
        throw error;
    }
};
