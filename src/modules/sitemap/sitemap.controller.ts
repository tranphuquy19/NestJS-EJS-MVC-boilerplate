import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Response } from 'express';

import { SitemapService } from './sitemap.service';

@Controller()
@ApiExcludeController()
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) {}

    @Get(['sitemap.xml', 'sitemap'])
    async generateSitemap(@Res() res: Response): Promise<void> {
        this.sitemapService.generateSitemap(res);
    }
}
