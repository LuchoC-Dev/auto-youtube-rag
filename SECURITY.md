# Security Policy

## Posture

`auto-youtube-rag` runs entirely on your machine.

- **No network calls**, with a single deliberate exception: `auto-youtube-rag
init` and `auto-youtube-rag models install` download the embedding model
  from Hugging Face. Every other command — `sync`, `retrieve`, `status`,
  `doctor`, `source`, `rebuild` — is fully offline.
- **No credentials.** The tool does not ask for, store, or transmit API keys,
  tokens, or any other secret.
- **No telemetry.** Nothing is collected, logged remotely, or sent anywhere.
- **Source packages are read-only.** The tool only ever reads the knowledge
  packages you point it at; it never writes to them.

## Reporting a vulnerability

There is no dedicated security contact yet. If you find a security issue,
please [open an issue](https://github.com/LuchoC-Dev/auto-youtube-rag/issues)
describing it. For anything you'd rather not post publicly before a fix is
available, mention that in the issue title and we'll figure out a private
channel from there.
