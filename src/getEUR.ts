import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
import { Graph } from './graph.js';
export const getEUR = async (graph: Graph): Promise<void> => {
    const url = 'https://www.reisebank.de/reisegeld';
    try {
        let {data} = await axios.get(url);
		const $ = cheerio.load(data);
        let tempBuyList: number[] = []
        let tempSellList: number[] = []
        let shortNameList: string[] = []
        $('a > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span:nth-child(1)').each((_, elem) => {
            tempBuyList.push(parseFloat($(elem).text().replace("\\.", "").replace(",", ".")))
		});
        $('a > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)').each((_, elem) => {
            tempSellList.push(parseFloat($(elem).text().replace("\\.", "").replace(",", ".")))
		});
        $('a > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').each((_, elem) => {
            shortNameList.push($(elem).text())
		});
        for(let i = 0; i < tempSellList.length; i++) {
            graph.insertOrImproveEdge(new Edge("EUR", shortNameList[i], encodeRatio(1 / tempSellList[i]), url))
            graph.insertOrImproveEdge(new Edge(shortNameList[i], "EUR", encodeRatio(tempBuyList[i]), url))
        }
    } catch (error) {
		throw error;
	}
}