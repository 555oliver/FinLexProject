import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InitialSchema1724600000000 } from './database/migrations/1724600000000-initial-schema';
import { UserFinancialSummary1724600000001 } from './database/migrations/1724600000001-user-financial-summary';
import { UserProfile1724600000002 } from './database/migrations/1724600000002-user-profile';
import { UserDocuments1724600000003 } from './database/migrations/1724600000003-user-documents';
import { EmailVerification1724600000004 } from './database/migrations/1724600000004-email-verification';
import { DocumentsModule } from './documents/documents.module';
import { UserDocument } from './documents/user-document.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { PaymentSummary1724600000005 } from './database/migrations/1724600000005-payment-summary';
import { PaymentHistory } from './payments/payment-history.entity';
import { PaymentsModule } from './payments/payments.module';
import { FixEncodingAndPaymentStatus1724600000006 } from './database/migrations/1724600000006-fix-encoding-and-payment-status';
import { Complaint } from './complaints/complaint.entity';
import { ComplaintsModule } from './complaints/complaints.module';
import { Complaints1724600000007 } from './database/migrations/1724600000007-complaints';
import { PasswordReset1724600000008 } from './database/migrations/1724600000008-password-reset';
import { PaymentMethod } from './payments/payment-method.entity';
import { PaymentMethods1724600000009 } from './database/migrations/1724600000009-payment-methods';
import { CaseRecord } from './cases/case.entity';
import { CasesModule } from './cases/cases.module';
import { Cases1724600000010 } from './database/migrations/1724600000010-cases';
import { MultipleCases1724600000011 } from './database/migrations/1724600000011-multiple-cases';
import { ProfileImage1724600000012 } from './database/migrations/1724600000012-profile-image';
import { ConfidentialEvaluation } from './confidential-evaluations/confidential-evaluation.entity';
import { ConfidentialEvaluationsModule } from './confidential-evaluations/confidential-evaluations.module';
import { ConfidentialEvaluations1724600000013 } from './database/migrations/1724600000013-confidential-evaluations';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL') ?? config.getOrThrow<string>('NETLIFY_DB_URL'),
        entities: [User, UserDocument, PaymentHistory, PaymentMethod, Complaint, CaseRecord, ConfidentialEvaluation],
        synchronize: false,
        migrationsRun: !config.get<string>('NETLIFY_DB_URL'),
        migrations: [InitialSchema1724600000000, UserFinancialSummary1724600000001, UserProfile1724600000002, UserDocuments1724600000003, EmailVerification1724600000004, PaymentSummary1724600000005, FixEncodingAndPaymentStatus1724600000006, Complaints1724600000007, PasswordReset1724600000008, PaymentMethods1724600000009, Cases1724600000010, MultipleCases1724600000011, ProfileImage1724600000012, ConfidentialEvaluations1724600000013],
      }),
    }),
    UsersModule,
    AuthModule,
    DocumentsModule,
    ChatbotModule,
    PaymentsModule,
    ComplaintsModule,
    CasesModule,
    ConfidentialEvaluationsModule,
  ],
})
export class AppModule {}
