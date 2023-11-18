import { ServerWebSocket } from 'bun';
import { ROOMS } from '.';
import { MessageSchema } from './types';
import { z } from 'zod';

export function handleWsMessage(
    ws: ServerWebSocket<unknown>,
    message: z.infer<typeof MessageSchema>
) {
    switch (message.type) {
        case 'SUBSCRIBE': {
            const roomId = message.topic;

            ws.subscribe(roomId);
            ws.send(`Subscribed to ${roomId}`);
            if (!ROOMS.has(roomId)) {
                ROOMS.set(roomId, [ws.data]);
            } else {
                const existingUsers = ROOMS.get(roomId);
                ROOMS.set(roomId, [...existingUsers!, ws.data]);
            }
            ws.publish(roomId, `User: ${ws.data} entered the room`);
            ws.publish(roomId, `Users list : ${ROOMS.get(roomId)!.join(', ')}`);
        }

        case 'PUBLISH': {
            ws.publish(message.topic, message.data!);
        }

        case 'UNSUBSCRIBE': {
            const roomId = message.topic;
            const existingUsers = ROOMS.get(roomId);
            const updatedUsers = existingUsers?.filter((id) => id !== ws.data);
            ROOMS.set(roomId, updatedUsers!);
            ws.unsubscribe(roomId)
            ws.close()
            ws.publish(roomId, `User: ${ws.data} left the room`);
            ws.publish(roomId, `Users list : ${ROOMS.get(roomId)!.join(', ')}`);
        }
    }
}
