interface CountdownProps {
  count: number;
  message?: string;
}

export default function Countdown({ count, message = "Game starting..." }: CountdownProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-9xl font-bold text-white mb-4 animate-pulse">
          {count}
        </div>
        <p className="text-2xl text-white/80">{message}</p>
      </div>
    </div>
  );
}
