"use client";

import { Button, Flex, Link } from "@chakra-ui/react";
import InputField from "@components/InputField";
import Wrapper from "@components/Wrapper";
import { useLoginMutation } from "@gql/graphql";
import { toErrorMap } from "@utils/toErrorMap";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

const Login: React.FC<{}> = () => {
  const router = useRouter();
  const queryParams = useSearchParams()
  const [, login] = useLoginMutation();
  
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.error) {
            setErrors(toErrorMap(response.data.login.error));
          } else if (response.data?.login.user) {
            router.push(queryParams.get("next") || "/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />

            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />

            <Flex>
              <Link ml={'auto'} href="/forgot-password">Forgot Password?</Link>
            </Flex>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
