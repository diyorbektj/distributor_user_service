import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmployeeModule } from './Modules/Employee/employee.module';
import { EmployeeEntity } from './Entities/employee.entity';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { AuthModule } from './Modules/Auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
      envFilePath: '.env', // Path to your .env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity, EmployeeEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity, EmployeeEntity]),
    ClientsModule.register([
      {
        name: 'EMPLOYEE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: ['employee'],
          protoPath: [
            // join(__dirname, '../src/proto/auth.proto'),
            join(__dirname, '../src/proto/employee.proto'),
          ],
        },
      },
    ]),
    EmployeeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
