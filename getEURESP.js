import axios from 'axios'
import cheerio from 'cheerio'

export const getEURESP = async (graph) => {
    url = 'https://eurochange.es/cotizaciones'
    try {
        const {data} = await axios.get(url);
        data.select('ul.tabla > li.info_entrada')
		const $ = cheerio.load(data);

        $('li').each((_idx, e) => {
            tempBuy = e.select("div.info_divisa > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)").text().trim();
            tempSell = 1 / e.select("div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > span:nth-child(1)").text().trim();
            shortName = e.select("div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > span:nth-child(4) > label:nth-child(1) > em:nth-child(1) > span:nth-child(1)").text().trim();
            graph.insertOrImproveEdge(new Edge("EUR", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "EUR", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}