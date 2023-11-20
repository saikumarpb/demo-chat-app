import { ServerWebSocket } from 'bun';
import { ROOMS } from '.';
import { MessageSchema, WsUserSchema } from './types';
import { z } from 'zod';

export function handleWsMessage(
    ws: ServerWebSocket<unknown>,
    message: z.infer<typeof MessageSchema>
) {
    // Data from ws instance
    const wsData = ws.data as z.infer<typeof WsUserSchema>;

    switch (message.type) {
        case 'SUBSCRIBE': {
            const roomId = message.topic;

            ws.subscribe(roomId);
            ws.send(`Subscribed to ${roomId}`);

            if (!ROOMS.has(roomId)) {
                ROOMS.set(roomId, [wsData.userId]);
            } else {
                const existingUsers = ROOMS.get(roomId);
                ROOMS.set(roomId, [...existingUsers!, wsData.userId]);
            }
            ws.publish(roomId, `User: ${wsData.userId} entered the room`);
            ws.publish(roomId, `Users list : ${ROOMS.get(roomId)!.join(', ')}`);
        }

        case 'PUBLISH': {
            ws.publish(message.topic, message.data!);
        }

        case 'UNSUBSCRIBE': {
            const roomId = message.topic;
            const existingUsers = ROOMS.get(roomId);
            const updatedUsers = existingUsers?.filter(
                (id) => id !== wsData.userId
            );
            ROOMS.set(roomId, updatedUsers!);
            ws.unsubscribe(roomId);
            ws.close();
            ws.publish(roomId, `User: ${wsData.userId} left the room`);
            ws.publish(roomId, `Users list : ${ROOMS.get(roomId)!.join(', ')}`);
        }
    }
}
