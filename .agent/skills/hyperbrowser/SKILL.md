---
name: Hyperbrowser Automation
description: Use Hyperbrowser to run AI agents and cloud browser sessions for scraping, testing, and automation.
---

# Hyperbrowser Automation Skill

This skill allows you to leverage Hyperbrowser's cloud browsers and AI agents to perform web tasks.

## Prerequisites

1.  **API Key**: You need a Hyperbrowser API key.
    - Set it in your `.env` file: `HYPERBROWSER_API_KEY=Hb_...`
2.  **SDK**: Install the SDK.
    ```bash
    npm install @hyperbrowser/sdk dotenv
    ```

## Usage

### 1. AI Agent (Browser Use)

Use this when you want an AI to "figure out" how to achieve a goal on a website.

```typescript
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { config } from "dotenv";

config();

async function runAgent() {
  const client = new Hyperbrowser({
    apiKey: process.env.HYPERBROWSER_API_KEY,
  });

  console.log("Starting agent...");

  // startAndWait blocks until the task is done
  const result = await client.agents.browserUse.startAndWait({
    task: "Go to news.ycombinator.com and find the top post title",
    llm: "gemini-2.5-flash", // or "claude-3-5-sonnet-20240620"
    maxSteps: 20,
    // useVision: true, // Enable if visual elements are important
  });

  console.log("Final Result:", result.data?.finalResult);

  if (result.status !== "completed") {
    console.error("Agent failed:", result.error);
  }
}

runAgent().catch(console.error);
```

### 2. Playwright Session (Standard Automation)

Use this when you have a specific script or need exact control via Playwright.

**Install additional deps:**

```bash
npm install playwright-core
```

```typescript
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { chromium } from "playwright-core";
import { config } from "dotenv";

config();

async function runSession() {
  const client = new Hyperbrowser({
    apiKey: process.env.HYPERBROWSER_API_KEY,
  });

  // 1. Create a cloud session
  const session = await client.sessions.create({
    acceptCookies: true,
    // proxy: { ... } // Optional proxy config
  });

  try {
    // 2. Connect Playwright to the remote session
    const browser = await chromium.connectOverCDP(session.wsEndpoint);
    const context = browser.contexts()[0];
    const page = context.pages()[0];

    // 3. Automate as usual
    await page.goto("https://example.com");
    const title = await page.title();
    console.log("Page title:", title);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // 4. Always clean up
    await client.sessions.stop(session.id);
  }
}

runSession().catch(console.error);
```

## Best Practices

- **Session Management**: Always ensure `client.sessions.stop(session.id)` is called in a `finally` block to avoid dangling sessions (and costs).
- **Security**: Never hardcode your API key. Use `process.env`.
- **Long-running Tasks**: For tasks taking >2 minutes, use the `start()` (async) method instead of `startAndWait()` and poll for status.
