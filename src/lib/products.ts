import data from '../content/en/products.json';
import site from '../content/en/site.json';

export type Product = (typeof data.items)[number];

// All products, sorted by order (stable single ordering everywhere).
export const allProducts: Product[] = [...data.items].sort((a, b) => a.order - b.order);

// Home Featured grid = featured:true, in order.
export const featuredProducts: Product[] = allProducts.filter((p) => p.featured);

export const collections = data.collections as Record<string, { label: string; ingredients: string; theme: any; about?: string; ingredientKeys?: string[] }>;

export const ingredients = data.ingredients as Record<string, { label: string; note: string; image: string }>;

// Ingredient cards for a collection (shared dictionary, resolved per collection).
export const collectionIngredients = (collectionKey: string) => {
  const keys = collections[collectionKey]?.ingredientKeys ?? [];
  return keys.map((k) => ingredients[k]).filter(Boolean);
};

export const getProduct = (slug: string): Product | undefined =>
  data.items.find((p) => p.slug === slug);

// Related products: same collection first, then fill from other collections by order. Cap 8.
export const relatedProducts = (p: Product, limit = 8): Product[] => {
  const sameCol = allProducts.filter((x) => x.collection === p.collection && x.slug !== p.slug);
  const others = allProducts.filter((x) => x.collection !== p.collection && x.slug !== p.slug);
  return [...sameCol, ...others].slice(0, limit);
};

// Canonical internal link — never hardcode a product URL anywhere else.
export const productHref = (p: Product): string => `/products/${p.slug}`;

// Per-product WhatsApp link (auto-selected message).
const waNumber: string = (site as any).whatsapp?.number ?? '821065437947';
export const productWhatsApp = (p: Product): string =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(p.whatsappText)}`;

// Catalog: show a download only when a real PDF path is set (no "coming soon").
export const catalogHref: string = (site as any).catalog ?? '';
export const hasCatalog: boolean = Boolean(catalogHref);
