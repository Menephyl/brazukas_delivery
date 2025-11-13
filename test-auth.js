#!/usr/bin/env node
/**
 * Quick test script for auth endpoints (runs in Node, bypassing curl issues).
 */

const BASE_URL = "http://localhost:3000/api/trpc";

async function testLogin() {
  try {
    console.log("Testing auth.login...");
    const res = await fetch(`${BASE_URL}/auth.login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          email: "admin@brazukas.app",
          password: "brazukas2025",
        },
      }),
    });

    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Headers:`, Object.fromEntries(res.headers));
    console.log(`Body:`, text.substring(0, 500));
    return text;
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

testLogin().then((body) => {
  try {
    const data = JSON.parse(body);
    if (data.result?.data?.json?.token) {
      console.log("\n✅ Login successful! Token:", data.result.data.json.token.substring(0, 50) + "...");
    } else {
      console.log("\n⚠️  Response:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log("Could not parse JSON response");
  }
});
