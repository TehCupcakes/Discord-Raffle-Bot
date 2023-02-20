import { DiscordEventRequest } from '../types'

export const handler = async (event: DiscordEventRequest): Promise<any> => {
  console.log('Running Discord command handler...', JSON.stringify(event, null, 2))
}
