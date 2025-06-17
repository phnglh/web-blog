import Head from "next/head"
import { useState, useEffect, useCallback } from "react"
import type { GetStaticProps } from "next"
import Posts from "@/components/home/post"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface HomeProps {
  initialPosts: Post[]
}

export default function Home({ initialPosts }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=12`)
      const newPosts: Post[] = await response.json()

      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPosts];
        })
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      loadMorePosts()
    }
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [loadMorePosts])

  return (
    <>
      <Head>
        <title>Blog - Trang chủ</title>
        <meta name="description" content="Khám phá những bài viết thú vị và hữu ích trên blog của chúng tôi" />
        <meta name="keywords" content="blog, bài viết, tin tức, công nghệ" />
        <meta property="og:title" content="Blog - Trang chủ" />
        <meta property="og:description" content="Khám phá những bài viết thú vị và hữu ích trên blog của chúng tôi" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="/" />
      </Head>

     <div className="container px-3 py-16 relative">
      <Posts posts={posts} />

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Đang tải thêm bài viết...</span>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_page=1&_limit=12")
    const initialPosts: Post[] = await res.json()

    return {
      props: {
        initialPosts,
      },
      revalidate: 3600,
    }
  } catch (error) {
    console.error("Error fetching initial posts:", error)
    return {
      props: {
        initialPosts: [],
      },
      revalidate: 60,
    }
  }
}
