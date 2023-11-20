import { z } from 'zod';

export const MessageSchema = z
    .object({
        topic: z.string(),
        type: z.enum(['SUBSCRIBE', 'UNSUBSCRIBE', 'PUBLISH']),
        data: z.string().optional(),
    })
    .refine((xs) => {
        if (xs.type === 'PUBLISH') {
            return typeof xs.data === 'string'; // Condition for PUBLISH type
        }
        return true; // For other types like SUBSCRIBE and UNSUBSCRIBE
    });

export const WsUserSchema = z.object({
    userId: z.string(),
    rooms: z.array(z.string()),
});
