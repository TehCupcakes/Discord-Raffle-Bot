# Discord Raffle Bot

## Setup

1. Clone this repo and install dependencies with `npm i`
2. Create a Discord application at https://discord.com/developers
3. Copy the application id and public key, then paste them in the `cdk.context.json`.
4. Deploy stack to AWS with `npm run deploy`
5. Copy the API Gateway path from the outputs.
  - Paste this in the "Interactions Endpoint URL" for the Discord app and append the word `event`.
  - Full URL will look like: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/event`
  - If done correctly, saving the app should succeed. If you get an error, double-check the interactions endpoint, as well as the application id and public key in `cdk.context.json`. You will need to redeploy if these are updated.
6. Under your Discord app, select the "Bot" tab and add a bot.
  - Disable "Public Bot"
  - Enable "Message Content Intent"
  - Copy the token and save it for the next step. **Keep this value a secret.**
  - (Optional) Change the Username and icon if you so please. This is what will be displayed when it sends messages in your server.
7. In AWS, navigate to lambda and find the function that starts with `DiscordRaffleBotStack-CommandsLambda`
  - Go to the Configuration tab and then "Environment variables".
  - Edit the variables and change `DISCORD_BOT_TOKEN` to the token you copied in step 6.
  - **NOTE**: If you make changes to the lambda infrastructure, you may need to come back here and change this again. There are better ways to handle secrets in AWS, but I took some shortcuts to make this quick to develop and free.
