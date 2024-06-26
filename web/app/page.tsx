'use client';

import Nav from "@components/Nav"
import { usePostsQuery } from "@gql/graphql";

const Home = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Nav />
      <div>Home</div>
      <br />
      {!data ? <div>loading...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  )
}

export default Home;