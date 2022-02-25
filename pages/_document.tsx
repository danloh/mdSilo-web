import Document, { Html, Head, Main, NextScript } from 'next/document';

const DESCRIPTION = 'mdSilo: networking while writing';

class MsDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content={DESCRIPTION} />
          <meta name="application-name" content="mdSilo" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="mdSilo" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta property="og:title" content="mdSilo" />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:image" content="https://mdsilo.com/android-chrome-512x512.png" />
          <meta property="og:url" content="https://mdsilo.com" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="" />
          <meta name="twitter:site" content="@mdsiloapp" />
          <meta name="twitter:title" content="mdSilo" />
          <meta name="twitter:description" content={DESCRIPTION} />
          <meta name="twitter:image" content="https://mdsilo.com/android-chrome-512x512.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MsDocument;
