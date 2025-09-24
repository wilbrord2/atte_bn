import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard, RbacGuard } from '../../../auth/v1/guards';
import { HttpExceptionSchema, Role, Roles } from '../../../__helpers__';

import { UserService } from '../services/user.service';
import {
  GetStudentResDto,
  GetAllStudentsResDto,
} from '../dtos/student.v1.res.dto';
import type { Request } from 'express';
import { SignUpReqDto } from 'src/auth/v1/dtos';

@ApiTags('Students')
@Controller({ path: 'student', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Student' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: GetAllStudentsResDto, isArray: true, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getAllStudents() {
    const students = await this.userService.getAllStudents();

    return new GetAllStudentsResDto({
      message: 'Fetched all students successfully',
      students,
    });
  }

  @Get('profile')
  @ApiOperation({ summary: 'user profile' })
  @ApiBearerAuth('access-token')
  @Roles(Role.Admin, Role.Student)
  @UseGuards(AccessTokenGuard, RbacGuard)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student fetched successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getProfile(@Req() req: Request) {
    const userId = Number(req?.['user'].id);
    const studentExists = await this.userService.findOneById(userId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    return new GetStudentResDto({
      message: 'User fetched Successfully',
      student: studentExists,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student fetched successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getStudentById(@Param('id') studentId: number) {
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    return new GetStudentResDto({
      message: 'Student fetched Successfully',
      student: studentExists,
    });
  }

  @Patch('approve/:id')
  @ApiOperation({ summary: 'Approve Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student updated successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async ApproveStudent(@Param('id') studentId: number) {
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    const updatedStudent = await this.userService.ApproveStudentById(studentId);

    return new GetStudentResDto({
      message: 'Student Approved Sucessfully',
      student: updatedStudent,
    });
  }

  @Patch('reject/:id')
  @ApiOperation({ summary: 'Update Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student updated successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async RejectStudent(@Param('id') studentId: number) {
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    const updatedStudent = await this.userService.RejectStudentById(studentId);

    return new GetStudentResDto({
      message: 'Student Rejected Sucessfully',
      student: updatedStudent,
    });
  }

  @Patch('change-role/:id')
  @ApiOperation({ summary: 'Update Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student updated successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async ChangeUserRole(@Param('id') userId: number) {
    const studentExists = await this.userService.findOneById(userId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    const updatedStudent = await this.userService.ChangeUserRoleById(userId);

    return new GetStudentResDto({
      message: 'Student Rejected Sucessfully',
      student: updatedStudent,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student updated successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async updateStudentById(
    @Req() req: Request,
    @Body() body: SignUpReqDto,
    @Param('id') studentId: number,
  ) {
    const { fullname, email, phone, password } = body;
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    if (!fullname || !email || !phone || !password) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'full name, email, phone or password are required',
      });
    }

    const updatedStudent = await this.userService.updateStudentById(
      studentId,
      fullname,
      email,
      phone,
      password,
    );

    return new GetStudentResDto({
      message: 'Student Updated Sucessfully',
      student: updatedStudent,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({
    type: GetStudentResDto,
    description: 'Student deleted successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async deleteStudentById(@Param('id') studentId: number, @Req() req: Request) {
    const studentExists = await this.userService.findOneById(studentId);
    const adminId = Number(req?.['user'].id);
    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student does not exist',
      });
    }

    await this.userService.deleteStudentById(studentId, adminId);

    return new GetStudentResDto({
      message: 'Student deleted successfully',
      student: studentExists,
    });
  }
}
