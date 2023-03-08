const mysql = require('mysql');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();

const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'archive_prod',
	password: 'password',
	database: 'prod_ivaa',
});
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
  }
`);

const archive_prod = {
  users: (args, context) => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
