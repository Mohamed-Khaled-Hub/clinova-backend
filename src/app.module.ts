// Core
import 'dotenv/config'
import { JwtModule } from '@nestjs/jwt'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
// Guards
import { AuthGuard } from '@/modules/auth/guards/auth.guard'
// Middlewares
import { LoggerMiddleware } from '@/common/middleware/logger.middleware'
// Modules
import { AuthModule } from '@/modules/auth/auth.module'
import { ExpenseModule } from '@/modules/expense/expense.module'
import { PatientModule } from '@/modules/patient/patient.module'
import { PermissionModule } from '@/modules/permission/permission.module'
import { PriceCatalogModule } from '@/modules/price-catalog/price-catalog.module'
import { RevenueModule } from '@/modules/revenue/revenue.module'
import { RoleModule } from '@/modules/role/role.module'
import { SettingsModule } from '@/modules/settings/settings.module'
import { UserModule } from '@/modules/user/user.module'
import { VisitModule } from '@/modules/visit/visit.module'

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
