import Link from 'next/link'
import { formatDate, getReviewPosts } from 'app/utils'
import { CustomMDX } from 'app/_components/mdx'
import ExportedImage from "next-image-export-optimizer";

export function ReviewPosts() {
  let allReviews = getReviewPosts()

  return (
    <div>
      {allReviews
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Review post={post}/>
        ))}
    </div>
  )
}

function Review(props) {
  let post = props.post
  return (
    <Link
      key={post.slug}
      className="flex flex-col space-y-1 mb-8"
      href={`/reviews/${post.slug}`}
    >
      <div className="flex">
        {/* Image Section */}
        <div className="flex-shrink-0 mt-1">
          <ExportedImage            
              src = {post.metadata.image || ''}
              alt={post.metadata.title} 
              className="rounded-lg relative" 
              width={120}
              height={120} />
        </div>

        {/* Text Section */}
        <div className="ml-4">
          <h2 className="text-xl font-semibold tracking-tighter">
            <CustomMDX source={post.metadata.title} />
          </h2>
          <CustomMDX className="text-gray-600 text-sm mt-1" source={post.metadata.summary} />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 w-[140px] tabular-nums">
            {formatDate(post.metadata.publishedAt, false)}
          </p>
        </div>
      </div>
    </Link>
  )
}