import { Body } from "@nestjs/common";

export type createChannelInput = {
  channelName: string;
  is_private: boolean;
};

export type postMessage = {
  channelId: string;
  message: string;
};

export type SlackCommand = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
};
