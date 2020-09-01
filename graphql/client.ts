import { GraphQLClient } from 'graphql-request';
export { gql } from 'graphql-request';

const client = new GraphQLClient('https://graphql.fauna.com/graphql', {
  headers: {
    authorization: `Bearer ${process.env.FAUNA_KEY}`,
    'X-Schema-Preview': `partial-update-mutation`,
  },
});

export default client;
