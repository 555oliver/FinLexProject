"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const _1724600000000_initial_schema_1 = require("./database/migrations/1724600000000-initial-schema");
const _1724600000001_user_financial_summary_1 = require("./database/migrations/1724600000001-user-financial-summary");
const _1724600000002_user_profile_1 = require("./database/migrations/1724600000002-user-profile");
const _1724600000003_user_documents_1 = require("./database/migrations/1724600000003-user-documents");
const _1724600000004_email_verification_1 = require("./database/migrations/1724600000004-email-verification");
const documents_module_1 = require("./documents/documents.module");
const user_document_entity_1 = require("./documents/user-document.entity");
const user_entity_1 = require("./users/user.entity");
const users_module_1 = require("./users/users.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const _1724600000005_payment_summary_1 = require("./database/migrations/1724600000005-payment-summary");
const payment_history_entity_1 = require("./payments/payment-history.entity");
const payments_module_1 = require("./payments/payments.module");
const _1724600000006_fix_encoding_and_payment_status_1 = require("./database/migrations/1724600000006-fix-encoding-and-payment-status");
const complaint_entity_1 = require("./complaints/complaint.entity");
const complaints_module_1 = require("./complaints/complaints.module");
const _1724600000007_complaints_1 = require("./database/migrations/1724600000007-complaints");
const _1724600000008_password_reset_1 = require("./database/migrations/1724600000008-password-reset");
const payment_method_entity_1 = require("./payments/payment-method.entity");
const _1724600000009_payment_methods_1 = require("./database/migrations/1724600000009-payment-methods");
const case_entity_1 = require("./cases/case.entity");
const cases_module_1 = require("./cases/cases.module");
const _1724600000010_cases_1 = require("./database/migrations/1724600000010-cases");
const _1724600000011_multiple_cases_1 = require("./database/migrations/1724600000011-multiple-cases");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL') ?? config.getOrThrow('NETLIFY_DB_URL'),
                    entities: [user_entity_1.User, user_document_entity_1.UserDocument, payment_history_entity_1.PaymentHistory, payment_method_entity_1.PaymentMethod, complaint_entity_1.Complaint, case_entity_1.CaseRecord],
                    synchronize: false,
                    migrationsRun: !config.get('NETLIFY_DB_URL'),
                    migrations: [_1724600000000_initial_schema_1.InitialSchema1724600000000, _1724600000001_user_financial_summary_1.UserFinancialSummary1724600000001, _1724600000002_user_profile_1.UserProfile1724600000002, _1724600000003_user_documents_1.UserDocuments1724600000003, _1724600000004_email_verification_1.EmailVerification1724600000004, _1724600000005_payment_summary_1.PaymentSummary1724600000005, _1724600000006_fix_encoding_and_payment_status_1.FixEncodingAndPaymentStatus1724600000006, _1724600000007_complaints_1.Complaints1724600000007, _1724600000008_password_reset_1.PasswordReset1724600000008, _1724600000009_payment_methods_1.PaymentMethods1724600000009, _1724600000010_cases_1.Cases1724600000010, _1724600000011_multiple_cases_1.MultipleCases1724600000011],
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            documents_module_1.DocumentsModule,
            chatbot_module_1.ChatbotModule,
            payments_module_1.PaymentsModule,
            complaints_module_1.ComplaintsModule,
            cases_module_1.CasesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map