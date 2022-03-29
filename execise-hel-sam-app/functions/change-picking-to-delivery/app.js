// const crypto = require("crypto");
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event) => {
    console.log('EVENT: ', event);
    const { orderTime, email, orderID } = event;

    let params = {
        TableName: "Order-gzpe5jhopfh7fnucfxuuwifqry-dev",
        Key: {
            "id": orderID
        },
        UpdateExpression: "set statusOrder = :s",
        ExpressionAttributeValues: {
            ":s": "Delivery"
        },
        ReturnValues: "UPDATED_NEW"
    }

    try {
        await docClient.update(params).promise();
    } catch (error) {
        console.log('ERROR: ', error);
    }

    return {
        email,
        orderTime,
        orderID
    };
};
