const AWS = require("aws-sdk");
const moment = require("moment");

AWS.config.update({
    region: "us-east-2"
});

const stepFunctions = new AWS.StepFunctions();
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log('EVENT: ', event);
    const { orderID, email } = event.arguments.data;

    let paramsUpdate = {
        TableName: "Order-gzpe5jhopfh7fnucfxuuwifqry-dev",
        Key: {
            "id": orderID
        },
        UpdateExpression: "set statusOrder = :s",
        ExpressionAttributeValues: {
            ":s": "Picking"
        },
        ReturnValues: "UPDATED_NEW"
    }

    await docClient.update(paramsUpdate).promise();
    let prepareTime = moment().add(15, "minutes");

    const params = {
        stateMachineArn: 'arn:aws:states:us-east-2:730997293810:stateMachine:PrepareFoodsStepFunction-PfUQgE5fuWYE',
        input: JSON.stringify(
            {
                orderTime: prepareTime.toISOString(),
                email,
                orderID
            }
        )
    };
    await stepFunctions.startExecution(params).promise();
    return {
        statusCode: 200,
        message: 'Send mail to notify the order being delivered to member successfully'
    };
};
