import { pgTable, text, integer, boolean, timestamp, real, serial } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  discount: integer("discount").default(0),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  features: text("features").notNull().default("[]"),
  badge: text("badge"),
  inStock: boolean("in_stock").default(true),
  rating: real("rating").default(5),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: text("items").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: text("id").primaryKey(),
  event: text("event").notNull(),
  data: text("data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  password: text("password"),
  walletBalance: real("wallet_balance").default(0),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), // deposit, withdraw, purchase
  description: text("description"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
});
