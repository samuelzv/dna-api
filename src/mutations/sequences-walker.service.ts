import {Injectable, Logger} from '@nestjs/common';

export enum SequenceWalkerMovement {
    Horizontal,
    Vertical,
    DiagonalForward,
    DiagonalBack,
}

export interface SequenceMatrixItem {
    sequence: string;
    row: number;
    column: number;
}
export interface SequenceContext {
    sequencesMatrix?: string[][];
    sequence?: string;
    row: number;
    column: number;
    matches?: number;
    movementType: SequenceWalkerMovement;
}

// todo move it to a separated file
class SequenceMatrix {
    private readonly matrix: string[][];
    private row: number;
    private column: number;
    private rowNeighbour: number;
    private columnNeighbour: number;

    constructor(dna: string[]) {
        this.matrix =  this.buildMatrix(dna) ;
    }

    walk(visitor: (context: SequenceContext) => void, movementType: SequenceWalkerMovement): void {
        this.matrix.forEach((sequences: string[], row: number) => {
            this.row = row;
            sequences.forEach((sequence: string, column: number) => {
                this.column = column;
                const context = { row, column, movementType };
                // this.moveNeighbourPointer(context);
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

    getNeighbourSequence(context: SequenceContext): SequenceMatrixItem {
        let row = null;
        let column = null;

        switch (context.movementType) {
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

    /*
    getNeighbourSequence(): SequenceMatrixItem {
        return {
            sequence: this.matrix[this.rowNeighbour] && this.matrix[this.rowNeighbour][this.columnNeighbour] || null,
            row: this.rowNeighbour,
            column: this.columnNeighbour,
        };
    }
     */

    moveNeighbourPointer(context: SequenceContext): any {
        switch (context.movementType) {
            case SequenceWalkerMovement.Horizontal:
                this.columnNeighbour = context.column + 1;
                this.rowNeighbour = context.row;
                break;

            case SequenceWalkerMovement.Vertical:
                this.columnNeighbour = context.column;
                this.rowNeighbour = context.row + 1;
                break;

            case SequenceWalkerMovement.DiagonalForward:
                this.columnNeighbour = context.column + 1;
                this.rowNeighbour = context.row + 1;
                break;

            case SequenceWalkerMovement.DiagonalBack:
                this.columnNeighbour = context.column - 1;
                this.rowNeighbour = context.row + 1;
                break;
        }
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

@Injectable()
export class SequencesWalkerService {
    private logger: Logger = new Logger('SequencesWalkerService');
    // "ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"
    // sample
    // "A T G C G A"
    // "C A G T G C"
    // "T T A T G T"
    // "A A A A G G"
    // "C C C C T A"
    // "T C A C T G"

    getMutations(dna: string[], repeatedSequencesToMutation: number, movementType: SequenceWalkerMovement): number {
        let mutations = 0;
        const matrix = new SequenceMatrix(dna);

        /*
        const visitor2 = () => {
            let matches = 0;

            return (context: SequenceContext): number => {
                matches += 1;
                const neighbour = matrix.getNeighbourSequence();
                if (matrix.getSequence().sequence === neighbour.sequence &&
                    matches < repeatedSequencesToMutation) {
                    const nextContext: SequenceContext = {
                        sequence: neighbour.sequence,
                        row:  neighbour.row,
                        column: neighbour.column,
                        movementType: context.movementType,
                    };

                    // tslint:disable-next-line:no-arg
                    return arguments.callee(nextContext);
                }
                return matches;
            };
        };
         */

        let matches = 1;
        const visitor =  (context: SequenceContext): number => {
            // matrix.moveNeighbourPointer(context);
            const neighbour = matrix.getNeighbourSequence(context);
            const current = matrix.getSequence(context);
            if (current.sequence === neighbour.sequence &&
                matches < repeatedSequencesToMutation) {
                matches += 1;
                const nextContext: SequenceContext = {
                    sequence: neighbour.sequence,
                    row:  neighbour.row,
                    column: neighbour.column,
                    movementType: context.movementType,
                };

                // tslint:disable-next-line:no-arg
                return visitor(nextContext);
            } else {
                if (matches === 4) {
                    mutations += 1;
                }
                matches = 1;
            }

            return matches;
        };

        matrix.walk(visitor, movementType);
        this.logger.log(`Mutations: ${mutations}`);
        return mutations;
    }

    matrixVisitor(context: SequenceContext) {

    }

    countMutations(sequencesMatrix: string[][], repeatedSequencesToMutation: number, movementType: SequenceWalkerMovement): number {
        let mutations = 0;

        sequencesMatrix.forEach((rowSequence: string[], row: number) => {
            rowSequence.forEach((sequence: string, column: number) => {
                const sequenceContext = {
                    sequencesMatrix,
                    sequence,
                    row,
                    column,
                    matches: 0,
                    movementType,
                };
                const counter = this.walkAndCountSequence(sequenceContext, repeatedSequencesToMutation);
                if (counter >= repeatedSequencesToMutation) {
                    mutations += 1;
                }
                this.logger.debug(`Sequence: ${sequence} Count: ${counter}`);
            });
        });

        return mutations;
    }

    walkAndCountSequence(context: SequenceContext, repeatedSequencesToMutation: number): number {
        const { sequence, sequencesMatrix, row, column, movementType } = context;
        const matches = context.matches + 1;
        const neighbour = this.getNeighbourSequence(context);

        if (sequence === neighbour.sequence &&
            matches < repeatedSequencesToMutation  /* done  && */
            /* column < sequencesMatrix[row].length &&  overflow check */
            /* matches + (sequencesMatrix[row].length - column) > repeatedSequencesToMutation is worthless effort*/ ) {

            const nextContext = {
                sequencesMatrix,
                sequence: neighbour.sequence,
                row: neighbour.row,
                column: neighbour.column,
                matches,
                movementType,
            };

            return this.walkAndCountSequence(nextContext, repeatedSequencesToMutation);
        }

        return matches;
    }

    getNeighbourSequence(context: SequenceContext): any {
        let row = null;
        let column = null;

        switch (context.movementType) {
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
            sequence: context.sequencesMatrix[row] && context.sequencesMatrix[row][column] || null, /* array overflow check */
        };
    }
}
