"use client";

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useCurrentUserQuery, useLogoutMutation } from "@gql/graphql";
import NextLink from "next/link";

const Nav: React.FC<{}> = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCurrentUserQuery();

  let body = null;
  // if data is loading
  if (fetching) {
    // user is not logged in
  } else if (!data?.currentUser) {
    body = (
      <>
        <Link href="/login" mr={2} color={"white"}>
          Login
        </Link>

        <Link href="/register" color={"white"}>
          Register
        </Link>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.currentUser.username}</Box>
        <Button
          variant="link"
          color={"white"}
          onClick={() => {
            logout({});
          }}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p="4">
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Nav;
