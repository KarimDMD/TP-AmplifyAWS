/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB();
  if (event.httpMethod === "POST") {
    try {
      const requestBody = JSON.parse(event.body);
      const { place, comment, rate } = requestBody;

      const createdAt = new Date().toISOString();
      const itemId = `${place}-${createdAt}`;

      const params = {
        TableName: "dynamocomments-dev",
        Item: {
          id: { S: itemId },
          place: { S: place },
          comment: { S: comment },
          rate: { N: rate.toString() },
          createdAt: { S: createdAt },
        },
      };

      await dynamodb.putItem(params).promise();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify("Comment created successfully!"),
      };
    } catch (error) {
      console.error("Error creating comment:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify("Error creating comment"),
      };
    }
  } else if (event.httpMethod === "GET") {
    try {
      const queryParams = {
        TableName: "dynamocomments-dev",
      };

      const queryResult = await dynamodb.scan(queryParams).promise();
      const comments = queryResult.Items.map((item) => ({
        id: item.id.S,
        place: item.place.S,
        comment: item.comment.S,
        rate: parseFloat(item.rate.N),
        createdAt: item.createdAt.S,
      }));

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(comments),
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify("Error fetching comments"),
      };
    }
  } else if (event.httpMethod === "DELETE") {
    try {
      const commentId = event.path.substring(event.path.lastIndexOf("/") + 1);
      console.log("commentId " + commentId);

      const params = {
        TableName: "dynamocomments-dev",
        Key: {
          id: { S: commentId },
        },
      };

      await dynamodb.deleteItem(params).promise();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify("Comment deleted successfully!"),
      };
    } catch (error) {
      console.error("Error deleting comment:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify("Error deleting comment"),
      };
    }
  }
};
