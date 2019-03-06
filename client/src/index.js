import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


import './styles.css';


// import ApolloClient from 'apollo-boost';
// import gpl from 'graphql-tag';

// const client = new ApolloClient({
//     uri: 'http://localhost:6357/graphql'
// })

// client.query({
//     query: gpl`
//         {
//             companies {
//                 id
//                 name
//             }
//         }
//       `
// }).then(result => console.log(result));


ReactDOM.render(<App />, document.getElementById('root'));
