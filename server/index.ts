import { z } from 'zod';
import { onMessageHandler, onOpenHandler } from './socket';
import { WsUserSchema } from './types';

export const ROOMS = new Map<string, unknown[]>();

const server = Bun.serve({
    port: 9000,
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response('Upgrade failed :(', { status: 500 });
    },
    websocket: {
        open: onOpenHandler,
        message: onMessageHandler,
        /**
         * TODO: Close handler isn't firing as expected, Identified as a bug from bun
         * Bug : https://github.com/oven-sh/bun/issues/2071
         */
        close(ws) {
            // When a user's connection is closed , remove from active users
            const wsData = ws.data as z.infer<typeof WsUserSchema>;
            wsData.rooms.forEach((room) => {
                if (ROOMS.has(room)) {
                    const users = ROOMS.get(room)!;

                    const activeUsers = users.filter(
                        (user) => user != wsData.userId
                    );

                    ROOMS.set(room, activeUsers);
                }
            });
        },
    },
});

console.log(`Listening on http://localhost:${server.port} ..sfjlbvsljf.`);
