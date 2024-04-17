import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from './admin.enum';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/logIn.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('/sign-in')
  login(@Body() loginDto: LoginDto) {
    return this.adminService.signIn(loginDto);
  }

  @Get('')
  //@Roles(ROLE.USER)
  getAdmin() {
    return this.adminService.findAll();
  }
}
