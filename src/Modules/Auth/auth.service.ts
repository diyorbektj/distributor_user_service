import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/Entities/employee.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RegisterEmployeeDto } from './dto/register-employee-dto';

@Injectable()
export class AuthService {
  private jwtSecret = process.env.JWT_SECRET;

  constructor(
    @InjectRepository(EmployeeEntity) // Важно!
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async getAll(): Promise<{ employees: EmployeeEntity[] }> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
    const employees = await queryBuilder.getMany();

    // Return EmployeeListResponse
    return { employees: employees };
  }

  async getById(id: number): Promise<EmployeeEntity | null> {
    return await this.employeeRepository.findOne({ where: { id } }); // Возвращает товары по категории
  }

  async login(body: { email: string; password: string }): Promise<any> {
    const { email, password } = body;

    const existingEmployee = await this.employeeRepository.findOne({
      where: { email },
    });

    if (!existingEmployee) {
      return { success: false, message: 'Неверный пароль или email' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(
      password,
      existingEmployee.password,
    );
    if (!isPasswordValid) {
      return { success: false, message: 'Неверный пароль или email' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    const token: string = jwt.sign(
      { id: existingEmployee.id, email: existingEmployee.email },
      this.jwtSecret || 'your-secret-key',
      {
        expiresIn: '1000d',
      },
    );

    return {
      success: true,
      message: 'ok!',
      token: token,
      employee: existingEmployee,
    };
  }

  async checkToken(data: { token: string }): Promise<any> {
    const token = data.token;

    if (!token) {
      throw new UnauthorizedException('Authentication token must be a string');
    }

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
      );

      const employee = await this.employeeRepository.findOne({
        where: { id: decoded.id },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${decoded.id} not found`);
      }

      return employee;
    } catch (error) {
      console.log('JWT Error:', error);
    }
  }

  async register(body: RegisterEmployeeDto): Promise<any> {
    const {
      email,
      password,
      login,
      phone,
      address,
      name,
      surname,
      patronymic,
    } = body;

    // Check if user with this email already exists
    const existingUser = await this.employeeRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    const hashedPassword: string = (await bcrypt.hash(password, 10)) as string;

    // Create the employee entity
    const newEmployee = this.employeeRepository.create({
      email,
      password: String(hashedPassword),
      login,
      phone,
      address,
      name,
      surname,
      patronymic,
      confirmed: true,
      role_id: 1,
      date_create: new Date(),
    });

    const savedEmployee: EmployeeEntity =
      await this.employeeRepository.save(newEmployee);

    const jwtPayload = { id: savedEmployee.id, email: savedEmployee.email };
    const accessToken: string = (await jwt.sign(jwtPayload, this.jwtSecret, {
      expiresIn: '100d',
    })) as string;

    return {
      success: true,
      message: 'User registered successfully.',
      token: accessToken,
      employee: savedEmployee,
    };
  }
}
