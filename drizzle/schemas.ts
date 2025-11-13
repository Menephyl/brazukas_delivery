import { mysqlTable, varchar, serial, timestamp, text, mysqlEnum, int, boolean, json, float } from 'drizzle-orm/mysql-core';

// Tabela de Usuários (já definida na Parte 1, mas incluída aqui para completude)
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  openId: varchar('openId', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: text('passwordHash'),
  role: mysqlEnum('role', ['admin', 'merchant', 'driver', 'client']).default('client'),
  loginMethod: varchar('loginMethod', { length: 50 }),
  lastSignedIn: timestamp('lastSignedIn'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// Tabela de Lojistas (Merchants)
export const merchants = mysqlTable('merchants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  lat: float('lat'),
  lng: float('lng'),
  category: varchar('category', { length: 100 }),
  deliveryFee: int('delivery_fee'),
  logoUrl: varchar('logo_url', { length: 2048 }),
  bannerUrl: varchar('banner_url', { length: 2048 }),
  active: boolean('active').default(true),
  ownerId: int('owner_id').references(() => users.id),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// Tabela de Produtos
export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  merchantId: int('merchant_id').notNull().references(() => merchants.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: int('price').notNull(), // Em centavos
  photoUrl: varchar('photo_url', { length: 2048 }),
  active: boolean('active').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// Tabela de Pedidos (Orders)
export const orders = mysqlTable('orders', {
  id: serial('id').primaryKey(),
  merchantId: int('merchant_id').notNull().references(() => merchants.id),
  clientId: int('client_id').notNull().references(() => users.id),
  driverId: int('driver_id').references(() => users.id),
  status: mysqlEnum('status', [
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'PICKED_UP',
    'DELIVERED',
    'CANCELLED',
  ]).notNull(),
  items: json('items').notNull(),
  subtotal: int('subtotal'),
  deliveryFee: int('delivery_fee'),
  discount: int('discount'),
  total: int('total'),
  etaMin: int('eta_min'),
  timeline: json('timeline'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});