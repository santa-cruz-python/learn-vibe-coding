---
title: Initialize the project
description: Set your project up with reasonable guidelines before you start coding — AGENTS.md, git, and credentials.
---

Before you start coding, there are many things you should research and plan.

Even before that, you should set up your project to start with reasonable guidelines.

## AGENTS.md file

Coding harnesses have / commands to init a project, which help set up an AGENTS.md or CLAUDE.md file (as mentioned above, prefer AGENTS.md for compatibility, so if Claude Code writes a CLAUDE.md file, just rename it AGENTS.md).

The init command will usually prompt you for the type of project you are working on, so it can set some guidelines. This is the time to define some generic preferences for your project(s), like how and when to document plans and discussions about the project (important to keep track of how it evolves and go back to historical decisions), how to work on features and when to check the code into a version control system like git (using git branches, git commits for each major feature for example, but not for each bugfix or small change).

As you may see here, an engineering background helps set guidelines for the project so it follows proper software engineering practices.

If you don't have an engineering background, before you even start on your project, you may want to start by asking what general software development good practices you should define in the AGENTS.md file, and learn a bit about how software is typically developed.

## Code version control: git

git is the de facto version control system. Version control helps keep track of changes in the code, and helps you go back in time to a working version if things go wrong. It is also useful when working with a team, to avoid code conflicts, allow review and agreement before merging code from different developers. When working with multiple agents, the same functionality is useful to have agents work in parallel on different features without stepping on each other. It also allows pushing the code to a remote repository like GitHub for safekeeping and sharing with other developers.

This is a critical feature to use in any project. Ask your agent to set up the git repository.

## Credentials

Credentials are typically in the form of environment variables, and are typically stored in a file called `.env`. If you have multiple environments, you may have multiple `.env` files. A critical security consideration is to make sure credentials are never shared, so ensure the file is ignored by git and prevented from being committed by adding it to the `.gitignore` file. Ask your agent to ensure this. This is typically enforced by agents, but also worth specifying in the AGENTS.md file.

Ideally, use a secret vault and only reference the vault secret name, while the code pulls the secret from the vault.
