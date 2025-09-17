import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { ClassManagementService } from '../services/classroom.service';
import {
  GetClassroomResDto,
  ClassroomReqDto,
  GetAllClassroomsResDto,
} from '../dtos';
import type { Request } from 'express';
import { SignUpReqDto } from 'src/auth/v1/dtos';

@ApiTags('Class-Management')
@Controller({ path: 'class', version: '1' })
export class ClassManagementController {
  constructor(private readonly classroomService: ClassManagementService) {}
  @Post()
  @ApiBody({ type: ClassroomReqDto })
  @ApiOperation({ summary: 'create a classroom' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetClassroomResDto, status: HttpStatus.OK })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async CreateClassRoom(@Body() body: ClassroomReqDto, @Req() req: Request) {
    const userId = Number(req?.['user'].id);
    const is_verified = await this.classroomService.findVerifiedOneById(userId);
    if (!is_verified) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'You are not allowed to perform this action',
      });
    } else {
      const classroom = await this.classroomService.create(userId, body);
      console.log({ classroom });
      return new GetClassroomResDto({
        message: 'Classroom created successfully',
        classroom,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Classroom' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetAllClassroomsResDto, isArray: true, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getAllClassRooms() {
    const classrooms = await this.classroomService.getAllClassrooms();
    console.log(classrooms)
    return new GetAllClassroomsResDto({
      message: 'Fetched all students successfully',
      classrooms,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Classroom by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetClassroomResDto,
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
    // const classroom = await this.classroomService.findOneById(studentId);
    // if (!classroom) {
    //   throw new BadRequestException({
    //     status: HttpStatus.NOT_FOUND,
    //     message: 'Student not found',
    //   });
    // }
    // return new GetClassroomResDto({
    //   message: 'Student fetched Successfully',
    //   classroom: classroom,
    // });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Classroom by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetClassroomResDto,
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
    // const { fullname, email, phone, password } = body;
    // const studentExists = await this.classroomService.findOneById(studentId);
    // if (!studentExists) {
    //   throw new BadRequestException({
    //     status: HttpStatus.NOT_FOUND,
    //     message: 'Student not found',
    //   });
    // }
    // if (!fullname || !email || !phone || !password) {
    //   throw new BadRequestException({
    //     status: HttpStatus.BAD_REQUEST,
    //     message: 'full name, email, phone or password are required',
    //   });
    // }
    // const updatedStudent = await this.classroomService.updateStudentById(
    //   studentId,
    //   fullname,
    //   email,
    //   phone,
    //   password,
    // );
    // console.log(updatedStudent);
    // return new GetClassroomResDto({
    //   message: 'Student Updated Sucessfully',
    //   classroom: updatedStudent,
    // });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Classroom by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetClassroomResDto,
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
    // const studentExists = await this.classroomService.findOneById(studentId);
    // if (!studentExists) {
    //   throw new BadRequestException({
    //     status: HttpStatus.NOT_FOUND,
    //     message: 'Student does not exist',
    //   });
    // }
    // await this.classroomService.deleteStudentById(studentId);
    // return new GetClassroomResDto({
    //   message: 'Student deleted successfully',
    //   classroom: studentExists,
    // });
  }
}
