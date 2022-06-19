import { ArrowForwardIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import produce from "immer";
import React, { useEffect, useState } from "react";
import {
  MeQueryResult,
  PostsDocument,
  PostsQuery,
  PostsQueryResult,
  TrendingDocument,
  TrendingQuery,
  TrendingQueryResult,
  useCommentsQuery,
  useCreateCommentMutation,
} from "../generated/graphql";
import { IMAGE_HOST } from "../utils/constants";
import { toErrorMap3 } from "../utils/toErrorMap";
import { EditDeleteCommentButtons } from "./EditDeleteCommentButtons";
import { InputField } from "./InputField";
import { PostDisplay } from "./PostDisplay";
import { UpdootSection } from "./UpdootSection";
import { UpdootSectionComments } from "./UpdootSectionComment";

// export const getStaticProps: GetStaticProps = async (context) => {

//   const { data, error, loading, fetchMore, variables } = usePostsQuery({

//     variables: {
//       limit: 15,
//       cursor: null,
//       users: null,
//     },
//     notifyOnNetworkStatusChange: true,
//   });

//   return {
//     props: {
//       deviceType: isMobile ? 'mobile' : 'desktop'
//     }
//   }
// }

interface LayoutProps {
  postsQueryResults: PostsQueryResult | null;
  trendingQueryResults: TrendingQueryResult | null;
  meQuery: MeQueryResult;
  fetchMorePosts: boolean;
  swiper?: any;
}

export const Posts: React.FC<LayoutProps> = ({
  postsQueryResults,
  trendingQueryResults,
  meQuery,
  fetchMorePosts,
  swiper,
}) => {
  const [showCommentField, setShowCommentField] = useState<number | null>(null);
  const [commentToQuery, setCommentToQuery] = useState<number>(-1);
  const [createComment] = useCreateCommentMutation({});

  const { isOpen: isCommentOpen, onToggle: onCommentToggle } = useDisclosure();

  const commentQuery = useCommentsQuery({
    skip: commentToQuery == -1,
    variables: {
      limit: 6,
      cursor: null,
      postId: commentToQuery,
    },
    notifyOnNetworkStatusChange: true,
  });

  let vari: any;
  let data: any;
  let loading: any;
  if (postsQueryResults) {
    if (postsQueryResults.data?.posts) {
      data = postsQueryResults.data.posts;
    }
    if (postsQueryResults.variables) {
      vari = {
        ...postsQueryResults.variables,
      };
    }
    loading = postsQueryResults.loading;
  }
  if (trendingQueryResults) {
    if (trendingQueryResults.data?.trending) {
      data = trendingQueryResults.data.trending;
    }

    if (trendingQueryResults.variables) {
      vari = {
        ...trendingQueryResults?.variables,
      };
    }
    loading = trendingQueryResults.loading;
  }

  useEffect(() => {
    if (!fetchMorePosts) {
      // console.log("false");
      return;
    }
    if (!data.hasMore) {
      // console.log("no data");
      return;
    }

    if (trendingQueryResults) {
      if (trendingQueryResults.data?.trending?.posts) {
        let posts = trendingQueryResults.data.trending.posts;

        let lastCreated = 0;
        for (var i = 1; i < posts.length; i++) {
          if (posts[i].createdAt < posts[lastCreated].createdAt) {
            lastCreated = i;
          }
        }
        trendingQueryResults.fetchMore({
          variables: {
            limit: trendingQueryResults.variables?.limit,
            cursor: posts[lastCreated].createdAt,
            anti: trendingQueryResults.variables?.anti,
          },
          updateQuery: (previousValue, { fetchMoreResult }): TrendingQuery => {
            // console.log("ypdateQuery");
            if (!fetchMoreResult) {
              return previousValue as TrendingQuery;
            }
            // console.log("rerturn");
            return {
              __typename: "Query",
              trending: {
                __typename: "PaginatedPosts",
                hasMore: (fetchMoreResult as TrendingQuery).trending.hasMore,
                posts: [
                  ...(previousValue as TrendingQuery).trending.posts,
                  ...(fetchMoreResult as TrendingQuery).trending.posts,
                ],
              },
            };
          },
        });

        if (swiper) {
          setTimeout(() => {
            swiper.updateAutoHeight();
          }, 200);
          setTimeout(() => {
            swiper.updateAutoHeight();
          }, 700);
        }
      }
    }
  }, [fetchMorePosts]);

  return (
    <>
      {!data ? (
        <Stack spacing={0} borderWidth="1px">
          <Box p={40} borderBottomWidth="1px"></Box>
          <Box p={40} borderBottomWidth="1px"></Box>
        </Stack>
      ) : (
        <Stack spacing={0} borderWidth="1px">
          {data.posts.map((p: any) =>
            !p ? null : (
              <Box key={"post" + p.id.toString()} mt={0}>
                <Box pt={4} className={p.id.toString()}>
                  <Box borderBottomWidth="1px">
                    <PostDisplay p={p} meQuery={meQuery} />
                    <Flex>
                      <UpdootSection post={p} meQuery={meQuery}></UpdootSection>

                      <Box ml={"auto"} mr={4}>
                        <IconButton
                          m={2}
                          aria-label={"Comment Section"}
                          icon={<ChatIcon />}
                          colorScheme={
                            showCommentField == p.id ? "primary" : "gray"
                          }
                          onClick={() => {
                            if (showCommentField == p.id) {
                              setShowCommentField(null);
                              setCommentToQuery(-1);
                              onCommentToggle();
                              return;
                            }

                            if (!isCommentOpen) {
                              onCommentToggle();
                            }
                            setShowCommentField(p.id);
                            setCommentToQuery(p.id);

                            const path = "#" + p.id.toString();

                            let element = document.getElementById(p.id);
                            element?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });

                            return;
                          }}
                        ></IconButton>
                        {p.commentCount}
                      </Box>
                    </Flex>

                    {/* <Box
                      style={{
                        display:
                          p.id == showCommentField &&
                          meQuery.data?.me &&
                          !p.locked
                            ? "block"
                            : "none",
                      }}
                    > */}
                    <Collapse
                      in={isCommentOpen && showCommentField == p.id}
                      animateOpacity
                    >
                      <Formik
                        initialValues={{ text: "" }}
                        onSubmit={async (values, { setErrors }) => {
                          if (!meQuery.data?.me) return;

                          const response = await createComment({
                            variables: {
                              input: {
                                postId: p.id,
                                text: values.text,
                              },
                            },
                            update: (cache) => {
                              if (postsQueryResults?.variables) {
                                const postData = cache.readQuery<PostsQuery>({
                                  query: PostsDocument,
                                  variables: {
                                    limit: postsQueryResults.variables.limit,
                                    cursor: postsQueryResults.variables.cursor,
                                    users: postsQueryResults.variables.users,
                                    userids:
                                      postsQueryResults?.variables.userids,
                                  },
                                });

                                if (postData) {
                                  cache.writeQuery<PostsQuery>({
                                    query: PostsDocument,
                                    data: produce(postData, (x) => {
                                      if (x) {
                                        x.posts.posts.map((pp) => {
                                          if (pp.id == p.id) {
                                            pp.commentCount += 1;
                                          }
                                        });
                                      }
                                    }),
                                  });
                                }
                              }
                              if (trendingQueryResults?.variables) {
                                const trendingData =
                                  cache.readQuery<TrendingQuery>({
                                    query: TrendingDocument,
                                    variables: {
                                      limit:
                                        trendingQueryResults.variables.limit,
                                      cursor:
                                        trendingQueryResults.variables.cursor,

                                      anti: trendingQueryResults.variables.anti,
                                    },
                                  });

                                if (trendingData) {
                                  cache.writeQuery<TrendingQuery>({
                                    query: TrendingDocument,
                                    data: produce(trendingData, (x) => {
                                      if (x) {
                                        x.trending.posts.map((pp) => {
                                          if (pp.id == p.id) {
                                            pp.commentCount += 1;
                                          }
                                        });
                                      }
                                    }),
                                  });
                                }
                              }
                            },
                          });

                          if (response.data?.createComment.errors) {
                            setErrors(
                              toErrorMap3(response.data.createComment.errors)
                            );
                          } else {
                            commentQuery.refetch();
                            setShowCommentField(null);

                            // const path = '/post/'+ p.id.toString()
                            // router.push(path)
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
                                label=""
                                rounded={"none"}
                              />
                            </Box>
                            <Button
                              m={2}
                              type="submit"
                              isLoading={isSubmitting}
                              colorScheme="primary"
                            >
                              create comment
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </Collapse>
                    <h2
                      id={p.id.toString()}
                      // style={{ paddingTop: "20px", marginTop: "-20px" }}
                    ></h2>
                  </Box>
                </Box>
                <Collapse
                  in={isCommentOpen && showCommentField == p.id}
                  animateOpacity
                >
                  <Box>
                    {commentQuery.data?.comments.comments.map((c) =>
                      !c || c.postId != p.id ? null : (
                        <Box key={"comment" + c.id}>
                          <Box borderBottomWidth="1px">
                            <Flex p={4} pb={1}>
                              <ArrowForwardIcon mt={4} mr={1} />
                              <Avatar
                                size={"md"}
                                src={
                                  c.creator.image == ""
                                    ? ""
                                    : `${IMAGE_HOST}${c.creator.image}`
                                }
                                mr={2}
                              />

                              <Box flex={1}>
                                <Link href={"/users/" + c.creator.username}>
                                  <Text textColor={p.locked ? "grey" : ""}>
                                    @{c.creator.username}
                                  </Text>
                                </Link>

                                <Flex align="center">
                                  <Text
                                    flex={1}
                                    mt={2}
                                    wordBreak={"break-word"}
                                    textColor={p.locked ? "grey" : ""}
                                  >
                                    {c.text}
                                  </Text>
                                </Flex>
                              </Box>
                              <Box ml="auto" mb={"auto"}>
                                <EditDeleteCommentButtons
                                  id={c.id}
                                  postId={p.id}
                                  creatorId={c.creator.id}
                                  limit={vari.limit}
                                  cursor={vari.cursor}
                                  users={vari.users}
                                  userids={vari.userids}
                                  createdAt={c.createdAt}
                                  meQuery={meQuery}
                                />
                              </Box>
                            </Flex>
                            <Flex>
                              <UpdootSectionComments
                                comment={c}
                                post={p}
                                meQuery={meQuery}
                              ></UpdootSectionComments>
                            </Flex>
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                </Collapse>
              </Box>
            )
          )}
        </Stack>
      )}
      {data && data.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              if (postsQueryResults) {
                if (postsQueryResults.data?.posts.posts) {
                  let posts = postsQueryResults.data.posts.posts;

                  // console.log("fetchmore");
                  postsQueryResults.fetchMore({
                    variables: {
                      limit: postsQueryResults.variables?.limit,
                      cursor: posts[posts.length - 1].createdAt,
                    },
                    updateQuery: (
                      previousValue,
                      { fetchMoreResult }
                    ): PostsQuery => {
                      // console.log("updateQuery");
                      if (!fetchMoreResult) {
                        return previousValue as PostsQuery;
                      }
                      // console.log("return");
                      return {
                        __typename: "Query",
                        posts: {
                          __typename: "PaginatedPosts",
                          hasMore: (fetchMoreResult as PostsQuery).posts
                            .hasMore,
                          posts: [
                            ...(previousValue as PostsQuery).posts.posts,
                            ...(fetchMoreResult as PostsQuery).posts.posts,
                          ],
                        },
                      };
                    },
                  });
                }
              }
              if (trendingQueryResults) {
                if (trendingQueryResults.data?.trending?.posts) {
                  let posts = trendingQueryResults.data.trending.posts;

                  let lastCreated = 0;
                  for (var i = 1; i < posts.length; i++) {
                    if (posts[i].createdAt < posts[lastCreated].createdAt) {
                      lastCreated = i;
                    }
                  }
                  trendingQueryResults.fetchMore({
                    variables: {
                      limit: trendingQueryResults.variables?.limit,
                      cursor: posts[lastCreated].createdAt,
                      anti: trendingQueryResults.variables?.anti,
                    },
                    updateQuery: (
                      previousValue,
                      { fetchMoreResult }
                    ): TrendingQuery => {
                      // console.log("ypdateQuery");
                      if (!fetchMoreResult) {
                        return previousValue as TrendingQuery;
                      }
                      // console.log("rerturn");
                      return {
                        __typename: "Query",
                        trending: {
                          __typename: "PaginatedPosts",
                          hasMore: (fetchMoreResult as TrendingQuery).trending
                            .hasMore,
                          posts: [
                            ...(previousValue as TrendingQuery).trending.posts,
                            ...(fetchMoreResult as TrendingQuery).trending
                              .posts,
                          ],
                        },
                      };
                    },
                  });
                }
              }
              return;
            }}
            isLoading={
              postsQueryResults?.loading || trendingQueryResults?.loading
            }
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </>
  );
};
