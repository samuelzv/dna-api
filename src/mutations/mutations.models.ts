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
    row: number;
    column: number;
}
