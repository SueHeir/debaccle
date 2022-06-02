import { useApolloClient } from "@apollo/client";
import { Avatar, Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import {
  useDeleteUserMutation,
  useMeQuery,
  useUpdateUserMutation,
  useUserQuery,
} from "../generated/graphql";
import { IMAGE_HOST } from "../utils/constants";

const EditProfile: React.FC<{}> = ({}) => {
  const router = useRouter();
  const meQuery = useMeQuery();
  const apolloClient = useApolloClient();

  const [image, setImage] = useState<Blob | null>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setCreateObjectURL(`${IMAGE_HOST}${meQuery?.data?.me?.image}`);
  }, [meQuery.data?.me?.image]);

  const userQuerey = useUserQuery({
    skip: !meQuery.data?.me?.id,
    variables: {
      username: null,
      id: meQuery.data?.me?.id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  if (userQuerey.loading) {
    return (
      <Layout meQuery={meQuery}>
        <div>loading...</div>
      </Layout>
    );
  }
  let id = -1;
  let name = "";
  let bio = "";
  let imageString = "";
  if (!userQuerey.data?.user && !meQuery.data?.me) {
    return (
      <Layout meQuery={meQuery}>
        <Box>could not find User</Box>
      </Layout>
    );
  } else if (meQuery.data?.me?.id) {
    // console.log(meQuery.data?.me?.id);
    id = meQuery.data.me.id;
    name = meQuery.data.me.name;
    bio = meQuery.data.me.bio;
  }

  return (
    <Layout meQuery={meQuery} variant="small">
      <Formik
        initialValues={{ name: name, bio: bio }}
        onSubmit={async (values) => {
          let img = "";

          if (userQuerey.data?.user?.image) {
            img = userQuerey.data?.user?.image;
          }

          await updateUser({
            variables: {
              id: id,
              bio: values.bio,
              image: img,
              name: values.name,
              file: image,
            },
          });

          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={1}>
              <InputField
                name="name"
                placeholder={userQuerey.data?.user?.name}
                label="Name"
              />
            </Box>
            <Box mt={4} m={1}>
              <InputField
                textarea
                name="bio"
                placeholder={userQuerey.data?.user?.bio}
                label="Bio"
              />
            </Box>

            <Flex mt={4} m={3}>
              <Avatar size={"xl"} src={createObjectURL} />

              <Dropzone
                onDrop={(acceptedFiles) => {
                  // console.log(acceptedFiles);
                  if (
                    acceptedFiles[acceptedFiles.length - 1].size <
                    1024 * 1024 * 10 /*10MB*/
                  ) {
                    setImage(acceptedFiles[acceptedFiles.length - 1]);
                    setCreateObjectURL(
                      URL.createObjectURL(
                        acceptedFiles[acceptedFiles.length - 1]
                      )
                    );
                  }
                }}
                accept={{ "image/png": [".png"], "image/jpeg": [".jpeg"] }}
                maxFiles={1}
              >
                {({
                  isDragAccept,
                  isDragActive,
                  isDragReject,
                  getRootProps,
                  getInputProps,
                }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Box
                        border={"1px"}
                        borderStyle={"dashed"}
                        borderRadius={"xl"}
                        m={3}
                        ml={4}
                        p={6}
                      >
                        {!isDragActive && <p>Drop Image here ...</p>}
                        {isDragAccept && <p>Image will be accepted</p>}
                        {isDragReject && <p>Image will be rejected</p>}
                      </Box>
                    </div>
                  </section>
                )}
              </Dropzone>
            </Flex>

            <Button
              mt={4}
              m={1}
              ml={4}
              mb={20}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="primary"
            >
              Update User
            </Button>
          </Form>
        )}
      </Formik>

      <Formik
        initialValues={{ username: "" }}
        onSubmit={async (values) => {
          if (values.username == meQuery.data?.me?.username) {
            await deleteUser();
            await apolloClient.resetStore();
          }

          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={1}>
              <InputField
                name="username"
                placeholder="Permanently delete account here"
                label="Type username to Delete Account"
              />
            </Box>

            <Button
              mt={4}
              m={1}
              ml={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="red"
            >
              Delete Account
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditProfile;
