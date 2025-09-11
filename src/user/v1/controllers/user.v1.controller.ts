import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
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
import express from 'express';
import { UserService } from '../services/user.service';
import {
  GetStudentResDto,
  GetAllStudentsResDto,
} from '../dtos/student.v1.res.dto';
import type { Request } from 'express';
import { SignUpReqDto } from 'src/auth/v1/dtos';

@ApiTags('Students')
@Controller({ path: 'students', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Get All Student' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
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

    console.log(updatedStudent);

    return new GetStudentResDto({
      message: 'Student Updated Sucessfully',
      student: updatedStudent,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
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
  async deleteStudentById(@Param('id') studentId: number) {
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student does not exist',
      });
    }

    await this.userService.deleteStudentById(studentId);

    return new GetStudentResDto({
      message: 'Student deleted successfully',
      student: studentExists,
    });
  }
}
