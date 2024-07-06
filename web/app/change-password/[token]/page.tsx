"use client";

import { Flex, Link } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";
import InputField from "@components/InputField";
import Wrapper from "@components/Wrapper";
import { useChangePasswordMutation } from "@gql/graphql";
import { toErrorMap } from "@utils/toErrorMap";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import NextLink from 'next/link';
import { NextPage } from "next";


const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const queryParams = useSearchParams();
  
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token: queryParams.get("token") || '',
            newPassword: values.newPassword,
          });

          if (response.data?.changePassword.error) {
            // Handling token error scenario defined in server side
            const errorMap = toErrorMap(response.data.changePassword.error);

            if ("token" in errorMap) {              
              setTokenError(errorMap.token as string);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />

            {tokenError ?
                <Flex> 
                    <Box mr={2} color="red">{tokenError}</Box>
                    <NextLink href='/forgot-password'>
                        <Link>Click here to get a new password.</Link>
                    </NextLink>
                </Flex>
            : null}

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
