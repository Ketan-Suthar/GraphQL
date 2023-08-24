const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const neo4j = require('neo4j-driver')

// const uri = 'bolt://localhost:7687'
// const username = 'neo4j'
// const password = 'password1234'

// const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

// const session = driver.session()

// const query = 'MATCH (n) RETURN n LIMIT 5';

// session.run(query)
//   .then(result => {
//     result.records.forEach(record => {
//       console.log(record.get(0));
//     });
//   })
//   .catch(error => {
//     console.error('Error executing query:', error);
//   })
//   .finally(() => {
//     session.close();
//     driver.close();
//   });


const app = express()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("BookStore");
})

