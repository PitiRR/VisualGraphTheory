import axios from 'axios'
import cheerio from 'cheerio'
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';

export const getSEK = async (graph): Promise<void> => {
    let url = 'https://www.swedbank.se/privat/rantor-priser-och-kurser/valutakurser-betalningar.html'
    try {
        let {data} = await axios.get(url);
		const $ = cheerio.load(data);

        data = $('tbody > tr:nth-child(-n+2)')
        $('tr').each((i, _) => {
            let tempBuy = $("td:nth-child(4)").text().trim();
            let tempSell = 1 / parseFloat($("td:nth-child(5)").text().trim());
            let shortName = $("td:nth-child(3)").text().trim();
            console.log("tempBuy: "+tempBuy[i]);
            console.log("tempSell: "+tempSell[i]);
            console.log("shortName: "+shortName[i]);
            console.log("i: "+i)
            graph.insertOrImproveEdge(new Edge("SEK", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "SEK", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}