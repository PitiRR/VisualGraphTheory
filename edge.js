export class Edge {
    from;
    to;
    weight;
    cantor;
    constructor(from, to, weight, cantor) {
        this.from = from; //source
        this.to = to; //destination
        this.weight = weight;
        this.cantor = cantor;
    }
}
