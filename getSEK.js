import axios from 'axios'
import cheerio from 'cheerio'

export const getSEK = async (graph) => {
    url = 'https://www.swedbank.se/privat/rantor-priser-och-kurser/valutakurser-betalningar.html'
    try {
        const {data} = await axios.get(url);
        data.select('tbody > tr:nth-child(-n+2)')
		const $ = cheerio.load(data);

        $('tr').each((_idx, e) => {
            tempBuy = e.select("td:nth-child(4)").text().trim();
            tempSell = 1 / e.select("td:nth-child(5)").text().trim();
            shortName = e.select("td:nth-child(3)").text().trim();
            graph.insertOrImproveEdge(new Edge("SEK", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "SEK", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}