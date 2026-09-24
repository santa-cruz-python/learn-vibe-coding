---
title: Getting setup
description: Picking a harness, a model, and how to pay for it.
---

There are plenty of environments to choose from

- Codex, Claude Code are the popular proprietary harnesses, complete with Command Line Interface (CLI), desktop apps, and Integrated Development Environment (IDE) plugins for IDE like VS Code or JetBrains.

- Some others are complete IDEs of their own (like [Cursor](https://cursor.com) or Antigravity), usually forks of the popular VS Code IDE.

- There are also lots of Open Source options that you can find on Github, like [cline](https://github.com/cline/cline), [Kilo Code](https://github.com/Kilo-Org/kilocode) and [opencode](https://github.com/anomalyco/opencode).

- Use the CLI, an IDE plugin, or the desktop app, which-ever you are more familiar with. They all tend to offer similar functionalities.

## What model to use?

The response to this question is ever changing: as models get better and better, and the competition is fierce, the 'best' model depends on the time you ask. You can follow the leaderboard of model performance on sites like LMArena (now Arena): [https://arena.ai/leaderboard](https://arena.ai/leaderboard)

Then, there is the cost: proprietary models tend to be the most expensive, API per token price being set for input tokens and output tokens, while the alternative open-source, cloud based models are often dramatically cheaper. DeepSeek-V4-Flash, for instance, runs about $0.14 per million input tokens and $0.28 per million output, against Claude Sonnet 5 at $2 and $10: between 10 and 35 times less, depending on how your usage splits between input and output.

Don't take that as a rule, though. Pricing varies by model and by the provider hosting it, and open weights do not automatically mean cheap: Kimi K3 is $3 and $15 per million, which is more expensive than Sonnet 5. On quality, the open models may not be at the very top, but they are often close (depending on the moment).

## Local models

Everything above assumes you are renting a model from somebody. You don't have to. Open weights means you can download the model and run it on your own hardware, and there are real reasons to want that: your code never leaves the machine, there is no per-token bill, and nothing changes under you when a provider updates its pricing or its terms. If you work on code you are contractually not allowed to send to a third party, this isn't a preference, it's the only option.

It is also more expensive and more limited than it sounds. The numbers are worth walking through, because they are not the numbers people usually quote.

### What fits on one machine

Around 24GB of VRAM is a fair floor for a local model that is genuinely useful for coding. Don't spend all of it on the model, though: target roughly 14 to 20GB for the weights and leave the rest for the KV cache. That reservation matters more for agentic coding than it does for chat. A chat turn is short. An agent accumulates a long history of tool calls, file contents and command output, and all of it lives in that cache. Size for the weights alone and you will run out of room in the middle of a task, which is exactly when you don't want to.

At that budget you are running something like Gemma 4 — 26B as a mixture-of-experts, or 31B dense — or Qwen3.8-27B. These are good models. They are not the model you are used to.

To fit them you quantize: store the weights at lower precision so the file is smaller. "Slightly degraded" is an honest description at Q4 and above. Q8 and Q6 are essentially indistinguishable from full precision. Q5_K_M costs about 0.08 perplexity points, Q4_K_M about 0.2 to 0.25, and roughly 2 to 3% pass@1 on coding benchmarks. Two caveats on that. The degradation is not spread evenly: structured multi-step reasoning and code generation take the hit harder than casual conversation does, so the loss lands precisely on the work you bought the machine for. And below Q4, "slightly" stops being true. That is a cliff, not a slope.

:::tip[Pro Tip]
Before you buy hardware, run the model you are considering on the hardware you already have, against a real task in a real project — not a chat prompt. Have it read a few files, run the tests and fix something. A local model that answers questions well can still fall apart on the tool-calling loop, and the tool-calling loop is the part you will actually be using. An afternoon of that is a lot cheaper than a $5,000 machine you end up not using.
:::

### What the hardware costs

A Mac Studio M5 Max with 128GB of unified memory starts around $4,499. That's the sticker, not the build: weight files run to tens or hundreds of gigabytes each and you will want more than one, so 2TB of storage is realistic rather than indulgent. That build lands near $5,899, and up to about $6,899 with the 40-core GPU.

NVIDIA's DGX Spark is about $4,699, also with 128GB of unified memory. One thing to be clear about, because the name invites the confusion: the DGX Spark is a desktop machine. It is not a DGX in the sense the data center uses that word. An actual DGX server is a $300,000 to $500,000 piece of equipment. The Spark borrows the brand, not the class.

### Running a top-tier open model

Say you don't want the model that fits on your desk, you want the best open-weight model there is. Right now that is Kimi K3: 2.8 trillion total parameters, 104 billion active. The weights are about 594GB in native format, and 1.51TB at a quantization that preserves quality.

Here is the trap, and it is the most misread number in this whole conversation. All 2.8 trillion parameters have to be resident in memory, even though only 104 billion of them are active on any given token. Mixture-of-experts routing picks a different subset each time; it doesn't let you leave the rest on disk. Marketing quotes the active count, which makes these models sound far more approachable than they are.

So, on 128GB machines: five of them minimum to hold it at all, and twelve for a quantization you would actually want to use. Call it $23,500 to $71,000.

That figure moves fast. The number people were repeating a year ago was four machines, and it was correct — for Kimi K2. K3 nearly tripled in size and the advice went stale without anyone announcing it.

What do you get for the money? Kimi K3 is the strongest open-weight model available, and it genuinely ranks first on Arena's Frontend Code Arena, ahead of Claude Fable 5. That is a real result. Overall, though, it sits somewhere around ninth to seventeenth while the frontier models hold the top three. It wins some specific coding boards and is well behind on the whole.

### Power

A DGX Spark pulls about 240W under load and around 38W idle. A Mac Studio M5 Max tops out at 200W, an M5 Ultra at 385W.

Four Sparks at full throttle is roughly 960W, and a rig that actually holds Kimi K3 is bigger than that. Run 960W continuously for thirty days and it's about 691kWh. Treat that as a theoretical ceiling rather than a forecast: nobody runs a home rig flat out around the clock. A realistic duty cycle — a few active hours a day, idle the rest — is closer to 180kWh a month.

Then it depends where you live. California runs 33 to 45 cents per kWh (PG&E 33.7, SCE 34.4, SDG&E 45.5) against a US average of about 18. If you are reading this in Santa Cruz, your power costs roughly double what the rest of the country pays: that 180kWh is about $61 a month here, against $32 somewhere in the middle of the map. Not ruinous, but it's a subscription you pay whether or not you used the machine that month.

### Where this leaves you

The strongest argument against a home cluster isn't the price. It's that capacity is not speed.

Holding a model in memory and running it at a usable rate are different problems. Mixture-of-experts routing sends activations between nodes on every single token, and the interconnect between consumer machines is far slower than the GPU-to-GPU fabric inside a real server. A cluster big enough to hold Kimi K3 will very likely still be too slow for a comfortable interactive coding loop — and an agentic loop makes many model calls per task, so slow compounds. You can spend $71,000 and end up with something you don't enjoy using. That blocks the idea more decisively than the cost does.

It's also worth being precise about where the remaining capability gap actually is, because it isn't where people assume. It is not context length; plenty of open models ship 1M-token windows now. It is tool-calling reliability and success on long, multi-step tasks — and quantization degrades exactly that, so the two halves of this section compound rather than cancel.

Honestly, then: local models are good enough today for everyday work. Edits, fixes, explaining a file, answering questions about a codebase — the things where privacy and cost matter most, and where a 27B model at Q5 is entirely adequate. The gap that remains is on the hardest and longest agentic tasks, and it is a real gap, not a rounding error.

One last thing. Every number above is a snapshot from September 2026, and this area moves faster than anything else in this guide. Apple and NVIDIA both raised prices in 2026 on the cost of memory, and the model lineup went Gemma 3 to 4, Qwen3 to 3.8 and Kimi K2 to K3 in about a year. Check the prices and the model names yourself before you act on any of it.

:::note[Resource Links]
- Ollama, the simplest way to run a model locally: https://ollama.com
- LM Studio, a desktop app with a model browser: https://lmstudio.ai
- llama.cpp, the engine most of them are built on: https://github.com/ggml-org/llama.cpp
- Open weights to download, with quantized builds: https://huggingface.co/models
- Mac Studio: https://www.apple.com/mac-studio/
- NVIDIA DGX Spark: https://www.nvidia.com/en-us/products/workstations/dgx-spark/
:::

## API per token use vs. subscriptions

Models are priced on per input and per output tokens (per Million tokens actually) for API usage, so they can be compared that way, but using API is usually much more costly than using a subscription.

Proprietary model providers as well as open-source cloud model providers offer subscriptions that include a variable and undisclosed amount of token usage per 'session' and per week. Sessions usually tend to be for a 5h block of time, and then there is a cap per week. Some subscriptions start with a very limited free tier, but the realistic entry point is around $20 a month: that is what both Claude Pro and ChatGPT Plus cost, and it may sometimes be equivalent to $100's in API token usage. The heavier tiers run $100 to $200 a month.

Compare and contrast for yourself, but a subscription is usually the way to go.

## What harness with what subscription?

Can I use OpenAI models with Claude Code? In theory, yes. In practice, it's best to stick with the harness built by the model provider, for many reasons:
- proprietary models subscriptions have terms and conditions for their usage. An Anthropic subscription, for example, is meant for Claude Code, the Agent SDK, and Anthropic's own applications (claude.ai, Claude Desktop) — not for third-party clients. Their Legal & Compliance page states that OAuth login is "intended exclusively for purchasers of Claude Free, Pro, Max, Team, and Enterprise subscription plans and is designed to support ordinary use of Claude Code and other native Anthropic applications", and it bars third parties from routing requests through those credentials.

  The risk here is not Codex or Cursor, which don't offer an Anthropic login in the first place. It is the various tools and wrappers that extract your Claude OAuth token and replay it to impersonate Claude Code. That is exactly what the terms prohibit, Anthropic reserves the right to enforce without prior notice, and it did enforce in February 2026. Using one of those is a real way to get your account blocked or banned.
However it's possible to use API access with any harness; the cost may not be worth it.

Most open source model providers don't have restrictions on what harness you use, so it's possible to use models like DeepSeek, Qwen, or Kimi using Claude Code harness or Codex. This is set in the configuration.

:::note[Resource Links]
- Claude Code model configuration: https://code.claude.com/docs/en/model-config
- Codex configuration: https://github.com/openai/codex/blob/main/docs/config.md
:::

## Useful plugins and skills

There is a vast quantity of open source plugins and skills out there, and some are worth mentioning:

- The official Claude Code plugins live at https://github.com/anthropics/claude-plugins-official, and include:
  - superpowers: a set of process skills (brainstorming before building, systematic debugging, test-driven development, writing plans) that push the agent through an engineering workflow instead of letting it dive straight into code. If you install only one thing from this list, install this one.
  - remember: persists session history and the decisions made along the way, so your context survives between sessions instead of starting from nothing every morning.
  - code-review: structured review of the changes that were just made.

:::caution[Explore Further]{icon="open-book"}
https://github.com/multica-ai/andrej-karpathy-skills is widely used, and worth reading even if you never install it. Despite the name it is not a skills marketplace: it is a single CLAUDE.md file (plus a Cursor-rules variant and a plugin wrapper) encoding four behavioral rules drawn from Andrej Karpathy's observations of where LLMs go wrong when they write code. Think before coding: state your assumptions and ask rather than guess. Simplicity first: no speculative features. Surgical changes: edit what was asked and nothing else, no drive-by refactors. Goal-driven execution: turn a vague request into verifiable success criteria. Those four ideas are most of what separates a good prompt from a bad one, whatever harness you use.
:::
