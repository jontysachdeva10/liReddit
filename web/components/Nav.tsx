'use client';

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useCurrentUserQuery } from "@gql/graphql";
import NextLink from 'next/link';

const Nav: React.FC<{}> = () => {

  const [{ data, fetching}] = useCurrentUserQuery();

  let body = null;

  // if data is loading
  if(fetching) {

    // user is not logged in
  } else if(!data?.currentUser) {
    body = (
      <>
        <NextLink href='/login'>
            <Link mr={2} color={'white'}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
            <Link color={'white'}>Register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = 
    <Flex>
      <Box mr={2}>{data.currentUser.username}</Box>
      <Button variant='link' color={'white'}>Logout</Button>
    </Flex>
    
  }

  return (
    <Flex bg="tomato" p="4">
      <Box ml="auto">
        {body}
      </Box>
    </Flex>
  );
};

export default Nav;
