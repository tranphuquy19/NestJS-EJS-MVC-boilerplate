import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) {}

    @Get(['sitemap.xml', 'sitemap'])
    async generateSitemap(@Res() res: Response) {
        this.sitemapService.generateSitemap(res);
    }
}
