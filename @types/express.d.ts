// @types/express.d.ts
import { Server as SocketIOServer } from "socket.io";

declare global {
    namespace Express {
        export interface Request {
            io: SocketIOServer; // Add the `io` property to the Request interface
        }
    }
}
