import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('health-check')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {};
  }
}
