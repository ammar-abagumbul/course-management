"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import { useUpdateUserMutation } from "@/state/api";
import {
  NotificationSettingsFormData,
  notificationSettingsSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
const SharedNotificationSettings = ({
  title = "Notification Settings",
  subtitle = "Manage your notification preferences",
}: SharedNotificationSettingsProps) => {
  const { user } = useUser();
  const [updateUser] = useUpdateUserMutation();

  const currentSettings =
    (user?.publicMetadata as { settings?: UserSettings })?.settings || {};

  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings.courseNotifications || false,
      emailAlerts: currentSettings.emailAlerts || false,
      smsAlerts: currentSettings.smsAlerts || false,
      notificationFrequency: currentSettings.notificationFrequency || "daily",
    },
  });

  const onSubmiit = async (data: NotificationSettingsFormData) => {
    if (!user) return;

    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        settings: {
          ...currentSettings,
          ...data,
        },
      },
    };
    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.log("Failed to update settings: ", error);
    }
    if (!user) return <div>Please sign in to update your settings</div>;
  };

  return (
    <div className="notification-settings">
      <Header title={title} subtitle={subtitle}></Header>
    </div>
  );
};

export default SharedNotificationSettings;
