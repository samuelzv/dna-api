import {Injectable, Logger} from '@nestjs/common';

export enum SequenceWalkerMovement {
    Horizontal,
    Vertical,
    DiagonalForward,
    DiagonalBack,
}

interface SequenceContext {
    sequencesMatrix: string[][];
    sequence: string;
    row: number;
    column: number;
    matches: number;
    movementType: SequenceWalkerMovement;
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

    countMutations(sequencesMatrix: string[][], repeatedSequencesToMutation: number, movementType: SequenceWalkerMovement): number {
        let mutations = 0;

        sequencesMatrix.forEach((rowSequence: string[], row: number) => {
            this.logger.debug('-------------------');
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

    private walkAndCountSequence(context: SequenceContext, repeatedSequencesToMutation: number): number {
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

    private getNeighbourSequence(context: SequenceContext): any {
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
