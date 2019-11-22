import {SequenceContext, SequenceWalkerMovement, SequenceMatrixItem} from './mutations.models';

export class SequenceMatrix {
    private readonly matrix: string[][];
    private row: number;
    private column: number;

    constructor(dna: string[]) {
        this.matrix =  this.buildMatrix(dna) ;
    }

    walk(visitor: (context: SequenceContext) => void, movementType: SequenceWalkerMovement): void {
        this.matrix.forEach((sequences: string[], row: number) => {
            this.row = row;
            sequences.forEach((sequence: string, column: number) => {
                this.column = column;
                const context = { row, column, movementType };
                visitor(context);
            });
        });
    }

    getSequence(context: SequenceContext): SequenceMatrixItem {
        return {
            sequence: this.matrix[context.row][context.column],
            row: context.row,
            column: context.column,
        };
    }

    getNeighbourSequence(context: SequenceContext, movementType: SequenceWalkerMovement): SequenceMatrixItem {
        let row = null;
        let column = null;

        switch (movementType) {
            case SequenceWalkerMovement.Horizontal:
                column = context.column + 1;
                row = context.row;
                break;

            case SequenceWalkerMovement.Vertical:
                column = context.column;
                row = context.row + 1;
                break;

            case SequenceWalkerMovement.DiagonalForward:
                column = context.column + 1;
                row = context.row + 1;
                break;

            case SequenceWalkerMovement.DiagonalBack:
                column = context.column - 1;
                row = context.row + 1;
                break;

            default:
                return null;
        }

        return {
            row,
            column,
            sequence: this.matrix[row] && this.matrix[row][column] || null, /* array overflow check */
        };
    }

    /**
     * Split out every string of the array into individual chars
     * in order to create a bi-dimensional array of strings
     * @param dna
     * Having an input like this: ['ABC', 'DEF']
     * it generates a matrix like this: [  ['A', 'B', 'C' ], ['D', 'E', 'F' ]
     */
    private buildMatrix(dna: string[]): string[][] {
        return dna.map((dnaItem: string) => dnaItem.split(''));
    }

}
