/**
 * Placeholder ad slot.
 *
 * Once your AdSense application is approved, replace the contents of this
 * component with your <ins class="adsbygoogle"> unit and load the AdSense
 * script in `src/app/layout.tsx`. Keeping the slot as a labelled component
 * makes it easy to drop units into the layout without hunting through pages.
 */
export default function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="border hairline my-8 py-8 text-center bg-paper-dim">
      <p className="eyebrow text-[10px] text-ink-soft">{label}</p>
    </div>
  );
}
