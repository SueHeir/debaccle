import { Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import { useMeQuery } from "../generated/graphql";

export const About: React.FC<{}> = ({}) => {
  const meQuery = useMeQuery();

  return (
    <Layout meQuery={meQuery}>
      <Text align={"center"} fontSize={35} mb={4}>
        Welcome To Debaccle
      </Text>

      <Text align={"center"} fontSize={25} mb={4}>
        We are just a single person wanting to run a social Experiment.
      </Text>

      <Text align={"center"} fontSize={20} mb={4}>
        {`Debaccle's goal is to test the idea of a zero-sum "energy is conserved"
        social media platform. Posting cost points, and those points go to your
        followers. Upvoting cost points, and those points go to who you upvoted.
        Downvotes go to the haters.`}
      </Text>
      <Text align={"center"} fontSize={20}>
        {`Haters' gonna hate, enjoy it. Maybe they're just
        downvoting to help you get an achievement?`}
      </Text>
    </Layout>
  );
};

export default About;
