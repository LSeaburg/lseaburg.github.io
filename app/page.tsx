import { BlogPosts } from 'app/_components/blog_posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Posts
      </h1>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
