import { NestExpressApplication } from '@nestjs/platform-express';

const ejsHelpers = {
    copyrightYear: (brandName: string) => {
        const _brandName = !!brandName ? brandName : 'NestJS EJS MVC boilerplate';
        return `<b>${_brandName}</b> &copy; ${new Date().getUTCFullYear()}</b>`;
    },
};

export function configEjsHelpers(app: NestExpressApplication) {
    Object.keys(ejsHelpers).forEach((helperName: string) => {
        app.setLocal(helperName, ejsHelpers[helperName]);
    });
}
