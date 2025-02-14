import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <BlogPost post={post}/>
        ))}
    </div>
  )
}

function BlogPost(props) {
  let post = props.post
  return (
    <Link
      key={post.slug}
      className="block mb-6 border-b border-neutral-200 dark:border-neutral-700 pb-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
      href={`/blog/${post.slug}`}
    >
      <div className="w-full flex flex-col space-y-1">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt, false)}
        </p>
        <h2 className="text-lg md:text-xl font-medium text-neutral-900 dark:text-neutral-100">
          {post.metadata.title}
        </h2>
        {post.metadata.summary && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
            {post.metadata.summary}
          </p>
        )}
      </div>
    </Link>
  )
}
