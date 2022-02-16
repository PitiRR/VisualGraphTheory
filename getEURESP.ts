import axios from 'axios';
import cheerio from 'cheerio';
import { encodeRatio } from './app.js';
import { Edge } from './Edge.js';

export const getEURESP = async (graph): Promise<void> => {
    let url = 'https://eurochange.es/cotizaciones'
    try {
        let {data} = await axios.get(url);
		const $ = cheerio.load(data);

        data = $('ul.tabla > li.info_entrada')
        $('li').each((i, _) => {
            let tempBuy = $("div.info_divisa > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)").text().trim();
            let tempSell = 1 / parseFloat($("div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > span:nth-child(1)").text().trim());
            let shortName = $("div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(4) > label:nth-child(1) > em:nth-child(1) > span:nth-child(1)").text().trim();
            graph.insertOrImproveEdge(new Edge("EUR", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "EUR", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}