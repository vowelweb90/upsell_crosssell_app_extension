export const getProduct = async (productId: string) => {
  // Get Product data for token to make up product id.
  const shopUrl = `https://${window.location.host}`;
  const productRes = await fetch(
    `${shopUrl}/apps/upsell_crosssell/api/extension/products/${productId}`
  );
  const productData = await productRes.json();

  console.log("productData: ", productData);

  return productData;
};
