export const cardDiscountCodesUpdate = `
     mutation cartDiscountCodesUpdate($id: ID!, $discountCodes:[String!]) {
       cartDiscountCodesUpdate(cartId: $id, discountCodes: $discountCodes) {
         cart {
           id
         }
         userErrors {
           field
           message 
         }
       }
     }
     `;
