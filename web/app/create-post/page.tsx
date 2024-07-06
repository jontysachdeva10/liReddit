"use client";

import { Button } from "@chakra-ui/react";
import InputField from "@components/InputField";
import WrapperWithNav from "@components/WrapperWithNav";
import { useCreatePostMutation } from "@gql/graphql";
import { useIsAuth } from "@utils/useIsAuth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <WrapperWithNav variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ postInput: values });
          if (error?.message.includes("Not authenticated.")) {
            router.replace("/login");
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />

            <InputField
              name="text"
              placeholder="text..."
              label="Body"
              textarea
            />

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </WrapperWithNav>
  );
};

export default CreatePost;
