import { Controller, Post, Body } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  checkWords(@Body() body): Promise<string[]> {
    const { content = '' } = body
    return this.appService.checkWords(content)
  }
}
