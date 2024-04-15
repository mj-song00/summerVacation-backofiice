import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/entity/admin.entity';
import { LoginDto } from './dto/logIn.dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, sign } from 'jsonwebtoken';
import { ROLE, TOKEN_TYPE } from './admin.enum';

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

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const admin = await this.adminRepository.findOne({ where: { email } });
    const validatePassword = await bcrypt.compare(password, admin.password);

    if (!admin || !validatePassword) {
      throw new BadRequestException('please check email or password');
    }
    const accessToken = await this.createAccessToken(admin);
    const refreshToken = await this.createRefreshToken(admin);

    return { accessToken, refreshToken };
  }

  async createAccessToken(admin: Pick<Admin, 'id'>): Promise<string> {
    const payload: JwtPayload = {
      sub: admin.id,
      role: ROLE.USER,
      type: TOKEN_TYPE.ACCESS_TOKEN,
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn = '2d';

    if (!secret) throw new Error();

    const accessToken: string = sign(payload, secret, { expiresIn });

    return accessToken;
  }

  async createRefreshToken(admin: Pick<Admin, 'id'>): Promise<string> {
    const payload: JwtPayload = {
      sub: admin.id,
      role: ROLE.USER,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn = '7d';

    if (!secret) throw new Error();

    const refreshToken: string = sign(payload, secret, { expiresIn });

    return refreshToken;
  }
}
