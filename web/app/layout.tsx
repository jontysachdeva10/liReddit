'use client';

import { Provider } from "urql";
import { Providers } from "./providers";
import { client } from "@utils/createUrqlClient";

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
