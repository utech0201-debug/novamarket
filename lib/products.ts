export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Men" | "Women" | "Accessories";
  description: string;
  image: string;
  featured?: boolean;
};

// Demo catalog. Once Supabase is connected, products are loaded from the DB
// and this acts as a seed/fallback.
export const products: Product[] = [
  {
    id: "1",
    name: "Classic Wool Overcoat",
    price: 189,
    category: "Men",
    description:
      "A timeless tailored overcoat in premium wool blend. Structured shoulders and a clean silhouette make it a winter staple.",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    name: "Linen Summer Dress",
    price: 89,
    category: "Women",
    description:
      "Breathable linen dress with a relaxed fit. Perfect for warm days, effortlessly elegant from morning to evening.",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    name: "Leather Crossbody Bag",
    price: 129,
    category: "Accessories",
    description:
      "Handcrafted full-grain leather crossbody bag with adjustable strap and gold hardware. Ages beautifully over time.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "4",
    name: "Slim Fit Denim Jeans",
    price: 79,
    category: "Men",
    description:
      "Mid-wash slim fit jeans with a touch of stretch for all-day comfort. A wardrobe essential.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    name: "Knit Turtleneck Sweater",
    price: 95,
    category: "Women",
    description:
      "Soft ribbed turtleneck in a cozy wool blend. Layer it or wear it on its own for understated warmth.",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    name: "Minimalist Watch",
    price: 149,
    category: "Accessories",
    description:
      "Clean dial, stainless steel case, and a genuine leather strap. Quiet sophistication for any outfit.",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "7",
    name: "Tailored Blazer",
    price: 159,
    category: "Men",
    description:
      "A versatile single-breasted blazer that dresses up or down. Half-canvas construction for a refined drape.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "8",
    name: "Silk Scarf",
    price: 49,
    category: "Accessories",
    description:
      "Hand-rolled silk scarf with a painterly print. A small detail that elevates the whole look.",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "9",
    name: "Pleated Midi Skirt",
    price: 85,
    category: "Women",
    description:
      "Flowing pleated midi skirt with a high waist. Moves beautifully and pairs with everything.",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "10",
    name: "Canvas Sneakers",
    price: 69,
    category: "Accessories",
    description:
      "Low-top canvas sneakers with a vulcanized rubber sole. Clean, casual, and endlessly wearable.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "11",
    name: "Cotton Oxford Shirt",
    price: 65,
    category: "Men",
    description:
      "Crisp oxford shirt in breathable cotton. A button-down that works from the office to the weekend.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "12",
    name: "Wide-Leg Trousers",
    price: 99,
    category: "Women",
    description:
      "High-rise wide-leg trousers with a fluid drape. Polished comfort for work and beyond.",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
  },
];

export const categories = ["All", "Men", "Women", "Accessories"] as const;

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
