import {Test} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';

import {MutationsService} from './mutations.service';
import {MutationsController} from './mutations.controller';

describe('MutationsController', () => {
    let mutationsService: MutationsService;
    let server;
    let app: INestApplication;

    const mockMutationService = () => ({
        hasMutation: jest.fn(),
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [
                MutationsController,
            ],
            providers: [
                {
                    provide: MutationsService,
                    useFactory: mockMutationService,
                },
            ],
        }).compile();

        mutationsService = await module.get<MutationsService>(MutationsService);
        app = module.createNestApplication();
        server = app.getHttpServer();

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('createMutations', () => {
        it ('On matched mutation should response with 200 http status code', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(true);

            return request(server)
                .post('/mutations')
                .send({ dna: ['ACTG'] })
                .expect( HttpStatus.OK);
        });

        it ('On not matched mutation throws 403 exception', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(false);

            return request(server)
                .post('/mutations')
                .send({ dna: ['ACTG'] })
                .expect( HttpStatus.FORBIDDEN);
        });

        it ('Sending dna containing character different (Z) from allowed should response with 400 bad request status', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(false);

            return request(server)
                .post('/mutations')
                .send({ dna: ['ACTZ'] })
                .expect( HttpStatus.BAD_REQUEST);
        });

        it ('On missing dna from payload respond with 400 bad request status', async () => {
            (mutationsService.hasMutation as jest.Mock<Promise<boolean>>).mockResolvedValue(false);

            return request(server)
                .post('/mutations')
                .send({ missingDnaField: 'hello' })
                .expect( HttpStatus.BAD_REQUEST);
        });

        it ('Sending dna as an array of number should respond with 400 bad request status', async () => {
            return request(server)
                .post('/mutations')
                .send({ dna: [1, 2, 3, 4, 5] })
                .expect( HttpStatus.BAD_REQUEST);
        });


    });

});
