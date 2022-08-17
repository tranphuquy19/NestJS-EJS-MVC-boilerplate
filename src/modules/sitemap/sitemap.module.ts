import { Module } from '@nestjs/common';

import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
    controllers: [SitemapController],
    providers: [SitemapService],
})
export class SitemapModule {}
