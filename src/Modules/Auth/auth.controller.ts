import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterEmployeeDto } from './dto/register-employee-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'CheckToken')
  async checkToken(data: { token: string }): Promise<any> {
    return this.authService.checkToken(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: { email: string; password: string }): Promise<any> {
    return await this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterEmployeeDto): Promise<any> {
    return await this.authService.register(data);
  }
}
