import '/src/styles/global.sass'
import Head from 'next/head'

//show console.log source
['log', 'warn'].forEach(function(method) {
  var old = console[method];
  console[method] = function() {
    var stack = (new Error()).stack.split(/\n/);
    // Chrome includes a single "Error" line, FF doesn't.
    if (stack[0].indexOf('Error') === 0) {
      stack = stack.slice(1);
    }
    var args = [].slice.apply(arguments).concat([stack[1].trim()]);
    return old.apply(console, args);
  };
});

function App({ Component, pageProps }) {
  return <>
  <Head>
    <meta name="google-site-verification" content="EDlFiBWAIBFCZ-93UMxhZVr0V7GqOCsGfk1BDCQZCNk" />
  </Head>
  <Component {...pageProps} />
  </>
}

export default App