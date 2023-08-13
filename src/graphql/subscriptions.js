/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
      id
      place
      comment
      rate
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
      id
      place
      comment
      rate
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
      id
      place
      comment
      rate
      createdAt
      updatedAt
      __typename
    }
  }
`;
