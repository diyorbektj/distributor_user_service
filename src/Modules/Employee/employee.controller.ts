import { Controller, Delete, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @GrpcMethod('EmployeeService', 'GetAllEmployees')
  async getAll(): Promise<any> {
    return await this.employeeService.getAll();
  }

  @GrpcMethod('EmployeeService', 'GetEmployeeById')
  async getById(data: { id: number }): Promise<any> {
    return await this.employeeService.getById(data.id);
  }

  @GrpcMethod('EmployeeService', 'UpdateProfile')
  async updateProfile(data: UpdateEmployeeDto): Promise<any> {
    return await this.employeeService.updateProfile(data);
  }

  @Delete('/:id')
  async removeEmployee(@Param('id') id: number): Promise<any> {
    return await this.employeeService.removeEmployee(id);
  }
}
