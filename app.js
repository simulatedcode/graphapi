const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mysql = require("mysql");

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "archive_prod",
  password: "password",
  database: "prod_ivaa",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database as ID " + connection.threadId);
});

const schema = buildSchema(`
  type pelaku_seni {
    id: Int
    name: String
    fullname: String
    description: String
    }
  type view_artworks {
  id: Int
  title: String
}

  type Query {
        pelaku_seni(id: String): [pelaku_seni]!
        view_artworks(id:String): [view_artworks]!
     }
`);

const resolvers = {
  pelaku_seni: (args, request) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM pelaku_seni", (err, rows) => {
        if (err) {
          console.error("Error fetching pelaku_seni: " + err.stack);
          reject("Error fetching pelaku_seni");
        }
        resolve(rows);
      });
    });
  },
  view_artworks: (args, request) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM view_artworks", (err, rows) => {
        if (err) {
          console.error("Error fetching view_artworks: " + err.stack);
          reject("Error fetching view_artworks");
        }
        resolve(rows);
      });
    });
  },
};

app.use(
  "/archive",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server run on port 3000");
});
