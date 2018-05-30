const app = require('express')();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const debug = process.env.NODE_ENV !== "production";
mongoose.connect(debug ? 'mongodb://localhost/seminar' : process.env.PROD_DB);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

  type Authenticate {
    status: Int,
    user: User,
    server: String
  }

  type User {
    name: String,
    email: String
  }

  type Message {
    text: String,
    author: User
  }

  type Channel {
    id: String,
    name: String,
    messages: [Message]
  }

  type Server {
    id: String,
    name: String,
    code: String,
    members: [User],
    channels: [Channel]
  }

  type Query {
    server(id: String, code: String): Server,
    channel(id: String): Channel,
    channels(belongsTo: String): [Channel],
    verifyToken(token: String!): Int,
    auth(token: String!): Authenticate
  }

  type NewServer {
    status: Int,
    code: String
  }

  type Login {
    status: Int,
    token: String
  }

  type JoinServer {
    status: Int,
    server: Server
  }

  type CreateChannel {
    status: Int,
    channel: Channel
  }
  
  type CreateMessage {
    status: Int,
    message: Message
  }

  type Mutation {
    createServer(name: String!, token: String!): NewServer,
    login(name: String, email: String, token: String): Login,
    joinServer(code: String!, token: String!): JoinServer,
    createChannel(name: String!, token: String!): CreateChannel,
    sendMessage(text: String!, token: String!, channel: String!): CreateMessage
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  server: require('./controllers/server')(false),
  channel: require('./controllers/channel')(false),
  channels: require('./controllers/channel')(true),
  verifyToken: require('./auth/auth').verify,
  createServer: require('./controllers/createServer'),
  login: require('./auth/auth').login,
  joinServer: require('./controllers/joinServer'),
  createChannel: require('./controllers/createChannel'),
  auth: require('./auth/auth').getUser,
  sendMessage: require('./controllers/sendMessage')
};

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', (req, res) => {
  res.redirect(debug ? 'http://localhost:8100/' : 'https://app.back-chat.com');
});

const port = process.env.PORT || 4000;
const url = debug
  ? `http://localhost:${port}/graphql`
  : `https://back-chat.com/graphql`;

app.listen(port);

console.log(`The server is running at ${url}!`);
