import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/entity/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { email, password } = createAdminDto;
    const isExist = await this.adminRepository.findOne({ where: { email } });
    if (isExist) throw new ConflictException('already Exist');
    const salt = parseInt(process.env.SATL);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const admin = await this.adminRepository.save({
        email,
        password: hashedPassword,
      });
    } catch (e) {
      throw new Error(e);
    }

    return { statusCode: HttpStatus.OK, data: 'success' };
  }
}
