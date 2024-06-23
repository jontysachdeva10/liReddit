"use client";

import { Button } from "@chakra-ui/react";
import InputField from "@components/InputField";
import Wrapper from "@components/Wrapper";
import { useLoginMutation } from "@gql/graphql";
import { toErrorMap } from "@utils/toErrorMap";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";

const Login: React.FC<{}> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ userInput: values });
          console.log(response, 'RES');
          

          if (response.data?.login.error) {
            setErrors(toErrorMap(response.data.login.error));
          } else if(response.data?.login.user) {
            router.push("/");
          } else {

          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />

            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />

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