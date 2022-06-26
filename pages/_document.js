import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>

      <body className="align-items-center">
        <ul className="circles">
          {[...Array(10).keys()].map((i) => (
            <li key={i} />
          ))}
        </ul>
            
        <main className="col col-sm-8 w-sm-75 mx-auto mt-5 bg-light p-5 rounded-2 shadow">
          <Main />
        </main>

        <NextScript />
      </body>
    </Html>
  );
}
