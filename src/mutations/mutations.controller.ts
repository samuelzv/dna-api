import {Body, Controller, ForbiddenException, Get, HttpCode, Logger, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUseTags} from '@nestjs/swagger';

import {CreateMutationDto} from './dto/create-mutation.dto';
import {MutationsService} from './mutations.service';
import {Statistics} from './mutations.models';

@ApiUseTags('mutations')
@Controller('mutations')
export class MutationsController {
    private logger = new Logger('MutationsController');
    constructor(private mutationService: MutationsService) {
    }

    @Post()
    @HttpCode(200) // normally post request responds with 201 so we need to override that
    @UsePipes(ValidationPipe)
    @ApiOkResponse({ description: 'Mutation has been found.'})
    @ApiForbiddenResponse({ description: 'Not found mutation.'})
    @ApiOperation({
        title: 'Detects mutations over a DNA sequence',
        description: 'Mutation found returns 200 status code, otherwise returns 403 forbidden status',
    })
    async createMutations(@Body() createMutationDto: CreateMutationDto) {
        const { dna } = createMutationDto;
        const hasMutation = await this.mutationService.hasMutation(dna);

        if (!hasMutation) {
            throw new ForbiddenException('DNA has not mutation'); // not found
        }

        return { message: 'Mutation found!' }; // success
    }

    @Get('/stats')
    @ApiOperation({ title: 'Get mutation stats results' })
    @ApiOkResponse({ description: 'Object containing stats results.', type: Statistics })
    async getMutationStats() {
        return this.mutationService.getStatistics();
    }
}
