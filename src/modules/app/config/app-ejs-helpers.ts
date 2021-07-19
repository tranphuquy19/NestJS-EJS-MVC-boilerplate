import { NestExpressApplication } from '@nestjs/platform-express';

export function configEjsHelpers(app: NestExpressApplication) {
    app.setLocal(
        'copyrightYear',
        (brandName: string) =>
            `<b>${
                !!brandName ? brandName : 'NestJS EJS MVC boilerplate'
            }</b> &copy; ${new Date().getUTCFullYear()}</b>`,
    );
}
