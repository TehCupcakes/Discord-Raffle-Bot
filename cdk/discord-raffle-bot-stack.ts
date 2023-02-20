import * as path from 'path'

import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { FunctionOptions, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { DiscordBot } from './discord-bot'

export class DiscordRaffleBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create lambdas
    const lambdaEnv: FunctionOptions['environment'] = {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DISCORD_APPLICATION_ID: this.node.tryGetContext('discordAppId'),
      DISCORD_APPLICATION_PUBLIC_KEY: this.node.tryGetContext('discordAppPublicKey'),
      DISCORD_BOT_TOKEN: 'TODO', // Don't reveal this in CFN. Update the lambda after deploy
    }

    const discordCommandsLambda = new NodejsFunction(this, 'CommandsLambda', {
      runtime: Runtime.NODEJS_16_X,
      entry: path.resolve('src/handlers/discordRaffleCommands.ts'),
      handler: 'handler',
      environment: lambdaEnv,
      timeout: Duration.seconds(60),
    })

    // Handles creating the API gateway, sending responses to Discord, and invokes the commands lambda
    new DiscordBot(this, 'DiscordBot', {
      apiName: 'discord-raffle-bot-api',
      commandsLambdaFunction: discordCommandsLambda,
    })
  }
}
