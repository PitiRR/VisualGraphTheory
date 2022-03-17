/**
 * This method defines the Edge object. It is equivalent to d3's link.
 * from and to are described as: if you have USD and you are buying EUR, then USD is from and EUR is to.
 * Weight is the value of the trade
 * @property {string} from is the source node. Also known as 'source'.
 * @property {string} to is the destination node. Also known as 'target'.
 * @property {number} weight is the value/weight of the exchange
 * @property {string} cantor is the place where the data comes from. At the moment, it's just URLs.
 * @version 1.0.0
 */
export class Edge {
    from;
    to;
    weight;
    cantor;
    constructor(from, to, weight, cantor) {
        this.from = from;
        this.to = to;
        this.weight = weight;
        this.cantor = cantor;
    }
}
