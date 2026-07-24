type IconProps = { size?: number; className?: string };

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.6a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.5A3 3 0 0 0 .5 6.6 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.4 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.4zM9.6 15.6V8.4l6.3 3.6z" />
    </svg>
  );
}

export function XIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TelegramIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 4.1 2.6 11.7c-1.1.45-1.1 1.07-.2 1.35l4.95 1.55L18.9 7.4c.5-.3.96-.14.58.19L9.9 15.1l-.35 5.1c.5 0 .72-.23.99-.5l2.4-2.32 4.98 3.68c.92.5 1.58.24 1.81-.85l3.28-15.5c.33-1.33-.5-1.93-1.4-1.5z" />
    </svg>
  );
}

export function WhatsappIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.94-.27-.1-.46-.15-.66.15-.2.3-.76.94-.93 1.13-.17.2-.35.22-.64.08-.3-.15-1.24-.46-2.37-1.47a8.9 8.9 0 0 1-1.64-2.05c-.17-.3 0-.45.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35z" />
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.6 0 .4 5.2.4 11.6c0 2.04.54 4.03 1.55 5.79L0 24l6.78-1.78a11.6 11.6 0 0 0 5.22 1.24h.01c6.4 0 11.6-5.2 11.6-11.6a11.5 11.5 0 0 0-3.11-8.36zM12 21.4h-.01a9.7 9.7 0 0 1-4.93-1.35l-.35-.21-3.68.97.98-3.6-.23-.37a9.6 9.6 0 0 1-1.48-5.14c0-5.3 4.3-9.6 9.7-9.6a9.6 9.6 0 0 1 6.86 2.84A9.5 9.5 0 0 1 21.6 11.6c0 5.3-4.3 9.6-9.6 9.6z" />
    </svg>
  );
}