import React from 'react';
import RouterComponent from './routes';

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';



const client = new ApolloClient({uri: "http://localhost:6357/graphql"});


class App extends React.Component {
    render() {
        return(
          <ApolloProvider client={client}>
            <RouterComponent />
          </ApolloProvider>
        );
    }
}

export default App;
