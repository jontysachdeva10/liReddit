import { Providers } from "./providers";

export const metadata = {
  title: "Li-Reddit",
  description: "Something like Reddit..",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
    </html>
  );
};

export default RootLayout;
