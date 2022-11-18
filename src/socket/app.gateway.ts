import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { AuthService } from 'src/auth/services/auth.service';
import { AppLogger } from 'src/shared/logger/logger.service';
import { SocketAuthMiddleware } from 'src/shared/middleware/socket-auth/socket-auth.middleware';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

@WebSocketGateway()
@Injectable()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server = null;
  ctx: RequestContext;

  constructor(
    private readonly logger: AppLogger,
  ) // private readonly authService: AuthService,
  {
    this.logger.setContext(AppGateway.name);
    this.ctx = new RequestContext();
  }

  async afterInit(server: Server): Promise<void> {
    // const middleware = SocketAuthMiddleware(this.authService);
    // server.use(middleware);
    this.logger.log(this.ctx, 'Initialized socket');
  }

  handleDisconnect(client: Socket): void {
    this.logger.verbose(this.ctx, `Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.verbose(this.ctx, `Client connected: ${client.id}`);
  }

  getServer(): Server {
    return this.server;
  }
}
