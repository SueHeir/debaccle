import { ArrowForwardIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeleteCommentButtons } from "../../components/EditDeleteCommentButtons";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import ImageModal from "../../components/ImageModal";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { UpdootSection } from "../../components/UpdootSection";
import { UpdootSectionComments } from "../../components/UpdootSectionComment";
import {
  CommentsQuery,
  useCommentsQuery,
  useCreateCommentMutation,
  useMeQuery,
} from "../../generated/graphql";
import { IMAGE_HOST } from "../../utils/constants";
import { toErrorMap3 } from "../../utils/toErrorMap";
import { useGetIntId } from "../../utils/useGetIntId";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  const intId = useGetIntId();
  const meQuery = useMeQuery();

  const commentQuery = useCommentsQuery({
    variables: {
      limit: 6,
      cursor: null,
      postId: intId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [showCommentField, setShowCommentField] = useState<Boolean>(false);
  const [createComment] = useCreateCommentMutation({});

  if (loading) {
    return (
      <Layout meQuery={meQuery}>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout meQuery={meQuery}>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  if (commentQuery.data) {
    // console.log(commentQuery.data);
  }

  if (data?.post) {
    return (
      <Layout meQuery={meQuery}>
        <Stack spacing={0} borderWidth="1px">
          <Box key={data.post.id}>
            <Box borderBottomWidth="1px">
              <Flex p={4} pb={1}>
                <Avatar
                  size={"lg"}
                  colorScheme={"primary"}
                  mr={2}
                  src={
                    data.post.creator.image == ""
                      ? ""
                      : `${IMAGE_HOST}${data.post.creator.image}`
                  }
                />

                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${data.post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{data.post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Link href={"/users/" + data.post.creator.username}>
                    <Text>@{data.post.creator.username}</Text>
                  </Link>

                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {data.post.text}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    {data.post.image != "" ? (
                      <ImageModal
                        src={`${IMAGE_HOST}${data.post.image}`}
                      ></ImageModal>
                    ) : null}
                  </Flex>
                </Box>
                <Box ml="auto" mb={"auto"}>
                  <EditDeletePostButtons
                    id={data.post.id}
                    creatorId={data.post.creator.id}
                    locked={data.post.locked}
                    createdAt={data.post.createdAt}
                    meQuery={meQuery}
                  />
                </Box>
              </Flex>
              <Flex>
                <UpdootSection
                  post={data.post}
                  meQuery={meQuery}
                ></UpdootSection>

                <IconButton
                  m={2}
                  mr={4}
                  ml={"auto"}
                  aria-label={"Comment Section"}
                  icon={<ChatIcon />}
                  onClick={() => {
                    setShowCommentField(!showCommentField);
                    return;
                  }}
                ></IconButton>
              </Flex>
            </Box>
            <Box style={{ display: showCommentField ? "block" : "none" }}>
              <Formik
                initialValues={{ text: "" }}
                onSubmit={async (values, { setErrors }) => {
                  if (data?.post?.id) {
                    const response = await createComment({
                      variables: {
                        input: {
                          postId: data?.post.id,
                          text: values.text,
                        },
                      },
                    });
                    if (response.data?.createComment.errors) {
                      setErrors(
                        toErrorMap3(response.data.createComment.errors)
                      );
                    } else {
                      commentQuery.refetch();
                      setShowCommentField(false);
                    }
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
                        label="Add Comment"
                      />
                    </Box>
                    <Button mt={4} type="submit" isLoading={isSubmitting}>
                      create comment
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
            <Box>
              {commentQuery.data?.comments.comments.map((c) =>
                !c ? null : (
                  <Box key={c.id}>
                    <Box borderBottomWidth="1px">
                      <Flex p={4} pb={1}>
                        <ArrowForwardIcon mt={4} mr={1} />
                        <Avatar
                          size={"md"}
                          colorScheme={"primary"}
                          mr={2}
                          src={c.creator.image}
                        />

                        <Box flex={1}>
                          <Link href={"/users/" + c.creator.username}>
                            <Text>@{c.creator.username}</Text>
                          </Link>

                          <Flex align="center">
                            <Text flex={1} mt={2} wordBreak={"break-all"}>
                              {c.text}
                            </Text>
                          </Flex>
                        </Box>
                        <Box ml="auto" mb={"auto"}>
                          <EditDeleteCommentButtons
                            id={c.id}
                            postId={data?.post?.id}
                            creatorId={c.creator.id}
                            createdAt={c.createdAt}
                            limit={6}
                            cursor={null}
                            users={null}
                            userids={null}
                            meQuery={meQuery}
                          />
                        </Box>
                      </Flex>
                      <Flex>
                        <UpdootSectionComments
                          meQuery={meQuery}
                          comment={c}
                          post={data?.post ? data.post : null}
                        ></UpdootSectionComments>
                      </Flex>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Stack>
        {commentQuery.data && commentQuery.data.comments.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                commentQuery.fetchMore({
                  variables: {
                    limit: commentQuery.variables?.limit,
                    cursor:
                      commentQuery.data?.comments.comments[
                        commentQuery.data?.comments.comments.length - 1
                      ].createdAt,
                  },
                  updateQuery: (
                    previousValue,
                    { fetchMoreResult }
                  ): CommentsQuery => {
                    if (!fetchMoreResult) {
                      return previousValue as CommentsQuery;
                    }

                    return {
                      __typename: "Query",
                      comments: {
                        __typename: "PaginatedComments",
                        hasMore: (fetchMoreResult as CommentsQuery).comments
                          .hasMore,
                        comments: [
                          ...(previousValue as CommentsQuery).comments.comments,
                          ...(fetchMoreResult as CommentsQuery).comments
                            .comments,
                        ],
                      },
                    };
                  },
                });
              }}
              isLoading={loading}
              m="auto"
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    );
  }

  return <Box>Loading...</Box>;
};

export default Post;
