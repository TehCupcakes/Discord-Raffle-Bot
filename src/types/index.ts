/**
 * A server role assigned to a user.
 */
export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  mentionable: boolean;
}

/**
 * A Discord member and their properties.
 */
export interface DiscordMember {
  deaf: boolean;
  roles: string[];
  user: DiscordUser;
}

/**
 * The user information for a Discord member.
 */
export interface DiscordUser {
  id: number;
  username: string;
  discriminator: string;
}

/**
 * The incoming request, created via API Gateway request templates.
 */
export interface DiscordEventRequest {
  timestamp: string;
  signature: string;
  jsonBody: DiscordJsonBody;
}

/**
 * The actual Discord request data.
 */
export interface DiscordJsonBody {
  id: string,
  token?: string,
  data?: DiscordRequestData;
  member?: DiscordMember;
  type: number;
  version: number;
  application_id: string;
  channel_id: string;
}

/**
 * The data in the Discord request. Should be handled for actually parsing commands.
 */
export interface DiscordRequestData {
  id: string;
  name: string;
  guild_id?: string;
  type?: number;
  options?: DiscordRequestDataSubcommand[] | DiscordRequestDataOption[];
}

/**
 * Subcommands have a name and more command options underneath them.
 */
export interface DiscordRequestDataSubcommand {
  name: string;
  type: number;
  options: DiscordRequestDataOption[];
}

/**
 * The name and value for a given command option if available.
 */
export interface DiscordRequestDataOption {
  name: string;
  type: number;
  value: string;
}

/**
 * The response to send back for a Discord request.
 */
export interface DiscordEventResponse {
  type: number;
  data?: DiscordResponseData;
}

/**
 * The actual response data that will be used in the resulting Discord message.
 */
export interface DiscordResponseData {
  tts: boolean;
  content: string;
  embeds: DiscordEmbed[];
  allowed_mentions: string[]; // eslint-disable-line camelcase
  flags?: Number;
  username?: string;
  avatar_url?: string; // eslint-disable-line camelcase
}

/**
 * The embedded elements in a Discord message
 */
export interface DiscordEmbed {
  type: DiscordEmbedType.RICH; // Webhook embeds MUST use rich type
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  image?: DiscordEmbedMedia;
  video?: DiscordEmbedMedia;
  thumbnail?: unknown;
  provider?: unknown;
  fields?: DiscordEmbedField[];
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbedMedia {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export enum DiscordEmbedType {
  RICH = 'rich',
  IMAGE = 'image',
  VIDEO = 'video',
  GIFV = 'gifv',
  ARTICLE = 'article',
  LINK = 'link'
}

export interface TwitchAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TwitchGamesResponse {
  data: TwitchGameInfo[]
}

export interface TwitchStreamsResponse {
  data: TwitchStreamInfo[]
}

export interface TwitchGameInfo {
  id: string;
  name: string;
  box_art_url: string;
}

export interface TwitchStreamInfo {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface StreamInfoDynamo {
  user_id: string;
  user_name: string;
  game_name: string;
  title: string;
  last_seen: Date;
}

export interface ChannelSubscription {
  webhookId: string;
  webhookToken: string;
  twitchCategories: TwitchGameInfo[];
}

export interface ChannelBlocklist {
  usernames: string[];
}
