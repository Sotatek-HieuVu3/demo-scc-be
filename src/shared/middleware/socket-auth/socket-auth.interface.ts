import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user: Partial<any>;
}

export type TSocketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
