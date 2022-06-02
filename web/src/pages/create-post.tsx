import {
  Box,
  Button,
  Image,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import {
  PostsDocument,
  useCreatePostMutation,
  useMeQuery,
} from "../generated/graphql";
import { toErrorMap2 } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const meQuery = useMeQuery();
  const router = useRouter();
  const data = useIsAuth();
  const toast = useToast();

  const [image, setImage] = useState<Blob | null>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string | undefined>(
    undefined
  );

  // const uploadToServer = async (postid: string) => {
  //   const body = new FormData();
  //   console.log("file", image);
  //   if (image) {
  //     body.append("file", image);
  //     if (data?.me?.id) {
  //       body.append("path", `posts/${postid}.png`);
  //     }
  //   }

  //   const response = await fetch("/api/upload", {
  //     method: "POST",
  //     body,
  //   });

  //   console.log(response);
  // };

  let cost = 0;
  if (data?.me) {
    cost = (data.me.followers.length + 1) / (data.me.haters.length + 1);
  }

  const [createPost] = useCreatePostMutation();

  let credits = 0;
  if (meQuery.data?.me?.credits) {
    credits = meQuery.data.me.credits;
  }

  return (
    <Layout variant="small" meQuery={meQuery}>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          let hasImage = false;
          if (image) {
            hasImage = true;
          }

          console.log(image);
          const response = await createPost({
            variables: {
              input: {
                ...values,
              },
              file: image,
            },
            refetchQueries: [PostsDocument],
          });
          if (response.data?.createPost.errors) {
            setErrors(toErrorMap2(response.data.createPost.errors));
          } else if (response.data?.createPost.post?.id) {
            await meQuery.refetch().then(() => {
              toast({
                title: `Points Left: ${credits - cost}`,
                status: "success",
                duration: 1000,
                isClosable: true,
              });
            });

            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={1}>
              <InputField name="title" placeholder="title" label="Title" />
            </Box>
            <Box mt={4} m={1}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>

            <Image src={createObjectURL} />
            <Dropzone
              onDrop={(acceptedFiles) => {
                if (
                  acceptedFiles[acceptedFiles.length - 1].size <
                  1024 * 1024 * 10 /*10MB*/
                ) {
                  setImage(acceptedFiles[acceptedFiles.length - 1]);
                  setCreateObjectURL(
                    URL.createObjectURL(acceptedFiles[acceptedFiles.length - 1])
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
            <Button
              mt={4}
              m={1}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="primary"
            >
              create post
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button
                  mt={0}
                  ml={4}
                  colorScheme={cost > credits ? "red" : "gray"}
                >
                  Cost: {cost}
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Box>
                      Post cost is equal to the ratio of
                      (1+Followers)/(1+Haters)
                    </Box>
                  </PopoverBody>
                  <PopoverFooter>
                    You have {meQuery.data?.me?.credits} points
                  </PopoverFooter>
                </PopoverContent>
              </Portal>
            </Popover>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
