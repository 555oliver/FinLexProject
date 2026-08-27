"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const serverless_http_1 = require("serverless-http");
const app_module_1 = require("../../src/app.module");
let cachedHandler;
async function getHandler() {
    if (cachedHandler)
        return cachedHandler;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['error', 'warn', 'log'] });
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    cachedHandler = (0, serverless_http_1.default)(app.getHttpAdapter().getInstance());
    return cachedHandler;
}
const handler = async (event, context) => {
    try {
        const nestHandler = await getHandler();
        return await nestHandler(event, context);
    }
    catch (error) {
        console.error('No fue posible iniciar la API de FinLex.', error);
        return {
            statusCode: 500,
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ message: 'No fue posible iniciar el servicio. Revise los registros de la Function api.' }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=api.js.map