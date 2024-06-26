'use client';

import { Button } from '@chakra-ui/react';
import InputField from '@components/InputField';
import Wrapper from '@components/Wrapper';
import { Form, Formik } from 'formik';

interface ChangePasswordProps {
  params: {
    token: string;
  };
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ params }) => {
  const { token } = params;

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
        //   const response = await login(values);
          
        //   if (response.data?.login.error) {
        //     setErrors(toErrorMap(response.data.login.error));
        //   } else if(response.data?.login.user) {
        //     router.push("/");
        //   }
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
