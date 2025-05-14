export class UpdateEmployeeDto {
  userId: number;
  email: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
