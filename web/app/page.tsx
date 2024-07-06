'use client';

import { Link } from "@chakra-ui/react";
import WrapperWithNav from "@components/WrapperWithNav";
import { usePostsQuery } from "@gql/graphql";

const Home = () => {
  const [{ data }] = usePostsQuery();

  return (
    <WrapperWithNav variant="small">
      <Link href="/create-post">Create Post</Link>
      <br />
      {!data ? <div>loading...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </WrapperWithNav>
  )
}

export default Home;