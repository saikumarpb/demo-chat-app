import { ServerWebSocket } from "bun";
import { MessageSchema, WsUserSchema } from "./types";
import { handleWsMessage } from "./message";
import { ZodError, z } from "zod";
import { generateUniqueUserId } from "./utils";

export function onOpenHandler  (ws: ServerWebSocket<unknown>) {
    ws.send('Connection opened');
    const userId = generateUniqueUserId(5);
    ws.data  = {
        userId: userId,
        rooms: []
    } as  z.infer<typeof WsUserSchema>    
    ws.send(`Your userId : ${userId}`);
}


export function onMessageHandler  (ws: ServerWebSocket<unknown>, message: string | Buffer): void  {
    try {
        const parsedMessage = JSON.parse(message.toString());
        const finalMessage = MessageSchema.parse(parsedMessage);

        handleWsMessage(ws, finalMessage);
    } catch (e) {
        if (e instanceof ZodError) {
            console.log(e.errors);
        }
    }
}