'use client';

import { Provider, createClient, fetchExchange } from "urql";
import { cacheExchange } from '@urql/exchange-graphcache';
import { Providers } from "./providers";

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [cacheExchange({}), fetchExchange],
  fetchOptions: {
    credentials: 'include'
  }
});


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Provider value={client}>
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
