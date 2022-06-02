import { Avatar } from "@chakra-ui/avatar";
import { ArrowForwardIcon, ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, Flex, HStack, Link, Stack, VStack } from "@chakra-ui/layout";
import { Collapse, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { EditFollowHateButtons } from "../components/EditFollowHateButtons";
import { Layout } from "../components/Layout";
import { PostDisplay } from "../components/PostDisplay";
import { UpdootSection } from "../components/UpdootSection";
import { UpdootSectionComments } from "../components/UpdootSectionComment";
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useMeQuery,
  useSearchQuery,
} from "../generated/graphql";
import { IMAGE_HOST } from "../utils/constants";

export const Explore: React.FC<{}> = ({}) => {
  const meQuery = useMeQuery();

  const [searchString, setSearchString] = useState<string>("");

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

  const searchQuery = useSearchQuery({
    skip: !searchString,
    variables: {
      search: searchString,
    },
    nextFetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  let userresults;
  let psotresults;
  if (searchQuery.data?.search.users) {
    userresults = (
      <>
        <Box mb={4} shadow="md" borderWidth="1px">
          {searchQuery.data.search.users.map((f) =>
            !f ? null : (
              <Flex key={f.id} borderBottomWidth="1px" w="100%">
                <Stack>
                  <HStack>
                    <Avatar
                      size={"md"}
                      m={3}
                      src={f.image == "" ? "" : `${IMAGE_HOST}${f.image}`}
                    />

                    <VStack alignContent={"start"}>
                      <Box alignSelf={"start"}>{f.name}</Box>

                      <Link href={"/users/" + f.username}>
                        <Text alignSelf={"start"}>@{f.username}</Text>
                      </Link>
                      <Text mb={2}>Points: {f.credits}</Text>
                    </VStack>
                  </HStack>
                </Stack>
                <Box ml={"auto"}>
                  <EditFollowHateButtons
                    meData={meQuery}
                    username={f.username}
                    followers={f.followers}
                    haters={f.haters}
                    id={f.id}
                    profileName={f.username}
                  />
                </Box>
              </Flex>
            )
          )}
        </Box>
      </>
    );
  }

  if (searchQuery.data?.search.posts) {
    psotresults = (
      <>
        <Stack spacing={0} borderWidth="1px">
          {searchQuery.data.search.posts.map((p: any) =>
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
                                    wordBreak={"break-all"}
                                    textColor={p.locked ? "grey" : ""}
                                  >
                                    {c.text}
                                  </Text>
                                </Flex>
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
      </>
    );
  }

  return (
    <Layout meQuery={meQuery}>
      <Formik
        initialValues={{ search: "" }}
        onSubmit={async (values, { setErrors }) => {}}
      >
        <Form>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              name="search"
              placeholder="Search Users or Post"
              onChange={(e) => {
                // console.log(e.target.value);
                setSearchString(e.target.value);
              }}
            />
          </InputGroup>
        </Form>
      </Formik>
      {userresults}
      {psotresults}
    </Layout>
  );
};

export default Explore;
