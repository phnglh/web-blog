"use client"

import Head from "next/head"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import type { GetStaticProps } from "next"

interface Post {
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
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=6`)
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
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMorePosts])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 py-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Đang tải bài viết...</div>
            </div>
          ) : (
            <>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả bài viết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${(index % 6) * 100}ms` }}
                    >
                      <div className="p-6">
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">#{post.id}</span>
                          <Link
                            href={`/blog/${post.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Đọc thêm →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Đang tải thêm bài viết...</span>
                  </div>
                </div>
              )}

              {!hasMore && !loading && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">B��n đã xem hết rồi!</h3>
                    <p className="text-gray-600 mb-6">Cảm ơn bạn đã đọc tất cả bài viết của chúng tôi</p>
                    <button
                      onClick={scrollToTop}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Quay lên đầu trang
                    </button>
                  </div>
                </div>
              )}

              {hasMore && !loading && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMorePosts}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Tải thêm bài viết
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_page=1&_limit=6")
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
