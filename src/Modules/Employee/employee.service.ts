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

export interface EmployeeResponse {
  id: number;
  login: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  patronymic: string;
  confirmed: boolean;
  dateCreate?: { seconds: number; nanos: number };
  server: string;
  dateDelete?: { seconds: number; nanos: number };
  roleId: number;
  createdAt?: { seconds: number; nanos: number };
  updatedAt?: { seconds: number; nanos: number };
}

export interface EmployeeListResponse {
  employees: EmployeeResponse[];
}

@Injectable()
export class EmployeeService {
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

  async removeEmployee(id: number): Promise<any> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    employee.date_delete = new Date();
    await this.employeeRepository.save(employee);

    return { message: `Employee with ID ${id} has been soft deleted` };
  }

  async updateProfile(dto: UpdateEmployeeDto): Promise<any> {
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.userId },
    });

    if (!employee) {
      return { success: false, message: 'User not found' };
    }

    if (dto.phone) employee.phone = dto.phone;
    if (dto.email) employee.email = dto.email;

    // Password change
    if (dto.oldPassword || dto.newPassword || dto.confirmNewPassword) {
      if (!dto.oldPassword || !dto.newPassword || !dto.confirmNewPassword) {
        return { success: false, message: 'All password fields are required' };
      }

      if (dto.newPassword !== dto.confirmNewPassword) {
        return { success: false, message: 'New passwords do not match' };
      }

      // Optionally, check if oldPassword is correct
      // const isMatch = await bcrypt.compare(dto.oldPassword, employee.password);
      // if (!isMatch) {
      //   return { success: false, message: 'Old password is incorrect' };
      // }

      const hashed = await bcrypt.hash(dto.newPassword, 10);
      employee.password = hashed;
    }

    try {
      const updated = await this.employeeRepository.save(employee);
      return {
        success: true,
        message: 'Profile updated successfully',
        employee: updated,
      };
    } catch (error) {
      console.error('Save error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message || error,
      };
    }
  }
}
