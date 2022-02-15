import axios from 'axios'
import cheerio from 'cheerio';
import {encodeRatio} from './app.js'

export const getEUR = async (graph) => {
    const url = 'https://www.reisebank.de/reisegeld'
    try {
        let {data} = await axios.get(url)
        data.select();
		const $ = cheerio.load(data);

        $('a').each((_, e) => {
            let tempBuy = $('div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span:nth-child(1').text().trim()
            let tempSell = 1 / +$('div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)').text().trim()
            //note to self this is how to convert string to number, declare type then do a +
            let shortName = $('div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').text().trim()
            //let tempBuy = e.select("div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span:nth-child(1)").text().trim();
            //let tempSell = 1 / e.select("div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)").text().trim();
            //let shortName = e.select("div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)").text().trim();
            graph.insertOrImproveEdge(new Edge("EUR", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "EUR", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}