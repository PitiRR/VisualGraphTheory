import axios from 'axios'
import cheerio from 'cheerio'

export const getPLN = async (graph) => {
    url = 'https://internetowykantor.pl/kursy-walut/'
    try {
        const {data} = await axios.get(url);
        data.select('tbody > tr:nth-child(-n+2)')
		const $ = cheerio.load(data);

        $('tr').each((_idx, e) => {
            tempBuy = e.select("td.currency_table_sell").text().trim();
            tempSell = 1 / e.select("td.currency_table_buy").text().trim();
            shortName = e.select("a.bem-rate-table__currency-anchor").text().trim();
            graph.insertOrImproveEdge(new Edge("PLN", shortName, encodeRatio(tempSell), url))
            graph.insertOrImproveEdge(new Edge(shortName, "PLN", encodeRatio(tempBuy), url))
		});
    } catch (error) {
		throw error;
	}
}