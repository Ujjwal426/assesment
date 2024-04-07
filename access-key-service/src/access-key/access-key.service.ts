import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { UpdateAccessKeyDto, UpdateAccessKeyQueryDto } from './dto/update-access-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from './entities/access-key.entity';
import AxiosUtils from './utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import { DeleteAccessKeyDto } from './dto/delete-access-key.dto';

@Injectable()
export class AccessKeyService {
  constructor(
    @InjectRepository(AccessKey)
    private readonly accessKeyRepository: Repository<AccessKey>,
  ) {}

  async create(createAccessKeyDto: CreateAccessKeyDto): Promise<{ key: AccessKey; message: string }> {
    try {
      const { userId, requestsPerMinute, expirationTime, adminId } = createAccessKeyDto;
      const adminConfig = AxiosUtils.axiosConfigConstructor('get', `http://localhost:9000/api/user/${adminId}`, null, {}, null);
      const userConfig = AxiosUtils.axiosConfigConstructor('get', `http://localhost:9000/api/user/${userId}`, null, {}, null);
      const isUserExist = await axios(userConfig);
      const isAdminExist = await axios(adminConfig);

      if (!isAdminExist?.data?.user?.isAdmin) {
        throw new HttpException('Only admin can create the access keys', 400);
      }

      if (!isUserExist?.data) {
        throw new HttpException('User is not exist', 400);
      }

      // Generate uppercase letters access key
      const accessKey = this.generateUpperCaseKey();

      // Calculate expiration time in seconds from the current date
      const expirationInSeconds = new Date().getTime() + Number(expirationTime) * 1000;
      const expirationDate = new Date(expirationInSeconds);

      // Create a new AccessKey entity
      const newAccessKey = this.accessKeyRepository.create({
        userId,
        requestsPerMinute,
        key: accessKey,
        expirationDate: expirationDate,
        isActive: true,
      });
      await this.accessKeyRepository.save(newAccessKey);

      return {
        key: newAccessKey,
        message: 'Key created successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll(adminId: string): Promise<{ keys: AccessKey[]; message: string }> {
    try {
      const adminConfig = AxiosUtils.axiosConfigConstructor('get', `http://localhost:9000/api/user/${adminId}`, null, {}, null);
      const isAdminExist = await axios(adminConfig);
      if (!isAdminExist?.data?.user?.isAdmin) {
        throw new HttpException('Only admin can create the access keys', 400);
      }
      const keys = await this.accessKeyRepository.find();
      return { keys, message: 'List of all the keys' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findOne(key: string): Promise<{ key: AccessKey; message: string }> {
    try {
      const isKeyExist = await this.accessKeyRepository.findOne({ where: { key } });
      console.log('isKeyExist', isKeyExist);
      if (!isKeyExist) {
        throw new HttpException('Key is not exist', 400);
      }
      return { key: isKeyExist, message: 'Key details' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async update(updateAccessKeyQueryDto: UpdateAccessKeyQueryDto, updateAccessKeyDto: UpdateAccessKeyDto): Promise<{ message: string }> {
    try {
      const { key, userId } = updateAccessKeyQueryDto;
      const { requestsPerMinute, expirationTime, isActive } = updateAccessKeyDto;

      const isKeyExist = await this.accessKeyRepository.findOne({ where: { key } });

      if (!isKeyExist) {
        throw new HttpException('Key is not exist', 400);
      }

      // Initialize an object to hold the updated key fields
      const updatedKeys: Partial<UpdateAccessKeyDto> = {};

      const adminConfig = AxiosUtils.axiosConfigConstructor('get', `http://localhost:9000/api/user/${userId}`, null, {}, null);
      const isAdminExist = await axios(adminConfig);

      // Check if the user is an admin
      if (!isAdminExist?.data?.user?.isAdmin) {
        // If not an admin, check what fields the user is trying to update
        if (expirationTime !== undefined || requestsPerMinute !== undefined) {
          // If user is trying to update expirationTime or requestsPerMinute, throw an error
          throw new HttpException('Only admins can update expirationTime and requestsPerMinute', 400);
          return;
        }

        if (isAdminExist?.data?.user?.id !== isKeyExist.userId) {
          throw new HttpException('User can only update our own keys', 400);
          return;
        }
      }

      // If expirationTime or isActive is provided, update those fields
      if (expirationTime !== undefined) {
        updatedKeys.expirationTime = expirationTime;
      }
      if (isActive !== undefined) {
        updatedKeys.isActive = isActive;
      }

      if (requestsPerMinute !== undefined) {
        updatedKeys.requestsPerMinute = requestsPerMinute;
      }

      // Check if any fields were updated before proceeding with the update
      if (Object.keys(updatedKeys).length === 0) {
        throw new HttpException('No valid fields provided for update', 400);
      }

      // Update the access key in the database
      await this.accessKeyRepository.update({ key, userId }, updatedKeys);

      return { message: 'Access key updated successfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async remove(deleteAccessKeyDto: DeleteAccessKeyDto): Promise<{ message: string }> {
    try {
      const { userId, key } = deleteAccessKeyDto;

      const adminConfig = AxiosUtils.axiosConfigConstructor('get', `http://localhost:9000/api/user/${userId}`, null, {}, null);
      const isAdminExist = await axios(adminConfig);

      if (!isAdminExist?.data?.user?.isAdmin) {
        throw new HttpException('Only admin can create the access keys', 400);
      }

      const isKeyExist = await this.accessKeyRepository.findOne({ where: { key } });
      if (!isKeyExist) {
        throw new HttpException('Key is not exist', 400);
      }
      await this.accessKeyRepository.delete({ key });
      return { message: 'Key deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // Method to generate uppercase letters access key
  generateUpperCaseKey(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let key = '';
    for (let i = 0; i < 20; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }
}
