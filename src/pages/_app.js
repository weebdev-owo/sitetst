import '/src/styles/global.sass'
import Head from 'next/head'

function App({ Component, pageProps }) {
  return <>
  <Head>
    <meta name="google-site-verification" content="EDlFiBWAIBFCZ-93UMxhZVr0V7GqOCsGfk1BDCQZCNk" />
  </Head>
  <Component {...pageProps} />
  </>
}

export default App