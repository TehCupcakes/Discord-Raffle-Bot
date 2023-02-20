import { DiscordEventRequest, DiscordEventResponse } from '../types'
import { Lambda } from 'aws-sdk'
import { sign } from 'tweetnacl'

const lambda = new Lambda()

/**
 * Handles incoming events from the Discord bot.
 * @param {DiscordEventRequest} event The incoming request to handle.
 * @return {DiscordEventResponse} Returns a response to send back to Discord.
 */
export const handler = async (event: DiscordEventRequest): Promise<DiscordEventResponse> => {
  console.log(`Received event: ${JSON.stringify(event)}`)

  const valid = await verifyEvent(event)
  if (!valid) {
    throw new Error('[UNAUTHORIZED] invalid request signature')
  }

  if (event) {
    switch (event.jsonBody.type) {
      case 1:
        // Return pongs for pings
        return {
          type: 1,
        }
      case 2:
        // Slash command executed
        console.log('Invoking commands lambda...')
        await lambda.invoke({
          FunctionName: process.env.COMMAND_LAMBDA_ARN as string,
          Payload: JSON.stringify(event),
          InvocationType: 'Event',
        }).promise()
        console.log('Returning temporary response. See commands lambda for further processing.')
        return {
          type: 5,
        }
    }
  }

  throw new Error('[UNAUTHORIZED] Unexpected event type')
}

/**
 * Verifies that an event coming from Discord is legitimate.
 * @param {DiscordEventRequest} event The event to verify from Discord.
 * @return {boolean} Returns true if the event was verified, false otherwise.
 */
export async function verifyEvent(event: DiscordEventRequest): Promise<boolean> {
  try {
    console.log('Verifying incoming event...')
    const isVerified = sign.detached.verify(
      Buffer.from(event.timestamp + JSON.stringify(event.jsonBody)),
      Buffer.from(event.signature, 'hex'),
      Buffer.from(process.env.DISCORD_APPLICATION_PUBLIC_KEY ?? '', 'hex'),
    )
    console.log('Returning verification results...')
    return isVerified
  } catch (exception) {
    console.log(exception)
    return false
  }
}
