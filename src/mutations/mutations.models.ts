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
