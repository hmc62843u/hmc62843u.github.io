# Proof Flow

This folder documents a lightweight, human-in-the-loop Proof Flow MVP.

The MVP is compatible with the current W&Patent discovery framework:

- discovery and proof gaps can open proof tasks
- approved proof assets can link back to live topic pages
- routing and feedback can be reviewed alongside roadmap refreshes and early social-proof movement
- the private workspace can later become the founder-side instance in a mixed-mode system

The v1 workspace is founder-private by default.
Approved assets can then be routed outward into incubator or community channels.

## Commands

- `node scripts/create-proof-task.mjs ...`
- `node scripts/approve-proof-asset.mjs ...`
- `node scripts/build-proof-packet.mjs ...`
- `node scripts/record-proof-feedback.mjs ...`

## Workflow

1. Open a proof task from a real topic gap or proof gap.
2. Draft the proof asset from a template.
3. Review it manually before approval.
4. Build a routing packet for the right channels and communities.
5. Record the feedback after distribution, including traction and social-proof signals.

## Feedback loop

After an asset is routed, record the meaningful response:

- citation movement
- investor interest
- community mentions
- reposts or shares
- endorsements or positive replies
- reply quality
- intro acceptance
- follow-up meeting signals

Use:

- `node scripts/record-proof-feedback.mjs ...`
