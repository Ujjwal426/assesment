"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const axiosUtils_1 = require("./utils/AxiosUtils/axiosUtils");
const axios_1 = require("axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_entity_1 = require("./entities/token.entity");
let TokenService = TokenService_1 = class TokenService {
    constructor(keyLogRepository) {
        this.keyLogRepository = keyLogRepository;
        this.logger = new common_1.Logger(TokenService_1.name);
    }
    async find(tokenDto) {
        try {
            const { key } = tokenDto;
            const keyConfig = axiosUtils_1.default.axiosConfigConstructor('get', `http://localhost:9001/api/access-key/${key}`, null, {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            }, null);
            const isKeyExist = await (0, axios_1.default)(keyConfig);
            if (!isKeyExist.data) {
                throw new common_1.HttpException('Key does not exist', 400);
            }
            const { expirationDate, requestsPerMinute } = isKeyExist.data?.key;
            const currentTime = new Date();
            if (expirationDate && new Date(expirationDate) < currentTime) {
                throw new common_1.HttpException('Key has expired', 400);
            }
            const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000);
            const countLogs = await this.keyLogRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(oneMinuteAgo, currentTime),
                    key,
                },
            });
            console.log('countLogs', countLogs);
            if (countLogs >= Number(isKeyExist?.data?.key?.requestsPerMinute)) {
                throw new common_1.HttpException('Server is busy please try again after some time', 400);
            }
            const newAccessKeyLogs = this.keyLogRepository.create({
                key,
            });
            await this.keyLogRepository.save(newAccessKeyLogs);
            this.logger.log(`Token received successfully for key ${key}`);
            return { message: 'Token received successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, 400);
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_entity_1.KeyLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TokenService);
//# sourceMappingURL=token.service.js.map