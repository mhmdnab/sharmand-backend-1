const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");
const connectDB = require("./db");

const products = [
  {
    name: "Pure Gold Bar 50g",
    description:
      "Certified investment bar, 999.9 purity. The ideal choice for wealth preservation.",
    price: 3750.0,
    purity: "24K",
    weight: 50,
    category: "Barra",
    image:
      "https://images.unsplash.com/photo-1610375461246-83c580083cba?auto=format&fit=crop&q=80&w=1000",
    stock: 5,
  },
  {
    name: "Swiss Gold Bar 100g",
    description:
      "Refined in Switzerland with international certification. High quality 24k gold.",
    price: 7500.0,
    purity: "24K",
    weight: 100,
    category: "Barra",
    image:
      "https://images.unsplash.com/photo-1599694589868-b3d36009cc09?auto=format&fit=crop&q=80&w=1000",
    stock: 2,
  },
  {
    name: "Krugerrand Coin 1oz",
    description:
      "The most famous gold coin in the world. A timeless classic for collectors and investors.",
    price: 2400.0,
    purity: "22K",
    weight: 31.1,
    category: "Moeda",
    image:
      "https://images.unsplash.com/photo-1623945205562-b2d9d1502157?auto=format&fit=crop&q=80&w=1000",
    stock: 10,
  },
  {
    name: "Portuguese Link Chain 18k",
    description:
      "Elegance and sophistication in a classic 18k gold chain. Impeccable finish.",
    price: 900.0,
    purity: "18K",
    weight: 12,
    category: "Jóia",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000",
    stock: 15,
  },
  {
    name: "Certified Gold Bar 10g",
    description:
      "Perfect for starting your physical gold investments. Small, liquid, and safe.",
    price: 800.0,
    purity: "24K",
    weight: 10,
    category: "Barra",
    image:
      "https://images.unsplash.com/photo-1610375461369-d612b1a13e3b?auto=format&fit=crop&q=80&w=1000",
    stock: 25,
  },
  {
    name: "American Eagle Coin",
    description:
      "Symbol of freedom and value. Official United States coin in 22k gold.",
    price: 2350.0,
    purity: "22K",
    weight: 33.9,
    category: "Moeda",
    image:
      "https://images.unsplash.com/photo-1589820296156-2454bb8a441e?auto=format&fit=crop&q=80&w=1000",
    stock: 8,
  },
  {
    name: "Royal Bracelet 18k",
    description:
      "Exclusive Brazilian design. Solid gold with reinforced safety clasp.",
    price: 1450.0,
    purity: "18K",
    weight: 18,
    category: "Jóia",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000",
    stock: 4,
  },
  {
    name: "Industrial Ingot 1kg",
    description:
      "For large institutional investors. The ultimate in value concentration.",
    price: 74500.0,
    purity: "24K",
    weight: 1000,
    category: "Barra",
    image:
      "https://images.unsplash.com/photo-1582234036688-66236b283282?auto=format&fit=crop&q=80&w=1000",
    stock: 1,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(
      `✓ Successfully seeded ${result.length} products into the database`,
    );

    result.forEach((product) => {
      console.log(`  - ${product.name} ($${product.price})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
