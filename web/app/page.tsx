"use client";

import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import WrapperWithNav from "@components/WrapperWithNav";
import { usePostsQuery } from "@gql/graphql";

const Home = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 6,
    },
  });

  if(!fetching && !data) {
    return <div>You got your query failed.</div>
  }

  return (
    <WrapperWithNav variant="regular">
      <Flex align={'center'}>
        <Heading>LiReddit</Heading>
        <Link ml={'auto'} color={'navy'} textDecoration={'underline'} href="/create-post">Create Post</Link>     
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          { data.posts.map((p) => (
           <Box key={p.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize='xl'>{p.title}</Heading>
            <Text mt={4}>{p.text.slice(0, 100)}</Text>
           </Box> 
            // <div key={p.id}>{p.title}</div>
          )
          )}  
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button isLoading={fetching} m={'auto'} my={8}>Load more</Button>
        </Flex>
      ): null}
      
    </WrapperWithNav>
  );
};

export default Home;
