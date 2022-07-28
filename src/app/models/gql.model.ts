import {
  gql
} from 'apollo-angular';

export const OPEN_BOX = gql `
mutation OpenBox($input: OpenBoxInput!) {
  openBox(input: $input) {
    boxOpenings {
      id
      itemVariant {
        id
        name
        value
      }
    }
  }
}
`;

export const BOX_SUBSRIPTION = gql `
subscription OnUpdateWallet {
  updateWallet {
    wallet {
      id
      amount
      name
    }
  }
}
`;
