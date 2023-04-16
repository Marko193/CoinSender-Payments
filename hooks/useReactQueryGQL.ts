import { SUSHI_SUBGRAPH } from '@/constants/requests';
import { request } from 'graphql-request';
import { useQuery } from 'react-query';

export const useReactQuerySushiGQL = (gqlQuery: any, queryKey: string, filterBy?: any) =>
  useQuery(queryKey, async () => {
    const data = await request(SUSHI_SUBGRAPH, gqlQuery, filterBy);
    return data;
  });
