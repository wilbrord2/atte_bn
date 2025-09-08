// import { Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { AccessTokenGuard, RbacGuard } from '../../../auth/v1/guards';
// import { HttpExceptionSchema, Role, Roles } from '../../../__helpers__';
// import { Request } from 'express';

// @ApiTags('Users')
// @Controller({ path: 'users', version: '1' })
// export class UserController {
//   constructor() {}

//   @Post('complete-profile')
//   @ApiOperation({ summary: 'Complete User Profile' })
//   @ApiBearerAuth('access-token')
//   @UseGuards(AccessTokenGuard, RbacGuard)
//   @Roles(Role.Client)
//   @ApiBody({ type: CreateInvestmentGoalReqDto })
//   @ApiResponse({
//     type: GetInvestmentGoalResDto,
//     status: HttpStatus.CREATED,
//   })
//   @ApiResponse({ type: HttpExceptionSchema, status: 400 })
//   @ApiResponse({ type: HttpExceptionSchema, status: 401 })
//   @ApiResponse({ type: HttpExceptionSchema, status: 201 })
//   @ApiResponse({ type: HttpExceptionSchema, status: 500 })
//   @ApiResponse({ type: HttpExceptionSchema, status: 403 })
//   @ApiResponse({ type: HttpExceptionSchema, status: 404 })
//   async completeProfile(@Req() req: Request) {
//     const userId = Number(req?.['user'].id);
//     return await this.userService.completeProfile(userId);
//   }
// }
