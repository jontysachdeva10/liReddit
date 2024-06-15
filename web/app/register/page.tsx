"use client";

import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import Wrapper from "@components/Wrapper";
import { Form, Formik } from "formik";

const Register = () => {
  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
              />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
