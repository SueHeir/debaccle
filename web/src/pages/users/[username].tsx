import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  HStack,
  VStack,
  Text,
  useInterval,
  Avatar,
  useTheme,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { Layout } from "../../components/Layout";
import { Posts } from "../../components/Posts";
import { UpdootSection } from "../../components/UpdootSection";
import {
  usePostsQuery,
  PostsQuery,
  useMeQuery,
  useUserQuery,
  useFollowUserMutation,
  useUnFollowUserMutation,
  useHateUserMutation,
  useUnHateUserMutation,
  useUserFollowHateInfoQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import { IMAGE_HOST } from "../../utils/constants";
import { EditFollowHateButtons } from "../../components/EditFollowHateButtons";

const UserProfile: React.FC<{}> = ({}) => {
  const meQuery = useMeQuery();
  const router = useRouter();

  const theme = useTheme();

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnFollowUserMutation();

  const [hateUser] = useHateUserMutation();
  const [unhateUser] = useUnHateUserMutation();

  const [showFolHat, setShowFolHat] = useState<string | null>(null);

  const thestring = router.query?.username;
  let users = null;

  if (thestring) users = [thestring] as string[];

  let userQuerey = useUserQuery({
    variables: {
      username: thestring as string,
      id: null,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  let userFollowHateInfo = useUserFollowHateInfoQuery({
    skip: !showFolHat,
    variables: {
      username: thestring as string,
      type: showFolHat as string,
      id: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const postQuery = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
      users: users,
      userids: null,
      showExpired: true,
    },
    notifyOnNetworkStatusChange: true,
  });

  let profileBody;

  let follhatesection;
  if (userQuerey.loading) {
    profileBody = <>Loading...</>;
  } else if (!userQuerey.data?.user) {
    profileBody = <>No Data...</>;
  } else {
    let userProfile = userQuerey.data?.user;
    // console.log(userProfile);
    profileBody = (
      <Box mb={4} shadow="md" borderWidth="1px">
        <Flex>
          <Avatar
            size={"xl"}
            m={3}
            src={
              userProfile.image == "" ? "" : `${IMAGE_HOST}${userProfile.image}`
            }
          />
          <Stack mt={2}>
            <VStack align={"start"}>
              <Box fontSize={25}>{userProfile.name}</Box>
              <Box fontSize={20}>@{userProfile.username}</Box>
              <Box fontSize={20}>Points: {userProfile.credits}</Box>
            </VStack>
          </Stack>
          <Box ml={"auto"}>
            <EditFollowHateButtons
              meData={meQuery}
              username={userProfile.username}
              followers={userProfile.followers}
              haters={userProfile.haters}
              id={userProfile.id}
              profileName={userProfile.username}
            />
          </Box>
        </Flex>
        <Flex m={3}>
          <Box fontSize={18}>{userProfile.bio}</Box>
        </Flex>
        <Flex>
          <HStack m={2}>
            <Button
              size={"xs"}
              onClick={() => {
                if (showFolHat == "followers") {
                  setShowFolHat(null);
                } else {
                  setShowFolHat("followers");
                  // userFollowHateInfo.refetch();
                }
              }}
            >
              <Box>Supporters: {userProfile.followers.length}</Box>
            </Button>
            <Button
              size={"xs"}
              onClick={() => {
                if (showFolHat == "following") {
                  setShowFolHat(null);
                } else {
                  setShowFolHat("following");
                  // userFollowHateInfo.refetch();
                }
              }}
            >
              <Box>Supporting: {userProfile.following.length}</Box>
            </Button>

            <Button
              size={"xs"}
              onClick={() => {
                if (showFolHat == "haters") {
                  setShowFolHat(null);
                } else {
                  setShowFolHat("haters");
                  // userFollowHateInfo.refetch();
                }
              }}
            >
              <Box>Critics: {userProfile.haters.length}</Box>
            </Button>
            <Button
              size={"xs"}
              onClick={() => {
                if (showFolHat == "hating") {
                  setShowFolHat(null);
                } else {
                  setShowFolHat("hating");
                  // userFollowHateInfo.refetch();
                }
              }}
            >
              <Box>Criticizing: {userProfile.hating.length}</Box>
            </Button>
          </HStack>
        </Flex>
      </Box>
    );
    let folhatData = userFollowHateInfo.data?.userFollowHateInfo;
    if (showFolHat && folhatData) {
      follhatesection = (
        <Box mb={4} shadow="md" borderWidth="1px">
          {folhatData.map((f) =>
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
                    profileName={userProfile.username}
                  />
                </Box>
              </Flex>
            )
          )}
        </Box>
      );
    }
  }

  return (
    <Layout meQuery={meQuery}>
      {profileBody}

      {follhatesection}

      <Posts
        fetchMorePosts={false}
        postsQueryResults={postQuery}
        trendingQueryResults={null}
        meQuery={meQuery}
      ></Posts>
    </Layout>
  );
};

export default UserProfile;
