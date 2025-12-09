-- Enable Row Level Security (RLS) for the 'restaurants' table
-- This is required because Supabase denies access to tables with RLS enabled but no policies for the querying role (anon).

-- 1. Enable RLS on the table (if not already enabled)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow public read access
-- 'anon' role is used by unauthenticated clients
-- 'authenticated' role is used by logged-in users
-- We want everyone to see the list of restaurants.
CREATE POLICY "Public restaurants are viewable by everyone"
ON restaurants
FOR SELECT
TO public
USING (true);

-- 3. Enable RLS for 'products' table as well
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone"
ON products
FOR SELECT
TO public
USING (true);

-- 4. Enable RLS for 'orders' table (Authenticated users can create)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own orders"
ON orders
FOR INSERT
TO public
WITH CHECK (true);
-- Note: Ideally restrictive, but for MVP anon users might create orders? 
-- If authentication is required, change TO public to TO authenticated.
-- For now, letting 'public' insert ensures unauthenticated checkout flows work if supported.

CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
TO public
USING (true); 
-- WARNING: This policy 'USING (true)' allows seeing ALL orders.
-- In a real app, you would use: USING (auth.uid() = user_id) or similar.
-- For this MVP debug phase, we are permissive.

-- 5. Enable RLS for 'order_items'
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert order items"
ON order_items
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can view order items"
ON order_items
FOR SELECT
TO public
USING (true);
