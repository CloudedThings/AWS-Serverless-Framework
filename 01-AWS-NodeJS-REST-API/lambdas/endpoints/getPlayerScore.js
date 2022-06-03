const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log('event', event);

  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the ID from the path' });
  }

  let ID = event.pathParameters.ID;

  const user = await Dynamo.get(ID, tableName).catch((err) => {
    console.log('Error when fetching data from Dynamo Get', err);
    return null;
  });

  if (!user) {
    return Responses._400({ message: 'Failed to get user by ID' });
  }

  return Responses._200({ user });
};
