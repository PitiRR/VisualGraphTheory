/**
 * This method defines the Edge object.
 * from and to are defined as: if you have USD and you are buying EUR, then USD is from and EUR is to. 
 * Weight is the value of the trade
 * @property {string} from is the source node
 * @property {string} to is the destination node
 * @property {number} weight is the value/weight of the exchange
 * @property {string} cantor is the place where the data comes from. At the moment, it's just URLs.
 * @version 1.0.0
 */
export class Edge {
    from: string
    to: string
    weight: number
    cantor: string
    
    constructor(from: string, to: string, weight: number, cantor: string) {
        this.from = from;
        this.to = to;
        this.weight = weight;
        this.cantor = cantor;
    }
}