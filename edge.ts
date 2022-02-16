export class Edge {
    from: string
    to: string
    weight: number
    cantor: string
    
    constructor(from: string, to: string, weight: number, cantor: string) {
        this.from = from;   //source
        this.to = to;       //destination
        this.weight = weight;
        this.cantor = cantor;
    }
}