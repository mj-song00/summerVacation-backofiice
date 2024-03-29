import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?])(?=.*[a-zA-Z]).{8,}$/,
    {
      message:
        '비밀번호는 최소 8자 이상, 영문, 특수문자 1개를 포함해야 합니다.',
    },
  )
  @Transform(({ value, obj }) => {
    const emailPart = obj.email.split('@')[0]; // 이메일에서 @ 앞 부분
    const trimmedValue = value.replace(/\s/g, ''); // 모든 공백 제거
    if (trimmedValue.includes(emailPart) || emailPart.includes(trimmedValue)) {
      throw new BadRequestException(
        '비밀번호에는 이메일과 동일한 문자열을 포함할 수 없습니다',
      );
    }
    return trimmedValue;
  })
  password: string;
}
