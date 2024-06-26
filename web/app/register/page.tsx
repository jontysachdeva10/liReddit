"use client";

import { Button } from "@chakra-ui/react";
import InputField from "@components/InputField";
import Wrapper from "@components/Wrapper";
import { useRegisterMutation } from "@gql/graphql";
import { toErrorMap } from "@utils/toErrorMap";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";

const Register: React.FC<{}> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ userInput: values });
          console.log(response, 'Res');
          
          if (response.data?.register.error) {
            setErrors(toErrorMap(response.data.register.error));
          } else if(response.data?.register.user) {
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
              name="email"
              placeholder="email"
              label="Email"
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
