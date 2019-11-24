import {ApiModelProperty} from '@nestjs/swagger';

export enum MovementDirection {
    Horizontal,
    Vertical,
    DiagonalForward,
    DiagonalBack,
}

export interface Sequence {
    sequence: string;
    row: number;
    column: number;
}

export interface SequenceContext {
    row: number;
    column: number;
}

export class Statistics {
    @ApiModelProperty({
        description: 'Number of dna sequences evaluated having mutation',
    })
    countMutations: number;
    @ApiModelProperty({
        description: 'Number of dna sequences evaluated which dont have mutation',
    })
    countNoMutations: number;
    @ApiModelProperty({
        description: 'Relation between matching / not matching mutations',
    })
    ratio: number;
}
