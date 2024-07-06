import { useCurrentUserQuery } from "@gql/graphql";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const router = useRouter();
  const pathname = usePathname()
  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      router.replace('/login?next=' + pathname);
    }
  }, [data, fetching, router]);
};
