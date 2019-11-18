import { Injectable } from '@nestjs/common';
import {MutationsResolver} from './mutations-resolver.service';

@Injectable()
export class MutationsService {
    constructor(private mutationResolver: MutationsResolver) {
    }

    hasMutations(dna: string[]): boolean {
        return this.mutationResolver.hasMutations(dna);
    }
}
