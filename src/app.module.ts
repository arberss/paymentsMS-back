import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ManagementModule } from './modules/management/management.module';
import { UserModule } from './modules/user/user.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { ActionsModule } from './modules/actions/actions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ManagementModule,
    UserModule,
    StatusesModule,
    ActionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
