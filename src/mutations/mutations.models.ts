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

export interface Statistics {
    countMutations: number;
    countNoMutations: number;
    ratio: number;
}
