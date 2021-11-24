"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = void 0;

var _client = require("@prisma/client");

var _express = _interopRequireDefault(require("express"));

var _expressGraphql = require("express-graphql");

var _schema = require("@graphql-tools/schema");

var prisma = new _client.PrismaClient();
var typeDefs = "\n  type Admin {\n    email:     String!   \n    name:      String!\n    user:      String!\n    password:  String!\n  }\n  type Query {\n    allAdmins: [Admin!]!\n  }\n";
var resolvers = {
  Query: {
    allAdmins: function allAdmins() {
      return prisma.user.findMany();
    }
  }
};
var schema = (0, _schema.makeExecutableSchema)({
  resolvers: resolvers,
  typeDefs: typeDefs
});
exports.schema = schema;
var app = (0, _express["default"])();
app.use('/graphql', (0, _expressGraphql.graphqlHTTP)({
  schema: schema
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');