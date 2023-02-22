import { Test, TestingModule } from '@nestjs/testing';
import { SitemapService } from './sitemap.service';

describe('SitemapService', () => {
  let service: SitemapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitemapService],
    }).compile();

    service = module.get<SitemapService>(SitemapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
