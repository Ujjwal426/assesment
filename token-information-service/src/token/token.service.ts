import { HttpException, Injectable, Logger } from '@nestjs/common';
import { TokenDto } from './dto/get-token.dto';
import AxiosUtils from './utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { KeyLog } from './entities/token.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(KeyLog)
    private readonly keyLogRepository: Repository<KeyLog>,
  ) {}

  async find(tokenDto: TokenDto): Promise<{ message: string }> {
    try {
      const { key } = tokenDto;
      const keyConfig = AxiosUtils.axiosConfigConstructor(
        'get',
        `http://localhost:9001/api/access-key/${key}`,
        null,
        {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
        null,
      );
      const isKeyExist = await axios(keyConfig);
        
      if (!isKeyExist.data) {
        throw new HttpException('Key does not exist', 400);
      }

      // Get the expiration date from the key
      const { expirationDate, requestsPerMinute } = isKeyExist.data?.key;

      // Check if the expiration date has passed with the current time
      const currentTime = new Date();
      if (expirationDate && new Date(expirationDate) < currentTime) {
        throw new HttpException('Key has expired', 400);
      }

      const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000);

      const countLogs = await this.keyLogRepository.count({
        where: {
          createdAt: Between(oneMinuteAgo, currentTime), // Use Date objects directly
          key,
        },
      });

      if (countLogs >= Number(requestsPerMinute)) {
        throw new HttpException(
          'Server is busy please try again after some time',
          400,
        );
      }

      const newAccessKeyLogs = this.keyLogRepository.create({
        key,
      });

      await this.keyLogRepository.save(newAccessKeyLogs);

      // Log successful request
      this.logger.log(`Token received successfully for key ${key}`);

      return { message: 'Token received successfully' };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
