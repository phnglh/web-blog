import { Post } from '@/pages';
import PostLatest from './post-latest';

type PostProps = {
  posts: Post[]
};

export default function Posts({ posts }: PostProps) {

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h3 className="text-2xl">All Posts</h3>
        <PostLatest posts={posts} />
      </div>
    </div>
  );
}
