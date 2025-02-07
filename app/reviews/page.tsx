import { ReviewPosts } from 'app/_components/review_posts'

export const metadata = {
  title: 'Reviews',
  description: 'Thoughts about some of my favorite peices of media.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-2 tracking-tighter">Reviews</h1>
      <p className='mb-8'>Thoughts about some of my favorite pieces of media</p>
      <ReviewPosts />
    </section>
  )
}
