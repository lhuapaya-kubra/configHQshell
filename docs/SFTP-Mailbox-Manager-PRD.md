# SFTP Mailbox Manager (Nazar Amulet) — PRD

https://kubra.jira.com/wiki/spaces/P1/pages/1916043435/SFTP+Mailbox+Manager+-+PRD

| Field | Value |
|--------|--------|
| **Status** | Draft |
| **Owner** | @Luciano Huapaya |

---

## Overview

The **SFTP Mailbox Manager** is a new platform capability intended to standardize how KUBRA manages SFTP-based file exchanges with clients and internal systems.

This initiative aims to:

- Centralize SFTP mailbox management from ConfigHQ in a client context.
- Provide a consistent API-driven interface.

---

## Problem

Today, SFTP mailbox management across KUBRA is fragmented and inconsistent. Different teams (e.g., DSO and FTS) independently create and manage SFTP mailboxes using their own processes and tooling.

This results in:

- **Operational inefficiency** — Current process: SFTP mailbox management requires coordination across multiple teams. For example, DSO manages the KUBRA-hosted SFTP environment, but when new user credentials are required, requests must be routed through additional teams to provision access. This creates delays, manual overhead, and unclear ownership.
- **Limited visibility** — There is no centralized view of mailbox inventory, access controls, usage, or storage, making auditing and capacity planning difficult.
- **Scalability challenges** — As SFTP usage grows across integrations for KUBRA-hosted SFTP, the current approach does not scale efficiently.

**Current process (as of PRD):** Vitalii and Bart W. add public keys via git for a Terraform script (`clients.prod.tfvars`).

---

## Use Cases

### In scope

**Mailbox management UI**

- Admin creates an SFTP mailbox via ConfigHQ UI.
- Admin updates mailbox configuration (e.g., name, access settings, users).
- Admin deletes or decommissions an SFTP mailbox (*future phase*).
- Admin creates folders per realm, Live vs. Sandbox environments (realm-based separation).

**API for mailbox management**

- Systems can create and manage SFTP mailboxes via API.
- Systems can retrieve mailbox configuration and metadata programmatically.

**User access control**

*User creation:*

- Username
- Public SSH key
- Access: READ, WRITE, DELETE permissions to files in the folder
- All users created will have access to all folder contents

*Folder creation:*

- Example: `["remittance", "batch_payment_posting"]`

**Primary focus:** KUBRA-hosted SFTP mailboxes managed through the platform.

**Audit trail**

- KHQ regular audit (*MVP TBD*).
- System retains source and transformed files independently for audit purposes.
- Audit of files: any source files and transformed files will be retained **outside of the mailbox**.

### Out of scope

- Customizable data retention policy
- Credentials/configuration for clients that host their own SFTP (*potential future idea*)
- **Password** — out of scope for now
- **Future:** Integration with Datafeed and File Transformation Services (FTS) for file ingestion and processing (*not MVP*)
- **Granular user access control** — which user has access to which folder (e.g., some users all folders, others remit only) — *not in scope for this PRD as described*
- **Multiple mailbox instances (per space):** support for more than one SFTP mailbox instance per client to enable separate credentials and inboxes for individual spaces within the same realm (e.g., DukeEast and DukeWest) — *noted as future / not MVP*

---

## Solution

Build a centralized **SFTP Mailbox Manager** within ConfigHQ that provides a standardized way to provision, manage, and monitor SFTP mailboxes across KUBRA.

The solution will include:

- A ConfigHQ UI for mailbox creation and configuration.
- A backend service responsible for provisioning and maintaining SFTP mailboxes.
- A consistent API layer to support programmatic access and integrations.
- Standardized configurations for mailbox structure, access control, and limits.

This approach ensures all SFTP mailboxes are created and managed through a single system, reducing duplication, improving visibility, and enabling future scalability.

---

## Billing

- **Standard offering, no billing (as stated):**
  - 1 KUBRA-hosted SFTP instance
  - 7-day data retention policy
- **Future billing** — not in scope for this PRD

---

## Reporting

Based on the billing instance above:

- Quantity of KUBRA-hosted SFTP mailbox instances created, on a **per-client** basis
- Number of users granted access to the SFTP mailbox
- **Folder size**, on a per-client basis, to support cost understanding for the SFTP mailbox instance

---

## Front end

**ConfigHQ — SFTP Mailbox Manager UI**

### Core UI (MVP)

1. **Mailbox list view** — Centralized table of all mailboxes with key metadata (name, environment, users, status, storage if available) and basic search/filtering.
2. **Mailbox creation** — Guided form: name, environment (Live/Sandbox), folder structure, initial users (username, SSH key, permissions), with validation and confirmation.
3. **Mailbox detail view** — Dedicated page: overview (metadata), users (add/edit/remove), folders (view/create if in scope).
4. **User access management** — SSH key–based users: add/edit/remove with mailbox-level permissions (READ/WRITE/DELETE).

---

## Security

| Area | Notes |
|------|--------|
| **Risk level** | High |
| **RBAC** | Role-based access control for mailbox management within ConfigHQ |
| **Authentication** | Secure SFTP auth (SSH keys; username/password mentioned in same section—align with *password out of scope* for PRD) |
| **Encryption** | Data in transit and at rest |
| **Audit** | Audit logging for mailbox access and configuration changes |
| **Access enforcement** | User-level access restrictions per mailbox and folder (align with in/out-of-scope for MVP) |

*PRD note: Reconcile “password” and “folder-level user restrictions” with explicit out-of-scope bullets above.*

---

## Milestones

### Phase 1 (MVP)

- Create and manage SFTP mailboxes via ConfigHQ UI
- Backend service for mailbox provisioning
- Basic API for mailbox management
- Standardized mailbox configuration

### Phase 2

- Reporting (usage, storage, user access)
- Integration support for Datafeed and FTS

### Phase 3

- Billing enforcement (limits on instances, users, retention)
- Advanced configuration options and automation

---

## Resources

- **Legacy:** INC0111321 (ServiceNow ticket)
- **KHQ today:** `clients.prod.tfvars` (Terraform)

---

## Meetings / notes

**SFTP Mailbox Manager PRD review** — 2026-04-14 07:30 MST  

- Notes by Gemini  
- Attendees: Jaro, Colin, Thomas
