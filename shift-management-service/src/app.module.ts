import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ShiftModule } from './shift/shift.module';
import { ShiftTypeModule } from './shift-type/shift-type.module';
import { ShiftConfigurationModule } from './shift-configuration/shift-configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'shift-postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'shift_user'),
        password: configService.get('DB_PASSWORD', 'shift_password'),
        database: configService.get('DB_DATABASE', 'shift_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    ShiftModule,
    ShiftTypeModule,
    ShiftConfigurationModule,
  ],
})
export class AppModule {}