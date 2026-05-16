export const generateRecommendations = (
  issues: string[]
): string[] => {
  const recommendations: string[] = [];

  for (const issue of issues) {
    /*
     =========================
     DESCRIPTION
     =========================
    */

    if (
      issue ===
      "Product description is too short"
    ) {
      recommendations.push(
        "Expand the product description with detailed features, benefits, and use-cases."
      );
    }

    /*
     =========================
     TAGS
     =========================
    */

    if (
      issue ===
      "Insufficient semantic tags"
    ) {
      recommendations.push(
        "Add at least 5 semantic product tags for better AI discoverability."
      );
    }

    /*
     =========================
     PRODUCT TYPE
     =========================
    */

    if (
      issue ===
      "Missing product type/category"
    ) {
      recommendations.push(
        "Assign a clear product type and category classification."
      );
    }

    /*
     =========================
     TITLE
     =========================
    */

    if (
      issue ===
      "Product title lacks specificity"
    ) {
      recommendations.push(
        "Improve the product title with more descriptive and searchable keywords."
      );
    }

    /*
     =========================
     CATEGORY
     =========================
    */

    if (
      issue ===
      "Missing category classification"
    ) {
      recommendations.push(
        "Add structured category metadata for improved retrieval."
      );
    }

    /*
     =========================
     VENDOR
     =========================
    */

    if (
      issue ===
      "Vendor information missing"
    ) {
      recommendations.push(
        "Add vendor or brand information to improve trust signals."
      );
    }

    /*
     =========================
     PRICING
     =========================
    */

    if (
      issue ===
      "Invalid product pricing"
    ) {
      recommendations.push(
        "Provide accurate product pricing information."
      );
    }

    /*
     =========================
     IMAGES
     =========================
    */

    if (
      issue ===
      "No product images available"
    ) {
      recommendations.push(
        "Upload high-quality product images to improve AI ranking."
      );
    }

    if (
      issue ===
      "Too few product images"
    ) {
      recommendations.push(
        "Add multiple product images from different angles and contexts."
      );
    }

    /*
     =========================
     METADATA
     =========================
    */

    if (
      issue ===
      "Material metadata missing"
    ) {
      recommendations.push(
        "Add structured material metadata for semantic understanding."
      );
    }

    if (
      issue ===
      "Semantic terrain metadata missing"
    ) {
      recommendations.push(
        "Include semantic usage metadata such as terrain, use-case, or environment."
      );
    }

    /*
     =========================
     OVERALL SCORE
     =========================
    */

    if (
      issue ===
      "Overall AI discoverability is poor"
    ) {
      recommendations.push(
        "Improve product completeness and metadata quality to increase AI visibility."
      );
    }
  }

  return recommendations;
};