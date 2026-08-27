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
    const nestHandler = await getHandler();
    return await nestHandler(event, context);
};
exports.handler = handler;
//# sourceMappingURL=api.js.map