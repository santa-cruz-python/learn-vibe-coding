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

It is also more expensive and more limited than it sounds.

Around 24GB of VRAM is a fair floor for a model genuinely useful for coding, and you shouldn't spend all of it on weights: target 14 to 20GB and leave the rest for the KV cache. That matters more for agentic coding than for chat, because an agent accumulates a long history of tool calls, file contents and command output, and all of it lives in that cache. Size for the weights alone and you run out of room mid-task. At that budget you are running something like Gemma 4 (26B as a mixture-of-experts, or 31B dense) or Qwen3.8-27B. Good models. Not the model you are used to.

To fit them you quantize: store the weights at lower precision so the file is smaller. "Slightly degraded" is an honest description at Q4 and above, where Q4_K_M costs roughly 2 to 3% pass@1 on coding benchmarks. Two caveats. The loss is not spread evenly: multi-step reasoning and code generation take the hit harder than conversation does, so it lands precisely on the work you bought the machine for. And below Q4, "slightly" stops being true. That is a cliff, not a slope.

:::tip[Pro Tip]
Before you buy hardware, run the model you are considering on the hardware you already have, against a real task in a real project rather than a chat prompt. Have it read a few files, run the tests and fix something. A local model that answers questions well can still fall apart on the tool-calling loop, and that loop is the part you will actually be using. An afternoon of this is cheaper than a $5,000 machine you end up not using.
:::

A Mac Studio M5 Max with 128GB of unified memory runs from about $4,499 to $6,900 depending on storage and GPU, and the storage is not optional: weight files run to tens or hundreds of gigabytes each. NVIDIA's DGX Spark is about $4,699, also with 128GB. The name invites confusion: the Spark is a desktop machine, not a DGX in the sense the data center uses the word. An actual DGX server is a $300,000 to $500,000 piece of equipment. The Spark borrows the brand, not the class.

Say you want the best open-weight model rather than the one that fits on your desk. That is currently Kimi K3: 2.8 trillion total parameters, 104 billion active, about 594GB of weights in native format and 1.51TB at a quantization you would actually want to use.

Here is the most misread number in this whole conversation. All 2.8 trillion parameters have to be resident in memory, even though only 104 billion are active on any given token. Routing picks a different subset each time; it does not let you leave the rest on disk. Marketing quotes the active count, which makes these models sound far more approachable than they are.

So on 128GB machines: five to hold it at all, twelve for a quantization worth using. Call it $23,500 to $71,000. That figure moves fast, too. The number people repeated a year ago was four machines, correct for Kimi K2. K3 nearly tripled in size and the advice went stale without anyone announcing it.

What do you get for it? Kimi K3 is the strongest open-weight model available, and it ranks first on Arena's Frontend Code Arena, ahead of Claude Fable 5. Overall, though, it sits around ninth to seventeenth while the frontier models hold the top three: ahead on some specific boards, well behind on the whole.

Power is the cost people forget to count. A DGX Spark pulls about 240W under load, a Mac Studio M5 Max about 200W. A few active hours a day across a small rig lands near 180kWh a month: about $61 in California at 33 to 45 cents per kWh, roughly half that at the US average of 18. Not ruinous, but it is a subscription you pay whether or not you used the machine that month.

The strongest argument against a home cluster isn't the price, though. It is that capacity is not speed. Holding a model in memory and running it at a usable rate are different problems: mixture-of-experts routing sends activations between nodes on every single token, and the interconnect between consumer machines is far slower than the GPU-to-GPU fabric inside a real server. A cluster big enough to hold Kimi K3 will very likely still be too slow for a comfortable interactive coding loop, and an agentic loop makes many model calls per task, so slow compounds. You can spend $71,000 and end up with something you don't enjoy using.

The remaining gap isn't where people assume, either. Not context length; plenty of open models ship 1M-token windows now. It is tool-calling reliability and success on long, multi-step tasks, and quantization degrades exactly that, so the two halves of this section compound rather than cancel. Which leaves an honest summary: local models are good enough for everyday work, the edits and fixes and questions about a codebase where privacy matters most and a 27B model at Q5 is plenty. The gap is on the hardest, longest agentic tasks, and it is real.

Every number above is a September 2026 snapshot, and this area moves faster than anything else in this guide. Check the prices and model names yourself before acting on any of it.

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
