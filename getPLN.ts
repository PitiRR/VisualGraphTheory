import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
import { Graph } from './graph.js';
export const getPLN = async (graph: Graph): Promise<void> => {
    const url = 'https://internetowykantor.pl/kursy-walut/'
    try {
        let {data} = await axios.get(url);
		const $ = cheerio.load(data);
        let tempBuyList: number[] = [];
        let tempSellList: number[] = [];
        let shortNameList: string[] = [];
        $('tr > td:nth-child(2) > span:nth-child(1)').each((_, elem) => {
            tempBuyList.push(parseFloat($(elem).text().replace(",", ".")))
		});
        $('tr > td:nth-child(3) > span:nth-child(1)').each((_, elem) => {
            tempSellList.push(parseFloat($(elem).text().replace(",", ".")))
		});
        $('tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)').each((_, elem) => {
            shortNameList.push($(elem).text())
		});
        // for(let item of tempBuyList) {
        //     console.log(item)
        // }
        // for(let item of tempSellList) {
        //     console.log(item)
        // }
        // for(let item of shortNameList) {
        //     console.log(item)
        // }
        for(let i = 0; i < tempSellList.length; i++) {
            //console.log(shortNameList[i] + " Sell: "+tempSellList[i]+typeof(tempSellList[i])+" Buy: "+tempBuyList[i]+typeof(tempBuyList[i]))
            graph.insertOrImproveEdge(new Edge("PLN", shortNameList[i], encodeRatio(1 / tempSellList[i]), url))
            graph.insertOrImproveEdge(new Edge(shortNameList[i], "PLN", encodeRatio(tempBuyList[i]), url))
        }
    } catch (error) {
		throw error;
	}
}