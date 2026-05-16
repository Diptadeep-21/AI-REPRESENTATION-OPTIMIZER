import { IProduct } from "../models/Product";

import { ProductScores } from "./scoringEngine";

export const detectProductIssues = (
  product: IProduct,
  scores: ProductScores
): string[] => {
  const issues: string[] = [];

  /*
   =========================
   METADATA ISSUES
   =========================
  */

  if (
    !product.description ||
    product.description.length < 80
  ) {
    issues.push(
      "Product description is too short"
    );
  }

  if (
    !product.tags ||
    product.tags.length < 3
  ) {
    issues.push(
      "Insufficient semantic tags"
    );
  }

  if (
    !product.productType
  ) {
    issues.push(
      "Missing product type/category"
    );
  }

  /*
   =========================
   DISCOVERABILITY ISSUES
   =========================
  */

  if (
    product.title.length < 20
  ) {
    issues.push(
      "Product title lacks specificity"
    );
  }

  if (
    !product.category
  ) {
    issues.push(
      "Missing category classification"
    );
  }

  /*
   =========================
   TRUST ISSUES
   =========================
  */

  if (
    !product.vendor
  ) {
    issues.push(
      "Vendor information missing"
    );
  }

  if (
    product.price <= 0
  ) {
    issues.push(
      "Invalid product pricing"
    );
  }

  /*
   =========================
   MEDIA ISSUES
   =========================
  */

  if (
    !product.images ||
    product.images.length === 0
  ) {
    issues.push(
      "No product images available"
    );
  }

  if (
    product.images.length < 2
  ) {
    issues.push(
      "Too few product images"
    );
  }

  /*
   =========================
   SEMANTIC ISSUES
   =========================
  */

  if (
    !product.metadata
      ?.material
  ) {
    issues.push(
      "Material metadata missing"
    );
  }

  if (
    !product.metadata
      ?.terrain ||
    product.metadata
      .terrain.length === 0
  ) {
    issues.push(
      "Semantic terrain metadata missing"
    );
  }

  /*
   =========================
   SCORE LEVEL ISSUES
   =========================
  */

  if (
    scores.overallScore < 60
  ) {
    issues.push(
      "Overall AI discoverability is poor"
    );
  }

  return issues;
};