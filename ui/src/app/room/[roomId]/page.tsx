'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './styles.css';
import { Button } from '../../../../components/Button';

export default function Room({ params }: { params: { roomId: string } }) {
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        'ws://localhost:9000'
    );

    useEffect(() => {
        const subscribeMessage: {
            topic: string;
            type: 'SUBSCRIBE';
        } = { topic: params.roomId, type: 'SUBSCRIBE' };

        sendMessage(JSON.stringify(subscribeMessage));
    }, []);

    useEffect(() => {
        setMessageHistory((prev) => {
            if (lastMessage?.data) {
                if ((lastMessage.data as string).includes('active-users')) {
                    const message = lastMessage.data as string;
                    const users = message.split(':')[1].split(',');
                    setActiveUsers(() => users);
                } else {
                    const updatedMessageHistory = [...prev, lastMessage.data];
                    console.log(updatedMessageHistory);
                    return updatedMessageHistory;
                }
            }
            return prev;
        });
    }, [lastMessage]);

    const sendUserMessage = () => {

      sendMessage(JSON.stringify({
        topic: params.roomId,
        data: message,
        type: "PUBLISH"
      }))
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-[30px] p-4">{`Room: ${params.roomId}`}</div>
            <div className="min-h-[480px] max-h-[540px] w-full border border-white rounded overflow-y-auto scroll-m-1 flex flex-row">
                <div className="w-auto left-0 text-center border-r flex flex-col">
                    <div className=" text-green-500 border-b ">
                        Active users
                    </div>
                    <div className="h-full  overflow-auto">
                        {activeUsers.map((userId, index) => {
                            return (
                                <div key={index} className="p-2">
                                    {userId}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-full relative">
                    <div className="right-0   border-l h-[90%] w-full overflow-auto absolute">
                        {messageHistory.map((message, index) => (
                            <ul key={index}>
                                {<div className="p-2">{message}</div>}
                            </ul>
                        ))}
                    </div>
                    <div className="h-[10%] absolute bottom-0 border-t w-full flex items-center p-2">
                        <input
                            className="h-[90%] w-[90%] text-black p-2"
                            value={message}
                            onChange={(e) => {
                                setMessage(() => e.target.value);
                            }}
                        ></input>
                        <div className="w-fit flex items-center pl-2">
                            <Button content="Send" handleClick={sendUserMessage} />
                        </div>
                    </div>
                </div>
            </div>
            <Link href="/">Home</Link>
        </main>
    );
}
