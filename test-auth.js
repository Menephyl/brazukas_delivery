#!/usr/bin/env node
/**
 * Quick test script for auth endpoints (runs in Node, bypassing curl issues).
 */

const BASE_URL = "http://localhost:3000/api/trpc";

const TEST_USER_EMAIL = "test@brazukas.app";
const TEST_USER_PASSWORD = "securepassword";
const TEST_USER_NAME = "Test User";

async function testSignup() {
  try {
    console.log(`\nTesting auth.signup for ${TEST_USER_EMAIL}...`);
    const res = await fetch(`${BASE_URL}/auth.signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          name: TEST_USER_NAME,
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        },
      }),
    });

    const text = await res.text();
    console.log(`Signup Status: ${res.status}`);
    console.log(`Signup Body:`, text.substring(0, 500));
    return JSON.parse(text);
  } catch (err) {
    console.error("Error during signup:", err.message);
    process.exit(1);
  }
}

async function testLogin() {
  try {
    console.log(`\nTesting auth.login for ${TEST_USER_EMAIL}...`);
    const res = await fetch(`${BASE_URL}/auth.login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        },
      }),
    });

    const text = await res.text();
    console.log(`Login Status: ${res.status}`);
    console.log(`Login Headers:`, Object.fromEntries(res.headers));
    console.log(`Login Body:`, text.substring(0, 500));
    return JSON.parse(text);
  } catch (err) {
    console.error("Error during login:", err.message);
    process.exit(1);
  }
}

async function runTests() {
  try {
    // First, try to sign up the user
    const signupResult = await testSignup();
    if (signupResult.result?.data?.json?.success) {
      console.log("\n✅ Signup successful!");
    } else if (signupResult.error?.message.includes("Email já cadastrado.")) {
      console.log("\n⚠️ User already exists, proceeding with login.");
    } else {
      console.error("\n❌ Signup failed unexpectedly:", signupResult);
      process.exit(1);
    }

    const data = await testLogin();
    if (data.result?.data?.json?.token) { // Check for the token in the login response
      console.log("\n✅ Login successful! Token:", data.result.data.json.token.substring(0, 50) + "..."); // Log the token
    } else {
      console.log("\n❌ Login failed. Response:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log("Could not parse JSON response or unexpected error:", e);
  }

}

runTests();
