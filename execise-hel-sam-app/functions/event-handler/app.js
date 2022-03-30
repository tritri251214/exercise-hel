// const crypto = require("crypto");
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2"
});

exports.lambdaHandler = async (event) => {
    console.log('EVENT: ', event);
};
