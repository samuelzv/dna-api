import { SequenceMatrix } from './sequence-matrix';
import { SequenceContext, SequenceMatrixItem, SequenceWalkerMovement } from './mutations.models';

describe('SequencesMatrix', () => {
    const matrix = new SequenceMatrix(['ATGTGA', 'CGTGCA', 'TTATGT', 'AAAAGG', 'CCCCTA', 'TCACTG']);
    /*
    const sequencesMatrix = [
           0    1    2    3    4    5
      0  ['A', 'T', 'G', 'T', 'G', 'A'],
      1  ['C', 'G', 'T', 'G', 'C', 'A'],
      2  ['T', 'T', 'A', 'T', 'G', 'T'],
      3  ['A', 'A', 'A', 'A', 'G', 'G'],
      4  ['C', 'C', 'C', 'C', 'T', 'A'],
      5  ['T', 'C', 'A', 'C', 'T', 'G'],
    ];
     */

    describe('getSequence', () => {
        it('Get the correct sequence item', () => {
            const item: SequenceMatrixItem = matrix.getSequence({row: 3, column: 3});
            expect(item.sequence).toEqual('A');
        });
    });

    describe('walk', () => {
        it('Verifies all sequences are visited by the visitor function', () => {
            let visited = 0;
            matrix.walk((context: SequenceContext) => {
                ++visited;
            }, SequenceWalkerMovement.Horizontal);
            expect(visited).toEqual(36);
        });
    });

    describe('getNeighbourSequence', () => {
        describe('Should get the correct neighbour moving horizontally', () => {
            const movementType = SequenceWalkerMovement.Horizontal;
            it('Moving horizontally within the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 1, column: 4 }, movementType);

                expect(neighbour.row).toEqual(1);
                expect(neighbour.column).toEqual(5);
                expect(neighbour.sequence).toEqual('A');
            });

            it('Moving horizontally outside the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 1, column: 5 }, movementType);
                expect(neighbour.sequence).toBeNull();
            });
        });

        describe('Should get the correct neighbour moving vertically', () => {
            const movementType = SequenceWalkerMovement.Vertical;

            it('Moving vertically within the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 4, column: 2 }, movementType);

                expect(neighbour.row).toEqual(5);
                expect(neighbour.column).toEqual(2);
                expect(neighbour.sequence).toEqual('A');
            });

            it('Moving vertically outside the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 5, column: 2 }, movementType);
                expect(neighbour.sequence).toBeNull();
            });
        });

        describe('Should get the correct neighbour moving diagonal forward', () => {
            const movementType = SequenceWalkerMovement.DiagonalForward;
            it('Moving diagonal forward within the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 3, column: 4 }, movementType);

                expect(neighbour.row).toEqual(4);
                expect(neighbour.column).toEqual(5);
                expect(neighbour.sequence).toEqual('A');
            });

            it('Moving diagonal forward outside the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 2, column: 5 }, movementType);
                expect(neighbour.sequence).toBeNull();
            });
        });

        describe('Should get the correct neighbour moving diagonal backward', () => {
            const movementType = SequenceWalkerMovement.DiagonalBack;
            it('Moving diagonal backward within the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 1, column: 1 }, movementType);

                expect(neighbour.row).toEqual(2);
                expect(neighbour.column).toEqual(0);
                expect(neighbour.sequence).toEqual('T');
            });

            it('Moving diagonal backward outside the boundaries', () => {
                const neighbour =  matrix.getNeighbourSequence({ row: 2, column: 0 }, movementType);
                expect(neighbour.sequence).toBeNull();
            });
        });

    });
});
