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
  @ApiResponse({ type: GetClassroomResDto, status: 200 })
  async getClassRoomById(@Param('id') id: number) {
    const classroom = await this.classroomService.getOneClassroomById(id);
    if (!classroom) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Classroom not found',
      });
    }
    return new GetClassroomResDto({
      message: 'Classroom fetched successfully',
      classroom,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update Classroom by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetClassroomResDto, status: 200 })
  async updateClassRoomById(
    @Param('id') id: number,
    @Body() body: ClassroomReqDto,
  ) {
    const updated = await this.classroomService.updateClassroomById(id, body);
    if (!updated) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Classroom not found',
      });
    }
    return new GetClassroomResDto({
      message: 'Classroom updated successfully',
      classroom: updated,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Classroom by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetClassroomResDto, status: 200 })
  async deleteClassNameById(@Param('id') id: number) {
    const deleted = await this.classroomService.deleteClassroomById(id);
    if (!deleted) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        message: 'Classroom not found',
      });
    }
    return new GetClassroomResDto({
      message: 'Classroom deleted successfully',
      classroom: deleted,
    });
  }
}
