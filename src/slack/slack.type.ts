export type createChannelInput = {
  channelName: string;
  is_private: boolean;
};

export type postMessageInput = {
  channelId: string;
  message: string;
};

export type SlackCommandInput = {
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
