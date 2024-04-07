import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query, UseGuards, Put } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { UpdateAccessKeyDto, UpdateAccessKeyQueryDto } from './dto/update-access-key.dto';
import { ValidationPipe } from './pipes/validation.pipe';
import { DeleteAccessKeyDto } from './dto/delete-access-key.dto';
import { JwtFormatValidationGuard } from './pipes/auth.pipe';

@Controller('/api/access-key')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtFormatValidationGuard)
  create(@Body() createAccessKeyDto: CreateAccessKeyDto) {
    return this.accessKeyService.create(createAccessKeyDto);
  }

  @Get()
  @UseGuards(JwtFormatValidationGuard)
  findAll(@Query('adminId') adminId: string) {
    return this.accessKeyService.findAll(adminId);
  }

  @Get()
  @UseGuards(JwtFormatValidationGuard)
  findOne(@Param('id') key: string) {
    return this.accessKeyService.findOne(key);
  }

  @Put()
  @UseGuards(JwtFormatValidationGuard)
  update(@Query() updateAccessKeyQueryDto: UpdateAccessKeyQueryDto, @Body() updateAccessKeyDto: UpdateAccessKeyDto) {
    return this.accessKeyService.update(updateAccessKeyQueryDto, updateAccessKeyDto);
  }

  @Delete()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtFormatValidationGuard)
  remove(@Query() deleteAccessKeyDto: DeleteAccessKeyDto) {
    return this.accessKeyService.remove(deleteAccessKeyDto);
  }
}
