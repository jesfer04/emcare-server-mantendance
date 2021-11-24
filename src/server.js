import { PrismaClient } from '@prisma/client';
import  express  from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
const cors = require('cors')

const prisma = new PrismaClient();
const typeDefs = `
  type Admin {
    email:     String!   
    name:      String!
    user:      String!
    password:  String!
  }
  type Query {
    allAdmins: [Admin!]!
    login(user: String!, password: String!): Admin
  }
`;
const resolvers = {
  Query: {
    allAdmins: async () => {
      return await prisma.admin.findMany();
    },
    login: async (_,args) => {
      const admin = await prisma.admin.findFirst({
        where: {
          user: args.user,
        },
      });
     
      if(admin){
        if(admin.password === args.password){
          return admin
        } else{
          throw new Error("CONTRASEÑA INCORRECTA");
        }
      }else{
        throw new Error("USUARIO NO EXISTE");
      }
    }
  }
};
export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');