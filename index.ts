import { onMessageHandler, onOpenHandler } from './socket';

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
        close(ws) {
            // When a user's connection is closed , remove from active users
        }
    },
});



console.log(`Listening on http://localhost:${server.port} ..sfjlbvsljf.`);
