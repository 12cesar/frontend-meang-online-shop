import gql from 'graphql-tag';

export const CHARGE_FRAGMENT_OBJECT = gql `
    fragment ChargeObject on StripeCharge {
        id
        amount
        status
        receiptEmail
        receiptUrl
        paid
        created
        typeOrder
        description
        card
        customer
    }
`;
