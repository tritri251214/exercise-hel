const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");

AWS.config.update({
  region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const eventBridge = new AWS.EventBridge();
const eventUserID = "0e521f2f-db6b-429b-b3e5-e113b5cbdb68";

const handleSendMailToMember = async (email) => {
  let params = {
    TableName: "ConfigMailTrap",
    Key: {
      id: "only-first-item"
    }
  }
  let response = await docClient.get(params).promise();
  let config = response.Item;

  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  return await transporter.sendMail({
    from: '"Execise Hel" <nmtri3@tma.com.vn>',
    to: email,
    subject: `You have the order`,
    text: `You have the order, please contact with admin to prepare or waiting for admin Picking`,
    html: `<h2>You have the order, please contact with admin to prepare or waiting for admin Picking</h2>`
  });
}

const getUserInformation = async (userID) => {
  let params = {
    TableName: "UserAddress-gzpe5jhopfh7fnucfxuuwifqry-dev",
    IndexName: 'byUserID',
    KeyConditionExpression: 'userID = :userID',
    ExpressionAttributeValues: {
      ':userID': userID
    }
  }
  let response = await docClient.query(params).promise();
  return response.Items[0];
}

const eventBridgeFunction = async () => {
  // const params = {
  //   Entries: [
  //     {
  //       Detail: JSON.stringify({ test: "hello-word" }),
  //       DetailType: 'ChangeOrderTable',
  //       EventBusName: 'EventDynamoDBStreams',
  //       Source: 'exercise.hel'
  //     }
  //   ]
  // };
  // const response = await eventBridge.putEvents(params).promise();
  const response = await eventBridge.listRules().promise();
  console.log('response: ', response);
}

const handler = async (userID) => {
  // const userInformation = await getUserInformation(userID);
  // await handleSendMailToMember(userInformation.email);
  // console.log('Send mail successfully');
  await eventBridgeFunction();
};

handler(eventUserID);

