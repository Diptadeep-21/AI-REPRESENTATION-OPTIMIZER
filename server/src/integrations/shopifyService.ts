import axios from "axios";

/*
 =====================================
 FETCH PRODUCTS FROM SHOPIFY
 =====================================
*/

export const fetchProductsFromShopify =
  async (

    shopifyDomain: string,

    accessToken: string
  ) => {

    const response =
      await axios.get(

        `https://${shopifyDomain}/admin/api/2026-04/products.json`,

        {
          headers: {

            "X-Shopify-Access-Token":
              accessToken,
          },
        }
      );

    return response.data.products;
  };