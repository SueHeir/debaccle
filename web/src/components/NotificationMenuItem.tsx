import React, { useEffect, useState } from "react";
import { MenuItem } from "@chakra-ui/react";

import { SetNotificationId } from "../utils/SetNotificationId";
import OneSignal from "react-onesignal";
interface PostProps {
  id: number;
}

export const NotificationMenuItem: React.FC<PostProps> = ({ id }) => {
  const [isEnabled, setIsEnable] = useState(false);
  const [user_ID, setuserid] = useState<string | null | undefined>("");

  useEffect(() => {
    getInfo();
  }, [user_ID, isEnabled]);

  const getInfo = async () => {
    const e = await OneSignal.isPushNotificationsEnabled();
    const i = await OneSignal.getExternalUserId();

    setIsEnable(e);
    setuserid(i);
  };

  let body = (
    <MenuItem
      w={"100%"}
      onClick={async () => {
        OneSignal.showNativePrompt().then((values) => {
          console.log(values);
        });
      }}
    >
      Allow Notifications
    </MenuItem>
  );

  if (!isEnabled) {
    // Not sure?
  } else {
    body = (
      <MenuItem
        w={"100%"}
        onClick={async () => {
          SetNotificationId(id);
          setuserid(id.toString());
        }}
      >
        Start Notifications
      </MenuItem>
    );

    if (user_ID == id.toString()) {
      body = (
        <MenuItem
          w={"100%"}
          onClick={async () => {
            OneSignal.setExternalUserId("");
            setuserid("");
          }}
        >
          Stop Notifications
        </MenuItem>
      );
    }
  }

  return <>{body}</>;
};
