import { CHARGE_FRAGMENT_OBJECT } from '@graphql/operations/fragment/stripe/charge';
import gql from 'graphql-tag';

export const CHARGES_CUSTOMERS_LIST = gql`
  query obtenerPagosDelCliente(
    $customer: ID!
    $limit: Int
    $startingAfter: ID
    $endingBefore: ID
  ) {
    chargesByCustomers(
      customer: $customer,
      limit: $limit
      startingAfter: $startingAfter,
      endingBefore: $endingBefore
    ) {
      status
      message
      hasMore
      charges {
        ...ChargeObject
      }
    }
  }
  ${CHARGE_FRAGMENT_OBJECT}
`;
