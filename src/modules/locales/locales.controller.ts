import { sessionMaxAge } from '@config';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import parseDuration from 'parse-duration';

@Controller('locales')
@ApiExcludeController()
export class LocalesController {
    @Get(':lang')
    setLang(@Param('lang') lang: string, @Res() res: Response) {
        res.cookie('lang', lang, { maxAge: parseDuration(sessionMaxAge, 'ms') });
        res.redirect('back');
    }
}
