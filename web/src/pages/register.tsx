import { Box, Button, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useRegisterMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const toast = useToast();
  const [register] = useRegisterMutation();
  const meQuery = useMeQuery();
  return (
    <>
      <Layout meQuery={meQuery} variant="small">
        <Formik
          initialValues={{ email: "", username: "", name: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  },
                });
              },
            });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              toast({
                title: "Account created.",
                description:
                  "We've created your account for you. Please Check your spam for an email. Varifing your email is required to get Points!",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box m={1}>
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
              </Box>
              <Box mt={4} m={1}>
                <InputField name="name" placeholder="name" label="Name" />
              </Box>
              <Box mt={4} m={1}>
                <InputField
                  name="email"
                  placeholder="email - need to register for points"
                  label="Email"
                  type="email"
                />
              </Box>
              <Box mt={4} m={1}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                m={1}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="primary"
              >
                register
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
};

export default Register;
