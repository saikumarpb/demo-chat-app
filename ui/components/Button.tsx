'use client';

interface ButtonProps {
    content: string | JSX.Element;
    handleClick: () => void;
}

export function Button({ content, handleClick }: ButtonProps) {
    return (
        <button
            className="w-full border border-r border-white h-full"
            onClick={handleClick}
        >
            {content}
        </button>
    );
}
