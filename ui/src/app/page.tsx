'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/Button';

export default function Home() {
    const [roomId, setRoomId] = useState('');

    const handleEnterRoom = () => {
        return <Link href="room">sfvsf</Link>;
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-[30px] p-4">Realtime Chat</div>
            <input
                className="m-2 p-2 text-black"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => {
                    setRoomId(() => e.target.value);
                }}
            ></input>
            <div className="w-[180px]">
                <Button
                    content={<Link href={`/room/${roomId}`}>Back to home</Link>}
                    handleClick={() => {}}
                />
            </div>
        </main>
    );
}
