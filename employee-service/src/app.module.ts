import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'employee-postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'employee_user'),
        password: configService.get('DB_PASSWORD', 'employee_password'),
        database: configService.get('DB_DATABASE', 'employee_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
  ],
})
export class AppModule {}