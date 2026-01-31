import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000',
});

const authLink = setContext((_: unknown, { headers }: { headers?: Record<string, string> }) => {
  const token = localStorage.getItem('galathura_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          employees: {
            merge(_existing: unknown[] = [], incoming: unknown[]) {
              return incoming;
            },
          },
          transactions: {
            merge(_existing: unknown[] = [], incoming: unknown[]) {
              return incoming;
            },
          },
          attendanceRecords: {
            merge(_existing: unknown[] = [], incoming: unknown[]) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
