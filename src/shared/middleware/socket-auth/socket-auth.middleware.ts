// import { AuthService } from 'src/auth/services/auth.service';

import { AuthSocket, TSocketAuthMiddleware } from './socket-auth.interface';

export const SocketAuthMiddleware = (): // authService: AuthService,
TSocketAuthMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      console.log('headers', socket.handshake.auth);
      const { jwt: token } = socket.handshake.auth;
      // const { success, user } = await authService.validateToken(token);
      // if (!success) {
      //   return next(new Error('Authentication failed'));
      // }
      // socket.user = user;
      next();
    } catch (error) {
      console.log('error', error);
      next(error);
    }
  };
};
