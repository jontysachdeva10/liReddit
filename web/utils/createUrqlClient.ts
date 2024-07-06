import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
} from "@gql/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
// import  Router  from "next/router";
import { createClient, Exchange, fetchExchange } from "urql";
// import { pipe, tap } from "wonka";

const cache = cacheExchange({
  updates: {
    Mutation: {
      logout: (result: LogoutMutation, args, cache, info) => {
        cache.updateQuery(
          { query: CurrentUserDocument },
          (data: CurrentUserQuery | null) => {
            return {
              currentUser: null,
            };
          }
        );
      },
      login: (result: LoginMutation, args, cache, info) => {
        const { login } = result;
        cache.updateQuery(
          { query: CurrentUserDocument },
          (data: CurrentUserQuery | null) => {
            return {
              currentUser: login.user,
            };
          }
        );
      },

      register: (result: RegisterMutation, args, cache, info) => {
        const { register } = result;
        cache.updateQuery(
          { query: CurrentUserDocument },
          (data: CurrentUserQuery | null) => {
            return {
              currentUser: register.user,
            };
          }
        );
      },
    },
  },
});

// const errorExchange: Exchange =
//   ({ forward }) =>
//   (ops$) => {
//     return pipe(
//       forward(ops$),
//       tap(({ error }) => {
//         if (error?.message.includes("Not authenticated.")) {
//           Router.replace('/login')
//         }
//       })
//     );
//   };

export const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [cache,
    // errorExchange,
    fetchExchange,],
  fetchOptions: {
    credentials: "include",
  },
});
