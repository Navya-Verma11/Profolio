import { createApolloClient } from '@nhost/apollo';
import nhost from './nhost';

const apolloClient = createApolloClient({ nhost });

export default apolloClient;
