import { ServerWebSocket } from "bun";
import { nanoid } from "nanoid";
import { MessageSchema } from "./types";
import { handleWsMessage } from "./message";
import { ZodError } from "zod";

export function onOpenHandler  (ws: ServerWebSocket<unknown>) {
    ws.send('Connection opened');
    const userId = nanoid();
    ws.data = userId;
    ws.send(`Your userId : ${userId}`);
    ``;
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