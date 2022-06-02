import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import {
  useRegisterEmailMutation,
  MeDocument,
  MeQuery,
  useMeQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Layout } from "../../components/Layout";

const RegisterEmail: NextPage = () => {
  const router = useRouter();
  const [registerEmail] = useRegisterEmailMutation();
  const [tokenError, setTokenError] = useState("");
  const meQuery = useMeQuery();
  return (
    <Layout meQuery={meQuery} variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async () => {
          const response = await registerEmail({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="primary"
            >
              Register Email
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default RegisterEmail;
