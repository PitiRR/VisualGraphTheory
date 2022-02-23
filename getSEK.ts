import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';
import { Graph } from './graph.js';
export const getSEK = async (graph: Graph): Promise<void> => {
    const url = 'https://www.swedbank.se/privat/rantor-priser-och-kurser/valutakurser-betalningar.html'
    try {
        let {data} = await axios.get(url);
		const $ = cheerio.load(data);
        // $('tr').each((i) => {
        //     /**
        //      * 1. parse data from HTML
        //      * 2. split string (default by cheerio) into an array, and remove whitespace-only elements
        //      * 3. put data into an edge - turns out this is the most straightfoward way to do it, rather than having number[] array.
        //      */
        //     let tempBuy: string = $("td:nth-child(4)").text();
        //     let tempBuyList: string[] = tempBuy.split(/(\s+)/).filter((str) => /\S/.test(str));
        //     let tempSell: string = $("td:nth-child(5)").text();
        //     let tempSellList: string[] = tempSell.split(/(\s+)/).filter((str) => /\S/.test(str));
        //     let shortName: string = $("td:nth-child(3)").text();
        //     let shortNameList: string[] = shortName.split(/(\s+)/).filter((str) => /\S/.test(str));
        //     graph.insertOrImproveEdge(new Edge("SEK", shortNameList[i], encodeRatio(1 / parseFloat(tempSellList[i])), url))
        //     graph.insertOrImproveEdge(new Edge(shortNameList[i], "SEK", encodeRatio(parseFloat(tempBuyList[i])), url))
		// });
        let tempBuyList: number[] = []
        let tempSellList: number[] = []
        let shortNameList: string[] = []
        $('tr > td:nth-child(4)').each((_, elem) => {
            tempBuyList.push(parseFloat($(elem).text()))
		});
        $('tr > td:nth-child(5)').each((_, elem) => {
            tempSellList.push(parseFloat($(elem).text()))
		});
        $('tr > td:nth-child(3)').each((_, elem) => {
            shortNameList.push($(elem).text().trim())
		});
        // for(let item of tempBuyList) {
        //     console.log(item)
        // }
        // for(let item of tempSellList) {
        //     console.log(item)
        // }
        // for(let i = 0; i < shortNameList.length; i++)
        //     console.log("i: "+i+" "+shortNameList[i])
        for(let i = 0; i < tempSellList.length; i++) {
            //console.log(shortNameList[i] + " Sell: "+tempSellList[i]+typeof(tempSellList[i])+" Buy: "+tempBuyList[i]+typeof(tempBuyList[i]))
            graph.insertOrImproveEdge(new Edge("SEK", shortNameList[i], encodeRatio(1 / tempSellList[i]), url))
            graph.insertOrImproveEdge(new Edge(shortNameList[i], "SEK", encodeRatio(tempBuyList[i]), url))
        }
    } catch (error) {
		throw error;
	}
}