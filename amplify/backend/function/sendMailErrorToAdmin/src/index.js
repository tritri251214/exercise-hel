const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log('EVENT: ', event);
    const message = event.arguments.data.errors[0].message;

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
        to: "admin@gmail.com",
        subject: `Happen error in Execise App`,
        text: `Execise App happen error`,
        html: `<h2>Execise App happen error:</h2> ${message}`
    });

    return {
        statusCode: 200,
        message: 'Send mail error to admin successfully'
    };
};
