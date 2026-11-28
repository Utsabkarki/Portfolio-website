import Blog from '../components/Blog'
import News from '../components/News'
import { Layout, Node, PageHead } from '../ui'

export default function BlogPage() {
  return (
    <Layout page="blog">
      <PageHead
        kicker="Writing"
        title={
          <>
            The <em className="text-berry">blog</em>
          </>
        }
        intro="Notes on studying in Japan, code and editing. Beside them, the headlines I’m following, refreshed every three hours."
      />
      <div className="grid gap-10 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        <Node tag="Posts">
          <Blog />
        </Node>
        <Node tag="What’s happening in the world" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="serif mb-5 text-3xl">What’s happening in the world</h2>
          <News />
        </Node>
      </div>
    </Layout>
  )
}
