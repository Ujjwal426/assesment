import { Module } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { AccessKeyController } from './access-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from './entities/access-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  controllers: [AccessKeyController],
  providers: [AccessKeyService],
  exports: [AccessKeyService],
})
export class AccessKeyModule {}
