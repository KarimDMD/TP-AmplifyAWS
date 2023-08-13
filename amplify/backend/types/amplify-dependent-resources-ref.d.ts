export type AmplifyDependentResourcesAttributes = {
  "api": {
    "api2": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "tpamplifyaws34045890": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "lambdaapi2": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "dynamocomments": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    },
    "s3tripimages": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}