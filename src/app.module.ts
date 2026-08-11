// Core
import 'dotenv/config'
import { JwtModule } from '@nestjs/jwt'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
// Guards
import { AuthGuard } from 'src/modules/auth/guards/auth.guard'
// Middlewares
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware'
// Modules
import { AuthModule } from 'src/modules/auth/auth.module'
import { ExpenseModule } from 'src/modules/expense/expense.module'
import { PatientModule } from 'src/modules/patient/patient.module'
import { PermissionModule } from 'src/modules/permission/permission.module'
import { PriceCatalogModule } from 'src/modules/price-catalog/price-catalog.module'
import { RevenueModule } from 'src/modules/revenue/revenue.module'
import { RoleModule } from 'src/modules/role/role.module'
import { SettingsModule } from 'src/modules/settings/settings.module'
import { UserModule } from 'src/modules/user/user.module'
import { VisitModule } from 'src/modules/visit/visit.module'
import { FinanceModule } from './modules/finance/finance.module'
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'
import { MedicalDocumentsModule } from 'src/modules/medical-documents/medical-documents.module'

const databaseUrl = process.env.DATABASE_URL as string

@Module({
    imports: [
        MongooseModule.forRoot(databaseUrl),
        PermissionModule,
        RoleModule,
        UserModule,
        AuthModule,
        JwtModule,
        VisitModule,
        SettingsModule,
        PriceCatalogModule,
        RevenueModule,
        ExpenseModule,
        PatientModule,
        FinanceModule,
        CloudinaryModule,
        MedicalDocumentsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
