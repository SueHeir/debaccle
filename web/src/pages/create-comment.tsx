import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreateCommentMutation, useMeQuery } from "../generated/graphql";
import { toErrorMap3 } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const data = useIsAuth();
  const meQuery = useMeQuery();

  let cost = 0;
  if (data?.me) {
    cost = (data.me.followers.length + 1) / (data.me.haters.length + 1);
  }

  const [createComment] = useCreateCommentMutation();
  return (
    <Layout meQuery={meQuery} variant="small">
      <Formik
        initialValues={{ text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createComment({
            variables: {
              input: {
                postId: 1,
                text: values.text,
              },
            },
          });
          if (response.data?.createComment.errors) {
            setErrors(toErrorMap3(response.data.createComment.errors));
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              create comment
            </Button>
            <Box>Cost: {cost}</Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
