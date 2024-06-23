'use client';

import { Provider, createClient, fetchExchange } from "urql";
import { Data, cacheExchange } from '@urql/exchange-graphcache';
import { Providers } from "./providers";
import { CurrentUserDocument, CurrentUserQuery, LoginMutation, RegisterMutation } from "@gql/graphql";

const cache = cacheExchange({
  updates: {
    Mutation: {
      login: (result: LoginMutation, args, cache, info) => {
        const { login } = result;  
        cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
          return {
            currentUser: login.user
          }
        })

      },

      register: (result: RegisterMutation, args, cache, info) => {
        const { register } = result;  
        cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
          return {
            currentUser: register.user
          }
        })

      }
    }
  }
});

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [cache, fetchExchange],
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
