'use client';

import { Box, Button } from "@chakra-ui/react";
import InputField from "@components/InputField";
import Wrapper from "@components/Wrapper";
import { useForgotPasswordMutation } from "@gql/graphql";
import { Form, Formik } from "formik";
import { useState } from "react";

const ForgotPassword:React.FC<{}> = () => {
    const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await forgotPassword(values);
          setComplete(true)
        }}
      >
        {({ isSubmitting }) => (
          complete ? <Box>If an account with taht email exisits, we have sent you an email.</Box> :  
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />

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
  )
}

export default ForgotPassword