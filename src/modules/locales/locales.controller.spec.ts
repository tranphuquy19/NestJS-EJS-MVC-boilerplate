import { Test, TestingModule } from '@nestjs/testing';
import { LocalesController } from './locales.controller';

describe('LocalesController', () => {
    let controller: LocalesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocalesController],
        }).compile();

        controller = module.get<LocalesController>(LocalesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
