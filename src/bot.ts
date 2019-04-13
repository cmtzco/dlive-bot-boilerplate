import * as WebSocket from 'ws';
import * as Config from 'config';



(async () => {
  //--------------------------------------------
  //            MAIN
  //--------------------------------------------
  const { roomId, websocketUrl} = Config.get('dLive');

  // Establish WS Connection:
  const ws: any = {};
  try {
    ws.primary = await connect(websocketUrl, 'graphql-ws');
    ws.secondary = await connect(websocketUrl, 'graphql-ws');
  } catch (WebSocketConnectionError) {
    console.log(`Error establishing connection to ${websocketUrl}: ${WebSocketConnectionError}`);
  }
  if (ws.primary && ws.secondary) {
    joinRoom(ws.primary, roomId);
    joinRoom(ws.secondary, roomId);
    console.log("Rooms Joined")
    ws.primary.on('message', listenForCommands);
  }

  //--------------------------------------------
  //            FUNCTIONS
  //--------------------------------------------

  function connect(url: string, subProtocol?: string): Promise<WebSocket|undefined> {
    return new Promise(async (resolve, reject) => {
      const ws = new WebSocket(url, subProtocol);
      ws.on('open', () => {
        const connectMessage = {
          type: 'connection_init',
          payload: {}
        }
        ws.send(JSON.stringify(connectMessage))

        resolve(ws);
      });
    });
  }

  function joinRoom(ws: WebSocket, roomId: string): void {
    const joinMessage = {"id":"1","type":"start","payload":{"variables":{"streamer":roomId},"extensions":{},"streamer":roomId,"operationName":"StreamMessageSubscription","query":"subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n"}};
    ws.send(JSON.stringify(joinMessage));
  }

  function listenForCommands(incomingMessage: string): void {
    console.log(incomingMessage)
    try {
      const jsonMessage = JSON.parse(incomingMessage);
      if (jsonMessage.type === 'data' ) { 
        jsonMessage.payload.data.streamMessageReceived.forEach(async (message: any) => {
          if (
            message.type === 'Gift') {
          if ( message.gift === "LEMON") {
            console.log("LEMON TIME")
          } else if ( message.gift === "ICE_CREAM") {
            console.log("ICE CREAM TIME")
          } else if ( message.gift === "DIAMOND") {
            console.log("DIAMOND TIME")
          } else if ( message.gift === "NINJAGHINI") {
            console.log("NINJAGHINI TIME")
          } else if ( message.gift === "NINJET") {
            console.log("NINJET TIME")
          }
        } else {
          console.log("Other message type");
          console.log(message);
        }
      });   
      }
    } catch (InvalidJsonError) {
      console.log(`Received an invalid JSON message - ${incomingMessage}`);
    }
  }


})(); setInterval(()=>{}, 10000); // Prevent this process from exiting


