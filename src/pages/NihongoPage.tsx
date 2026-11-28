import JapaneseWords from '../components/JapaneseWords'
import { Layout, PageHead } from '../ui'

export default function NihongoPage() {
  return (
    <Layout page="nihongo">
      <PageHead
        kicker="今日の言葉"
        title={
          <>
            <span className="jp">日本語</span> <em className="text-berry">every day</em>
          </>
        }
        intro="Ten Japanese words a day, the same ten for everyone, changing at midnight Japan time. Turn on the quiz to test yourself, or tap the speaker to hear a word."
      />
      <div className="pb-10">
        <JapaneseWords />
      </div>
    </Layout>
  )
}
