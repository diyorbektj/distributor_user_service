import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['employee', 'auth'], // support multiple packages
        protoPath: [
          join(__dirname, '../src/proto/employee.proto'),
          join(__dirname, '../src/proto/auth.proto'),
        ],
        url: '0.0.0.0:3003',
        loader: {
          includeDirs: [join(__dirname, '../src/proto')], // to resolve `import "common.proto";`
        },
      },
    },
  );
  await app.listen();
  console.log('Service running on 0.0.0.0:3003');
}
bootstrap();
