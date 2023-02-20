import { Duration } from 'aws-cdk-lib'
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Cors, LambdaIntegration, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

/**
 * The properties required for the Discord Bot construct. Specifically
 * requires the Lambda function where commands will be sent.
 */
export interface DiscordBotProps {
  apiName: string;
  commandsLambdaFunction: Function;
}

/**
 * A CDK Construct for setting up a serverless Discord bot.
 */
export class DiscordBot extends Construct {
  /**
   * The constructor for building the stack.
   * @param {Construct} scope The Construct scope to create the Construct in.
   * @param {string} id The ID of the Construct to use.
   * @param {DiscordBotProps} props The properties to configure the Construct.
   */
  constructor(scope: Construct, id: string, props: DiscordBotProps) {
    super(scope, id)

    // Create the Lambda for handling Interactions from our Discord bot.
    const discordBotLambda = new NodejsFunction(this, 'DiscordBotLambda', {
      runtime: Runtime.NODEJS_16_X,
      entry: path.resolve('src/handlers/discordBotFunctions.ts'),
      handler: 'handler',
      environment: {
        COMMAND_LAMBDA_ARN: props.commandsLambdaFunction.functionArn,
        DISCORD_APPLICATION_PUBLIC_KEY: this.node.tryGetContext('discordAppPublicKey'),
      },
      timeout: Duration.seconds(10),
    })
    props.commandsLambdaFunction.grantInvoke(discordBotLambda)

    // Create our API Gateway
    const discordBotApi = new RestApi(this, 'DiscordBotApi', {
      restApiName: props.apiName,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    })
    const discordBotApiValidator = new RequestValidator(this, 'DiscordBotApiValidator', {
      restApi: discordBotApi,
      validateRequestBody: true,
      validateRequestParameters: true,
    })

    // User authentication endpoint configuration
    const discordBotEventItems = discordBotApi.root.addResource('event', {
      defaultCorsPreflightOptions: {
        allowOrigins: [
          '*',
        ],
      },
    })

    // Transform our requests and responses as appropriate.
    const discordBotIntegration: LambdaIntegration = new LambdaIntegration(discordBotLambda, {
      proxy: false,
      requestTemplates: {
        'application/json': '{\r\n\
          "timestamp": "$input.params(\'x-signature-timestamp\')",\r\n\
          "signature": "$input.params(\'x-signature-ed25519\')",\r\n\
          "jsonBody" : $input.json(\'$\')\r\n\
        }',
      },
      integrationResponses: [
        {
          statusCode: '200',
        },
        {
          statusCode: '401',
          selectionPattern: '.*[UNAUTHORIZED].*',
          responseTemplates: {
            'application/json': 'invalid request signature',
          },
        },
      ],
    })

    // Add a POST method for the Discord APIs.
    discordBotEventItems.addMethod('POST', discordBotIntegration, {
      apiKeyRequired: false,
      requestValidator: discordBotApiValidator,
      methodResponses: [
        {
          statusCode: '200',
        },
        {
          statusCode: '401',
        },
      ],
    })
  }
}
