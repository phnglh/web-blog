import Head from "next/head"
import type { GetStaticProps, GetStaticPaths } from "next"
import { motion } from 'motion/react';

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface BlogPostProps {
  post: Post
}

const animation = {
  hide: {
    x: -30,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

export default function BlogPost({ post }: BlogPostProps) {
  const animate = true
  const description = "The name comes from “no tofu”, where “tofu” is the name given to the white squares that pop up when a character is missing from a font"
  return (
    <>
      <Head>
        <title>{`${post.title} - Blog`}</title>
        <meta name="description" content={post.body.substring(0, 160)} />
        <meta name="keywords" content="blog, bài viết, tin tức" />
        <meta property="og:title" content={`${post.title} - Blog`} />
        <meta property="og:description" content={post.body.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`/blog/${post.id}`} />
      </Head>

      <div className="min-h-screen">
        <div className="relative mb-16 mt-6 sm:mb-24 sm:mt-12">
          <motion.h1
            className="my-4 text-4xl font-bold md:text-5xl"
            {...(animate && {
              initial: animation.hide,
              animate: animation.show,
            })}
          >
            {post.title}
          </motion.h1>
          <motion.h2
            className="text-muted-foreground mb-8"
            {...(animate && {
              initial: animation.hide,
              animate: animation.show,
              transition: {
                delay: 0.1,
              },
            })}
          >
            {description}
          </motion.h2>
        </div>
        <div className="mt-8 flex flex-col justify-between lg:flex-row">
          <article className="w-full">
            <p className="text-gray-700 leading-relaxed text-lg">{post.body}</p>
          </article>
        </div>

      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const posts: Post[] = await res.json()

    const paths = posts.slice(0, 12).map((post) => ({
      params: { slug: post.id.toString() },
    }))

    return {
      paths,
      fallback: "blocking",
    }
  } catch (error) {
    console.error("Error fetching posts for paths:", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string

    const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`)

    if (!postRes.ok) {
      return { notFound: true }
    }

    const post: Post = await postRes.json()

    return {
      props: { post },
      revalidate: 3600,
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    return {
      notFound: true,
    }
  }
}
