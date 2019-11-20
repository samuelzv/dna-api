import {SequencesWalkerService, SequenceContext, SequenceWalkerMovement} from './sequences-walker.service';

describe('SequencesWalkerService', () => {
    let sequencesWalkerService: SequencesWalkerService;
    const sequencesMatrix = [
        ['A', 'T', 'G', 'T', 'G', 'A'],
        ['C', 'G', 'T', 'G', 'C', 'A'],
        ['T', 'T', 'A', 'T', 'G', 'T'],
        ['A', 'A', 'A', 'A', 'G', 'G'],
        ['C', 'C', 'C', 'C', 'T', 'A'],
        ['T', 'C', 'A', 'C', 'T', 'G'],
    ];

    beforeEach(() => {
        sequencesWalkerService = new SequencesWalkerService();
    });

    describe('getNeighbourSequence', () => {
        let context: SequenceContext;
        beforeEach(() => {
            context = {
                sequencesMatrix,
                sequence: '',
                row: 0,
                column: 0,
                matches: 0,
                movementType: SequenceWalkerMovement.Horizontal,
            };
        });

        describe('Should get the correct neighbour moving horizontally', () => {
            const movementType = SequenceWalkerMovement.Horizontal;
            it('Moving horizontally within the boundaries', () => {
                const neighbour =  sequencesWalkerService
                    .getNeighbourSequence({...context, row: 1, column: 4, movementType});

                expect(neighbour.row).toEqual(1);
                expect(neighbour.column).toEqual(5);
                expect(neighbour.sequence).toEqual('A');
            });

            it('Moving horizontally outside the boundaries', () => {
                const neighbour =  sequencesWalkerService
                    .getNeighbourSequence({...context, row: 1, column: 5, movementType});

                expect(neighbour.sequence).toBeNull();
            });
        });

        describe('Should get the correct neighbour moving vertically', () => {
            const movementType = SequenceWalkerMovement.Vertical;

            it('Moving vertically within the boundaries', () => {
                const neighbour =  sequencesWalkerService
                    .getNeighbourSequence({...context, row: 4, column: 2, movementType});

                expect(neighbour.row).toEqual(5);
                expect(neighbour.column).toEqual(2);
                expect(neighbour.sequence).toEqual('A');
            });

            it('Moving vertically outside the boundaries', () => {
                const neighbour =  sequencesWalkerService
                    .getNeighbourSequence({...context, row: 5, column: 2, movementType});

                expect(neighbour.sequence).toBeNull();
            });
        });

    });

});
