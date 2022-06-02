import {} from "@chakra-ui/icons";
import { Box, Button, Flex, SlideFade, useDisclosure } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import {} from "next/router";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Posts } from "../components/Posts";
import { Wrapper } from "../components/Wrapper";
import {
  Post,
  useMeQuery,
  usePostsQuery,
  useTrendingQuery,
} from "../generated/graphql";
import TouchEvent from "../utils/TouchEvent";
import { useReactQueryClient } from "../utils/userReactQueryClient";

let touchEvent: TouchEvent | null = null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const UA = context.req.headers["user-agent"];
  let isMobile = false;
  if (UA) {
    isMobile = Boolean(
      UA.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
  }

  return {
    props: {
      deviceType: isMobile ? "mobile" : "desktop",
    },
  };
};

export const initSelect = (data: Post[]) => {
  return data.map((item) => ({
    ...item,
    isShowing: false,
  }));
};

const Index = ({}) => {
  useReactQueryClient();

  const meQuery = useMeQuery();

  let header;
  const { isOpen, onToggle } = useDisclosure();

  const [displaySection, setDisplaySection] = useState<number>(0);
  const [userids, setUserIds] = useState<number[] | null>(null);

  const [trending, setTrending] = useState<boolean | null>(null);

  const postQuery = usePostsQuery({
    skip: trending != null,
    variables: {
      limit: 15,
      cursor: null,
      users: null,
      userids: userids,
      showExpired: false,
    },
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const trendingQuery = useTrendingQuery({
    skip: trending == null,
    variables: {
      limit: 10,
      cursor: null,
      anti: trending as boolean,
    },
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const handleSwipe = (event: globalThis.TouchEvent) => {
    if (!touchEvent) {
      return;
    }

    touchEvent.setEndEvent(event);

    if (touchEvent.isSwipeRight()) {
      // console.log("right");
      changeDisplaySection(1);
    } else if (touchEvent.isSwipeLeft()) {
      // console.log("left");
      changeDisplaySection(1);
    }

    touchEvent = null;
  };

  const changeDisplaySection = async (num: number) => {
    if (isOpen) {
      onToggle();
    }
    await new Promise((f) => setTimeout(f, 150));
    await setDisplaySection(num);
    if (meQuery.data?.me) {
      const following = meQuery.data.me.following;
      const hating = meQuery.data.me.hating;
      switch (num) {
        case 0:
          setUserIds(null);
          setTrending(null);
          postQuery.refetch({
            users: null,
            userids: null,
          });
          break;
        case 1:
          setUserIds(following);
          setTrending(null);
          postQuery.refetch({
            users: null,
            userids: following,
          });
          break;
        case 2:
          setUserIds(hating);
          setTrending(null);
          postQuery.refetch({
            users: null,
            userids: hating,
          });
          break;
        case 3:
          setTrending(false);
          trendingQuery.refetch({
            anti: false,
          });
          break;
        case 4:
          setTrending(true);
          trendingQuery.refetch({
            anti: true,
          });
          break;
      }
      await new Promise((f) => setTimeout(f, 150));
      onToggle;
    } else {
      switch (num) {
        case 0:
          setUserIds(null);
          setTrending(null);
          postQuery.refetch({
            users: null,
            userids: null,
          });
          break;
        case 3:
          setTrending(false);
          trendingQuery.refetch({
            anti: false,
          });
          break;
        case 4:
          setTrending(true);
          trendingQuery.refetch({
            anti: true,
          });
          break;
      }
      await new Promise((f) => setTimeout(f, 150));
      onToggle;
    }
  };

  const animationTimer = async () => {
    await new Promise((f) => setTimeout(f, 150));
    onToggle();
  };

  if (!isOpen) {
    animationTimer();
  }

  if (meQuery.data?.me) {
    // console.log(meQuery.data)
    const following = meQuery.data.me.following;
    const hating = meQuery.data.me.hating;
    header = (
      <Wrapper>
        <Flex m={0} mb={3} alignItems={"center"} justifyContent={"center"}>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            roundedLeft={"sm"}
            colorScheme={displaySection == 0 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(0);
            }}
          >
            All
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            colorScheme={displaySection == 1 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(1);
            }}
          >
            Following
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            colorScheme={displaySection == 2 ? "primary" : "gray"}
            onClick={() => {
              setUserIds(hating);
              changeDisplaySection(2);
            }}
          >
            Hating
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            colorScheme={displaySection == 3 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(3);
            }}
          >
            Trending
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            roundedRight={"sm"}
            colorScheme={displaySection == 4 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(4);
            }}
          >
            Anti-Trending
          </Button>
        </Flex>
      </Wrapper>
    );
  } else if (!meQuery.loading) {
    header = (
      <Wrapper>
        <Flex m={0} mb={3} alignItems={"center"} justifyContent={"center"}>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            roundedLeft={"md"}
            colorScheme={displaySection == 0 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(0);
            }}
          >
            All
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            colorScheme={displaySection == 3 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(3);
            }}
          >
            Trending
          </Button>
          <Button
            size={"sm"}
            pt={6}
            pb={6}
            rounded={"none"}
            roundedRight={"md"}
            colorScheme={displaySection == 4 ? "primary" : "gray"}
            onClick={() => {
              changeDisplaySection(4);
            }}
          >
            Anti-Trending
          </Button>
        </Flex>
      </Wrapper>
    );
  }

  return (
    <Layout meQuery={meQuery}>
      <Box>{header}</Box>

      <SlideFade in={isOpen} style={{ zIndex: 0 }}>
        <Posts
          postsQueryResults={postQuery}
          trendingQueryResults={trendingQuery}
          meQuery={meQuery}
        />
      </SlideFade>
    </Layout>
  );
};

export default Index;
