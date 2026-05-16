import {
  shopifyApi,
  ApiVersion,
} from "@shopify/shopify-api";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",

  apiSecretKey:
    process.env.SHOPIFY_API_SECRET || "",

  scopes: ["read_products"],

  hostName: "localhost",

  apiVersion: ApiVersion.April25,

  isEmbeddedApp: false,
});