import {Controller, Get, Res} from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    async getApp(@Res() res) {
        return res.redirect('/api') ;
    }
}
