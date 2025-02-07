import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/_components/mdx'
import ExportedImage from "next-image-export-optimizer";
import { formatDate, getReviewPosts } from 'app/utils'
import { baseUrl } from 'app/sitemap'

function stripSpecialCharacters(input: string): string {
  return input.replace(/[^a-zA-Z0-9\s]/g, '');
}

export async function generateStaticParams() {
  let posts = getReviewPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getReviewPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata

  title = stripSpecialCharacters(title);

  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/reviews/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Reviews({ params }) {
  let post = getReviewPosts().find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <section>
      <ExportedImage            
            src = {post.metadata.image || ''}
            alt={post.metadata.title} 
            className="rounded-lg relative" 
            width={1000}
            height={1000} />
      <h1 className="title font-semibold text-2xl tracking-tighter mt-3">
        <CustomMDX source={post.metadata.title} />
      </h1>
      <h2 className='subtitle font-medium text-lg tracking-tight mt-1'>
        <CustomMDX source={post.metadata.summary} />
      </h2>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
