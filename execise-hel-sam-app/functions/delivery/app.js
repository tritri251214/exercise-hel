const crypto = require("crypto");
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const { time, email } = event;

    let params = {
        TableName: "SendMail-ti4apa7sxbdvhegnhnjnjzu5n4-dev",
        Item: {
            id: crypto.randomBytes(16).toString("hex"),
            patientEmail: patientEmail,
            doctorEmail: doctorEmail,
            patientName: patientName,
            doctorName: doctorName,
            meetingTime: new Date(time).getTime(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    };

    await docClient.put(params).promise();

    return {
        id: crypto.randomBytes(16).toString("hex"),
        email,
        time
    };
};
