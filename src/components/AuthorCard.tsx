import Link from "next/link";
import Image from "next/image";
import type { Author } from "@/lib/types";

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="border hairline-strong bg-white p-5">
      <p className="eyebrow text-[10px] text-masthead font-bold mb-3">About the Author</p>
      <div className="flex items-center gap-3 mb-3">
        {author.avatar_url ? (
          <div className="relative w-12 h-12 shrink-0 border hairline overflow-hidden">
            <Image src={author.avatar_url} alt={author.name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 shrink-0 border hairline bg-ink text-paper flex items-center justify-center font-display text-lg font-bold">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-display font-bold text-sm leading-tight">{author.name}</p>
          <p className="text-xs text-ink-soft">Jagsamvad Editorial</p>
        </div>
      </div>
      {author.bio && (
        <p className="text-xs text-ink-soft leading-relaxed line-clamp-3 mb-3">{author.bio}</p>
      )}
      <div className="flex items-center gap-4">
        <Link
          href={`/author/${author.slug}`}
          className="text-xs font-semibold text-masthead hover:underline"
        >
          Full Profile →
        </Link>
        {author.linkedin_url && (
          <a
            href={author.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0A66C2] hover:underline"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}