export const normalizeProduct = (
  product: any
) => {
  const description =
    product.body_html || "";

  const title =
    product.title || "Untitled Product";

  const productType =
    product.product_type || "General";

  const tags = product.tags
    ? product.tags
        .split(",")
        .map((tag: string) =>
          tag.trim()
        )
    : [];

  return {
    title,

    description,

    category: productType,

    productType,

    tags,

    vendor: product.vendor || "",

    status:
      product.status || "active",

    price: Number(
      product.variants?.[0]?.price || 0
    ),

    images:
      product.images?.map(
        (img: any) => img.src
      ) || [],

    metadata: {
      material:
        description.includes("Leather")
          ? "Leather"
          : "Unknown",

      waterproof:
        description
          .toLowerCase()
          .includes("waterproof"),

      terrain: tags,

      shopifyProductId:
        String(product.id),
    },
  };
};