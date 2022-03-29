const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");

AWS.config.update({
  region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

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

  await transporter.sendMail({
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
    KeyConditionExpression: 'userID = :userID',
    ExpressionAttributeValues: {
      ':userID': userID
    }
  }
  let response = await docClient.query(params).promise();
  console.log('response: ', response);
  return response.Items[0];
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log('EVENT: ', event.Records[0]);
  const record = event.Records[0];
  const eventName = record.eventName;
  const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
  if (eventName === 'INSERT' && newImage.statusOrder && (newImage.statusOrder === 'OrderPlaced')) {
    console.log('vao day');
    const userInformation = await getUserInformation(newImage.userID);
    console.log('userInformation: ', userInformation);
    handleSendMailToMember(userInformation.email);
  }
};
