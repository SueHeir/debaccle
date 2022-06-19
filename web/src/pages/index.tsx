import {} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  SlideFade,
  useColorMode,
  useDisclosure,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  HStack,
  ScaleFade,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import {} from "next/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Layout } from "../components/Layout";
import { Posts } from "../components/Posts";
import { Wrapper } from "../components/Wrapper";
import {
  Post,
  TrendingQuery,
  useMeQuery,
  usePostsQuery,
  useTrendingQuery,
} from "../generated/graphql";
import { useReactQueryClient } from "../utils/userReactQueryClient";
import Head from "next/head";
import SwipeableViews from "react-swipeable-views";
import { truncate } from "fs";
import { element } from "prop-types";
import useMobileDetect from "../utils/isMobile";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper";
import SwiperCore from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";

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
  const { colorMode, toggleColorMode } = useColorMode();

  const meQuery = useMeQuery();
  let isMobile = useMobileDetect().isMobile();
  let header;

  function useStateRef(initialValue: number) {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(value);
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return { value, setValue, ref };
  }

  const {
    value: displaySection,
    setValue: setDisplaySection,
    ref: displayRef,
  } = useStateRef(0);

  const [scrollPositions, setScrollPositions] = useState<number[]>([0, 0]);

  const [trending, setTrending] = useState<boolean | null>(false);

  const trendingQuery = useTrendingQuery({
    skip: trending == null,
    variables: {
      limit: 15,
      cursor: null,
      anti: false,
    },
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const antiTrendingQuery = useTrendingQuery({
    skip: trending == null,
    variables: {
      limit: 15,
      cursor: null,
      anti: true,
    },
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let str = "";
      if (window.sessionStorage.getItem("scrollPositions") != null) {
        str += window.sessionStorage.getItem("scrollPositions");
        // console.log(str);
        const temp = JSON.parse(str);
        if (temp) {
          // console.log("hello");
          setScrollPositions(temp);
          window.scrollTo(0, temp[0]);
        }
      }
    }
  }, []);

  const [fetchMorePosts1, setfetchMorePosts1] = useState(false);
  const [fetchMorePosts2, setfetchMorePosts2] = useState(false);

  const handleScroll = () => {
    const position = window.pageYOffset;
    var limit = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    // if (inputEl.current) onRefChange(inputEl.current);

    if (position > limit * 0.5) {
      // console.log("trigger");
      // console.log(displayRef);
      if (displayRef.current == 0) {
        // console.log("0");
        if (!fetchMorePosts1) setfetchMorePosts1(true);
      }
      if (displayRef.current == 1) {
        // console.log("1");
        if (!fetchMorePosts2) setfetchMorePosts2(true);
      }
    } else {
      setfetchMorePosts1(false);
      setfetchMorePosts2(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // if (inputEl.current) firstLoad(inputEl.current);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // clearInterval(interval);
    };
  }, []);

  const changeDisplaySection = async (num: number) => {
    const lastDisplaySection = displaySection;

    let tempScroll = scrollPositions;
    if (lastDisplaySection == num) {
      tempScroll[lastDisplaySection] = 0;
    } else {
      tempScroll[lastDisplaySection] = window.pageYOffset;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "scrollPositions",
        JSON.stringify(tempScroll)
      );
    }

    setDisplaySection(num);
    setScrollPositions(tempScroll);

    switch (num) {
      case 0:
        setTrending(false);
        // trendingQuery.refetch({
        //   anti: false,
        // });

        setTimeout(() => {
          window.scrollTo({ top: scrollPositions[0], behavior: "auto" });
        }, 350);

        break;
      case 1:
        setTrending(true);

        // trendingQuery.refetch({
        //   anti: true,
        // });
        setTimeout(() => {
          window.scrollTo({ top: scrollPositions[1], behavior: "auto" });
        }, 350);
        break;
    }
  };

  header = (
    <Wrapper>
      <Flex
        m={0}
        mb={3}
        alignItems={"center"}
        justifyContent={"center"}
        gridAutoFlow={"column"}
      >
        <Button
          size={"sm"}
          pt={6}
          pb={6}
          w={"100%"}
          rounded={"none"}
          colorScheme={displaySection == 0 ? "primary" : "gray"}
          onClick={() => {
            if (swiper) swiper.slidePrev(200, false);
            changeDisplaySection(0);
          }}
        >
          Agreeable
        </Button>
        <Button
          size={"sm"}
          pt={6}
          pb={6}
          w={"100%"}
          rounded={"none"}
          // roundedRight={"md"}
          colorScheme={displaySection == 1 ? "primary" : "gray"}
          onClick={() => {
            if (swiper) swiper.slideNext(200, false);
            changeDisplaySection(1);
          }}
        >
          Controversial
        </Button>
      </Flex>
    </Wrapper>
  );

  if (meQuery.data?.me) {
  } else if (!meQuery.loading) {
  }

  let [swiper, setSwiper] = useState<any | null>(null);
  const swiperRef = useRef<any | null>(null);

  useEffect(() => {
    if (swiper) {
      setTimeout(() => {
        if (!swiper.destroyed) swiper.updateAutoHeight();
      }, 500);
    }
  }, [swiper]);

  return (
    <>
      <Head>
        <title>Debaccle</title>
        <meta name="description" content="It's full of opinions, yikes."></meta>
      </Head>

      <Layout meQuery={meQuery}>
        <Box
          position={"sticky"}
          top={isMobile ? 0 : 16}
          zIndex={40}
          bg={colorMode === "light" ? "#f8f8ff" : "#20232B"}
        >
          {header}
        </Box>

        <Swiper
          // install Swiper modules
          onInit={(core: SwiperCore) => {
            swiperRef.current = core.el;
          }}
          modules={[]}
          // effect="fade"
          // fadeEffect={{ crossFade: true }}
          spaceBetween={0}
          slidesPerView={1}
          autoHeight
          onSwiper={(swiper) => {
            setSwiper(swiper);
          }}
          onSlideChange={(event) => {
            changeDisplaySection(event.activeIndex);
          }}
        >
          <SwiperSlide>
            {/* <ScaleFade initialScale={0.5} in={isPost1Open}> */}
            <Posts
              postsQueryResults={null}
              trendingQueryResults={trendingQuery}
              meQuery={meQuery}
              fetchMorePosts={fetchMorePosts1}
              swiper={swiper}
            />
            {/* </ScaleFade> */}
          </SwiperSlide>
          <SwiperSlide>
            {/* <ScaleFade initialScale={0.5} in={isPost2Open}> */}
            <Posts
              postsQueryResults={null}
              trendingQueryResults={antiTrendingQuery}
              meQuery={meQuery}
              fetchMorePosts={fetchMorePosts2}
              swiper={swiper}
            />
            {/* </ScaleFade> */}
          </SwiperSlide>
        </Swiper>
      </Layout>
    </>
  );
};

export default Index;
