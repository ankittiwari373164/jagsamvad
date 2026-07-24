export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="relative w-20 h-16">
        <div className="absolute inset-0 border-2 border-ink animate-[newspaper-open_1.1s_ease-in-out_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[family-name:var(--font-yatra)] text-lg text-masthead">
            जग
          </span>
        </div>
      </div>
      <p className="eyebrow text-xs text-ink-soft">Opening today&rsquo;s edition…</p>
    </div>
  );
}