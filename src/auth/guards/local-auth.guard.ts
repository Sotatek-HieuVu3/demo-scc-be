import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGY } from '../constants/strategy.constant';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AUTH_STRATEGY.LOCAL) {}
