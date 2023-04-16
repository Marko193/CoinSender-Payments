import { gql } from 'graphql-request';

export const CONTENT_API_QUERY_GQL = gql`
  query channels($where: JSON) {
    channels(where: $where) {
      name
      collection_address
      assets
      summary
      associated_brands {
        web_domain_url
        instagram_profile_url
        twitter_profile_url
      }
      series {
        title
        summary
        seasons {
          id
          episodes {
            lrn
            title
            summary
            assets
          }
        }
      }
      miniseries {
        id
        episodes {
          lrn
          title
          summary
          assets
        }
      }
      features {
        lrn
        title
        summary
        assets
      }
    }
  }
`;

export const SUSHI_TOKENS_QUERY_GQL = gql`
  query CoinsenderTokensQuery {
    tokens(first: 100, orderDirection: desc, orderBy: txCount, where: { decimals_gte: "6" }) {
      symbol
      id
      name
      decimals
    }
  }
`;

export const SUSHI_PAIRS_QUERY_GQL = gql`
  query CoinsenderPairsQuery {
    pairs(orderDirection: asc, first: 1000) {
      id
      name
      volumeUSD
      volumeToken1
      volumeToken0
      token1Price
      token0Price
      token0 {
        name
        symbol
        volumeUSD
        volume
        id
        decimals
      }
      token1 {
        id
        name
        symbol
        volume
        volumeUSD
        decimals
      }
    }
  }
`;

export const SUSHI_FACTORY_PAIRS_QUERY_GQL = gql`
  query CoinsenderFactoryQuery {
    tokens {
      id
      factory {
        pairs {
          id
        }
      }
    }
  }
`;
