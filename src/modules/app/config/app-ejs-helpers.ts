import { NestExpressApplication } from '@nestjs/platform-express';

const ejsHelpers = {
    copyrightYear: (brandName: string): string => {
        const _brandName = !!brandName ? brandName : 'NestJS EJS MVC boilerplate';
        return `<b>${_brandName}</b> &copy; ${new Date().getUTCFullYear()}</b>`;
    },
    // yourHelper: (args: string[]): any => { // define your EJS helpers here!
    //     return args.join('');
    // }
};

export function configEjsHelpers(app: NestExpressApplication): void {
    Object.keys(ejsHelpers).forEach((helperName: string) => {
        app.setLocal(helperName, ejsHelpers[helperName]);
    });
}
