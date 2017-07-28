import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from './Environment';

const mutation = graphql`
  mutation DeletePostMutation($input: DeletePostInput!) {
    deletePost(input: $input) {
      deletedId
    }
  }
`;

export default (postId, viewerId) => {
  const variables = {
    input: {
      id: postId,
      clientMutationId: ''
    }
  };
  commitMutation(environment, {
    mutation,
    variables,
    onError: err => console.error(err),
    updater: proxyStore => {
      const deletePostField = proxyStore.getRootField('deletePost');
      const deletedId = deletePostField.getValue('deletedId');
      const viewerProxy = proxyStore.get(viewerId);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'ListPage_allPosts'
      );
      if (connection) {
        ConnectionHandler.deleteNode(connection, deletedId);
      }
    },
    optimisticUpdater: proxyStore => {
      const viewerProxy = proxyStore.get(viewerId);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'ListPage_allPosts'
      );
      if (connection) {
        ConnectionHandler.deleteNode(connection, postId);
      }
    }
  });
};
