export class DNAResult {
    dna: string[];
    hasMutation: boolean;

    constructor(dna: string[], hasMutation: boolean) {
        this.dna = dna;
        this.hasMutation = hasMutation;
    }
}
