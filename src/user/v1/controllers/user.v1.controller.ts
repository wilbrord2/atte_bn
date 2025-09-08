import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
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
  getStudentQueryParams,
  StudentsResDto,
} from '../dtos/student.v1.res.dto';
import type { Request } from 'express';

@ApiTags('Students')
@Controller({ path: 'students', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Get All Student' })
  //   @ApiBearerAuth('access-token')
  //   @UseGuards(AccessTokenGuard, RbacGuard)
  //   @Roles(Role.Client)
  @ApiResponse({ type: StudentsResDto, isArray: true, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getAllStudents() {
    const students = await this.userService.getAllStudents();

    return new StudentsResDto({
      message: 'Fetched all students successfully',
      students: students,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Student by ID' })
  //   @ApiBearerAuth('access-token')
  //   @UseGuards(AccessTokenGuard, RbacGuard)
  //   @Roles(Role.Client)
  @ApiResponse({
    type: StudentsResDto,
    description: 'Student fetched successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getStudentById(@Query() query: getStudentQueryParams) {
    const studentId = query.id;
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    return new StudentsResDto({
      message: 'Fetched student successfully',
      ...studentExists,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Client)
  @ApiResponse({
    type: StudentsResDto,
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
    @Query() query: getStudentQueryParams,
  ) {
    const studentId = query.id;
    const { name, email, phone } = req.body;
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    if (!name || !email || !phone) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Name, email and phone are required',
      });
    }

    const updatedStudent = await this.userService.updateStudentById(
      studentId,
      name,
      email,
      phone,
    );

    return new StudentsResDto({
      message: 'Student updated successfully',
      ...updatedStudent,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Student by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Client)
  @ApiResponse({
    type: StudentsResDto,
    description: 'Student deleted successfully',
    status: 200,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async deleteStudentById(@Query() query: getStudentQueryParams) {
    const studentId = query.id;
    const studentExists = await this.userService.findOneById(studentId);

    if (!studentExists) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Student not found',
      });
    }

    await this.userService.deleteStudentById(studentId);

    return new StudentsResDto({
      message: 'Student deleted successfully',
      ...studentExists,
    });
  } 
}
