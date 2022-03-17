import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
export const getCRYPTO = async (graph) => {
    const url = 'https://coinmarketcap.com/'; //actual currencies
    try {
        let { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const fee = await getFee();
        let tempValueList = [];
        let shortNameList = [];
        $('tr > td:nth-child(4) > div:nth-child(1) > a:nth-child(1) > span:nth-child(1)').each((_, elem) => {
            tempValueList.push(parseFloat($(elem).text().replace(/\$|\,/g, '')));
        });
        $('tr > td:nth-child(3) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(2)').each((_, elem) => {
            shortNameList.push($(elem).text());
        });
        for (let i = 0; i < tempValueList.length; i++) {
            graph.insertOrImproveEdge(new Edge("USD", shortNameList[i], encodeRatio(1 / (tempValueList[i] - fee)), url));
            graph.insertOrImproveEdge(new Edge(shortNameList[i], "USD", encodeRatio(tempValueList[i] - fee), url));
        }
    }
    catch (error) {
        throw error;
    }
};
const getFee = async () => {
    /**
     * https://stackoverflow.com/a/43881454/18004804
     */
    let url = 'https://coinmarketcap.com/currencies/transaction-service-fee/'; //fee of transaction
    try {
        let { data } = await axios.get(url);
        let $ = cheerio.load(data);
        return new Promise((resolve) => {
            resolve(parseFloat($('.priceValue > span:nth-child(1)').text().replace('\$', '')));
        });
    }
    catch (error) {
        throw error;
    }
};
