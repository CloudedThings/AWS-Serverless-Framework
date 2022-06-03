const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/WebSocketMessage');

const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log(event);

  const { connectionId } = event.requestContext;

  const body = JSON.parse(event.body);

  try {
    const record = await Dynamo.get(connectionId, tableName);
    const { messages, domainName, stage } = record;

    messages.push(body.message);

    const data = {
      ...record,
      messages,
    };

    await Dynamo.write(data, tableName);

    await WebSocket.send({
      domainName,
      stage,
      connectionId,
      message: 'Automatic Response',
    });

    return Responses._200({ message: 'Received a message' });
  } catch (error) {
    return Responses._400({ message: 'Error while receiving message' });
  }
};
