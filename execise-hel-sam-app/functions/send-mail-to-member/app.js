// const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const { time, email } = event;

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
        to: `${email}`,
        subject: `Your order preparing`,
        text: `Admin picking your order. Please waiting prepare foods`,
        html: `<h2>You have a order that preparing foods</h2>`
    });

    return {
        email,
        time
    };
};
