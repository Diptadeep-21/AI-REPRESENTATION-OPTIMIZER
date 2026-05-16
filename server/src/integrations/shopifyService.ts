import axios from "axios";

export const fetchProductsFromShopify =
  async () => {
    const storeDomain =
      process.env.SHOPIFY_STORE_DOMAIN;

    const accessToken =
      process.env.SHOPIFY_ACCESS_TOKEN;

    const response = await axios.get(
      `https://${storeDomain}/admin/api/2025-01/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token":
            accessToken,
        },
      }
    );

    return response.data.products;
  };