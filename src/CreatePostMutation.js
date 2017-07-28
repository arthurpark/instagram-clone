/**
 * CreatePostMutation
 * @flow
 */
import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from './Environment';

let tempID = 0;

const mutation = graphql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        id
        description
        imageUrl
      }
    }
  }
`;

export default (description, imageUrl, viewerId, callback) => {
  const variables = {
    input: {
      description,
      imageUrl,
      clientMutationId: ''
    }
  };

  commitMutation(environment, {
    mutation,
    variables,
    optimisticUpdater: proxyStore => {
      // 1 - create the `newPost` as a mock that can be added to the store
      const id = 'client:newPost:' + tempID++;
      const newPost = proxyStore.create(id, 'Post');
      newPost.setValue(id, 'id');
      newPost.setValue(description, 'description');
      newPost.setValue(imageUrl, 'imageUrl');

      // 2 - add `newPost` to the store
      const viewerProxy = proxyStore.get(viewerId);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'ListPage_allPosts'
      );
      if (connection) {
        ConnectionHandler.insertEdgeAfter(connection, newPost);
      }
    },
    updater: proxyStore => {
      // 1 - retrieve the `newPost` from the server response
      const createPostField = proxyStore.getRootField('createPost');
      const newPost = createPostField.getLinkedRecord('post');

      // 2 - add `newPost` to the store
      const viewerProxy = proxyStore.get(viewerId);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'ListPage_allPosts'
      );
      if (connection) {
        ConnectionHandler.insertEdgeAfter(connection, newPost);
      }
    },
    onComplete: () => {
      callback();
    },
    onError: error => {
      console.error(error);
    }
  });
};
