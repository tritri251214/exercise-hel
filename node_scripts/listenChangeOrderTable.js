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

  return await transporter.sendMail({
    from: '"Execise Hel" <nmtri3@tma.com.vn>',
    to: email,
    subject: `You have the order`,
    text: `You have the order, please contact with admin to prepare or waiting for admin Picking`,
    html: `<h2>You have the order, please contact with admin to prepare or waiting for admin Picking</h2>`
  });
}

const getUserInformation = async (id) => {
  let params = {
    TableName: "UserAddress-gzpe5jhopfh7fnucfxuuwifqry-dev",
    IndexName: 'byUserID',
    KeyConditionExpression: 'userID = :userID',
    ExpressionAttributeValues: {
      ':userID': id
    }
  }
  let response = await docClient.query(params).promise();
  return response.Items[0];
}

const userID = "0e521f2f-db6b-429b-b3e5-e113b5cbdb68";
getUserInformation(userID).then(async (userInformation) => {
  console.log('userInformation: ', userInformation);
  const response = await handleSendMailToMember(userInformation.email);
  console.log('handleSendMailToMember: ', response);
});

