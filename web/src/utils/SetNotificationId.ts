import React from "react";
import { Box, Flex } from "@chakra-ui/layout";
import { useMeQuery } from "../generated/graphql";

import OneSignal from "react-onesignal";

export const SetNotificationId = async (id: Number) => {
  // console.log("hello");
  OneSignal.isPushNotificationsEnabled(function (isEnabled) {
    if (!isEnabled) {
      // console.log("Push notifications are not enabled yet.");
      OneSignal.showNativePrompt();
    } else {
      // console.log("Push notifications are enabled!");
      OneSignal.setExternalUserId(id.toString());
    }
  });

  return null;
};
Box;
