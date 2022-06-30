import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return <>
        <Html>
            <Head >
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sen&display=swap" />
                {/* <link href="https://fonts.googleapis.com/css2?family=Sen&display=swap" /> */}
            </Head>
            <body>
                <Main />
                <div id="modal" />
                <NextScript />
            </body>
        </Html>
    </>


}