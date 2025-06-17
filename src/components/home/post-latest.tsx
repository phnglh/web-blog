import { Post } from "@/pages";
import Link from "next/link";

type PostLatestProps = {
  posts: Array<Post>;
};

export default function PostLatest({ posts }: PostLatestProps) {
  const year = "2025"
  return (
    <div className="space-y-4">
        <div className="space-y-4 relative pt-9" key={year}>
          <h3 className="text-4xl text-primary/10 font-instrument-serif absolute pointer-events-none user-select-none top-4 left-0">
            {year}
          </h3>
          <ul className="space-y-4">
            {posts.map((entry) => (
              <li className="border-b border-border pb-4" key={entry.id}>
                  <Link href={`/blog/${entry.id}`}>
                  <span className="font-medium font-serif block md:inline">
                    {entry.title}
                  </span>
                  </Link>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}
