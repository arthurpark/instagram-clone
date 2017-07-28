import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';
import ListPage from './ListPage';

const AppAllPostQuery = graphql`
  query AppAllPostQuery {
    viewer {
      ...ListPage_viewer
    }
  }
`;

class App extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={AppAllPostQuery}
        render={({ error, props }) => {
          if (error) {
            return (
              <div>
                {error.message}
              </div>
            );
          } else if (props) {
            return <ListPage viewer={props.viewer} />;
          }

          return <div>Loading</div>;
        }}
      />
    );
  }
}

export default App;
