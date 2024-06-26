import { gql } from "urql";

export const POOLS = gql`
  query Pools(
    $assetOpts: NoneTypeNoneTypeListOptions
    $opts: PoolFilterPoolOrderingListOptions
  ) {
    pools(opts: $opts) {
      assets(opts: $assetOpts) {
        imageUrl
        unitName
        id
      }
      name
      totalLoanTemplates
      netValue
      id
      totalContributors
    }
  }
`;

export const POOL = gql`
  query Pool($poolId: Int!) {
    pool(poolId: $poolId) {
      totalLoansValue
      totalLoanTemplates
      totalContributors
      totalContributions
      netValue
      name
      id
      dateAdded
      manager {
        id
        address
      }
    }
  }
`;
