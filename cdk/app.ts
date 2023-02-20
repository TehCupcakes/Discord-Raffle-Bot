#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { DiscordRaffleBotStack } from './discord-raffle-bot-stack'

const app = new cdk.App()
new DiscordRaffleBotStack(app, 'DiscordRaffleBotStack', {})
