# Design Requirements Document (DRD)

https://kubra.jira.com/wiki/spaces/P1/pages/1944816281/SFTP+Mailbox+Manager+-+DRD

**SFTP Mailbox Manager — ConfigHQ (User & Inbox Management)**

> **Note:** Not every section of this template must be complete at project kickoff. This document captures what is known today; items marked **TBD** or **Open** should be refined as discovery progresses.

---

## 1. Project metadata

| Field | Value |
|--------|--------|
| **Project name** | SFTP Mailbox Manager — ConfigHQ — User & Inbox management system |
| **Desired timeline for design** | **May 15, 2026** (designs targeted for mid-May to support Platform 1 backend API integration) |
| **Epic** | *(Optional — not specified)* |
| **Product Manager** | @Luciano Huapaya |
| **Engineering Manager** | @Thomas C. Gerlach |
| **UX Designer** | TBD |
| **UX Researcher** | TBD |

### Related links

| Artifact | Link |
|-----------|------|
| **Design Request Form (Airtable)** | [Design Request Form](https://airtable.com/app5mQWBY5YMb29sO/shrSUAzPd1EYUUSuE) |
| **PRD (Confluence)** | [PRD Status](https://kubra.jira.com/wiki/spaces/P1/pages/1916043435) |
| **Current infra reference (GitHub)** | [khq-common-infra-terraform-sftp-server — `clients.prod.tfvars`](https://github.com/iFactor/khq-common-infra-terraform-sftp-server/blob/main/clients.prod.tfvars) |

---

## 2. Background

Platform 1 will begin developing **backend APIs** for SFTP Mailbox Manager with the goal of having **designs ready by mid-May 2026** for full integration.

**Business context:** Creating SFTP mailboxes today is a **manual, technical process** (e.g., updating Terraform configuration in GitHub — see `clients.prod.tfvars`). The initiative aims to make provisioning **scalable and less technical**, so mailboxes can be set up and maintained through a **GUI in ConfigHQ** instead of direct Git/Terraform workflows.

**Scope emphasis:** **KUBRA-hosted SFTP** — the inbox patterns established today for **KHQ clients**.

---

## 3. Feature framing

### 3.1 Objective (problem-focused)

SFTP mailbox management is **fragmented**, which drives:

- **Operational inefficiency** — coordination across teams, delays, manual overhead  
- **Limited visibility** — weak inventory and audit views  
- **Scalability challenges** — process does not scale with growing SFTP usage  

**Today:** Public SSH keys are added via **git/Terraform** (`clients.prod.tfvars`), which implies manual steps and **unclear ownership**.

### 3.2 Feature positioning

- **Centralized SFTP Mailbox Manager** inside **ConfigHQ**  
- **UI** + **backend provisioning service** + **consistent API**  
- **Standardized** mailbox structure, access controls, and limits  
- **Primary focus:** **KUBRA-hosted SFTP**

---

## 4. User information

### 4.1 Personas

| Priority | Persona | Role |
|----------|---------|------|
| **Primary** | **Katalyst admins** | Internal operators who configure and maintain client SFTP mailboxes |
| **Secondary** | **Implementation / Onboarding** | Needs fast, reliable setup and change workflows |

### 4.2 User statement

Admins **provision and manage client SFTP mailboxes** per **client** and **realm** (**Live / Sandbox**) from ConfigHQ. They manage users via **SSH public keys**, define **standard folders**, **reduce manual work**, and **improve visibility** into what exists and who has access.

### 4.3 Use cases (UI must support)

1. **Mailbox list** and **create / update** in ConfigHQ with **realm separation** (Live vs Sandbox).  
2. **Create standard folders** per mailbox (e.g., `remittance`, `batch_payment_posting`).  
3. **Create users** with **username** and **SSH public key**; **add / edit / remove** users on a mailbox.  
4. **Mailbox-level permissions:** **READ**, **WRITE**, **DELETE** — **no per-folder user restrictions in MVP** (see §6.3).  
5. **API** (non-UI but product context): create/manage mailboxes; retrieve mailbox and user **metadata**.  
6. **Audit trail / logging:** **TBD for MVP**; positioned as a **future enhancement** unless explicitly pulled in.

---

## 5. Requirements

### 5.1 Functional requirements (what the UI must enable)

| ID | Requirement | Notes |
|----|-------------|--------|
| F1 | **Create, edit, and delete** SFTP mailboxes for a **client**, with **realm** selection (**Sandbox** or **Live**). | Delete/decommission may align with PRD phasing (e.g., future phase); confirm with PM. |
| F2 | **Add and manage users** on a mailbox: identity fields including **name**, **contact**, **SSH public key**. | Username uniqueness rules **TBD**. |
| F3 | **Mailbox-level permissions** for each user: **READ**, **WRITE**, **DELETE** (aligned to PRD “access to files in the folder” at mailbox scope for MVP). | **Not** per-folder ACLs in MVP. |
| F4 | **Define mailbox folders/locations** and map them to **business use** (e.g., remittance vs batch posting). | Standard folder templates vs freeform **TBD**. |
| F5 | **Form validation:** prevent duplicates where applicable, require keys when mandatory, **clear inline errors**. | |
| F6 | **Activity / audit trail** of changes (**who / what / when**): **future / OOO for “today”** — treat as **post-MVP** unless scope changes. | |

**Consistency note:** One draft bullet suggested “set who can see or change things **in each folder** per user.” That conflicts with **“No per-folder restrictions in MVP.”** This DRD treats **mailbox-level** permissions as MVP; **per-folder** permission matrix is **out of MVP** unless product explicitly changes scope.

### 5.2 Access & roles (high level)

| Concept | Description |
|---------|-------------|
| **Admin vs Viewer** | **Admins** may change mailbox settings and user access; **Viewers** have read-oriented access (exact capabilities **TBD** with engineering/security). |
| **Authentication model** | End users of SFTP consume access via **SSH keys**; PRD notes **password out of scope for now**. UI copy and flows should not assume password-based SFTP login for MVP. |
| **Keys** | Each mailbox user is expected to have **at least one** SSH public key where required by policy (**TBD**: rotation, multiple keys per user). |

### 5.3 UI / UX requirements

#### Key screens (target set)

1. **Mailbox list** — all mailboxes for the client context; filters/search **TBD** (realm, status, etc.).  
2. **Mailbox details** — overview, realm, status, metadata.  
3. **Users management** — list, add, edit, remove; SSH key entry and validation.  
4. **Folders** — define/view folder structure; **MVP:** no per-user folder matrix.  
5. **Activity / audit** — **future** unless MVP scope expands.

#### Flows to design

- **Create mailbox** (wizard or single form — **TBD**)  
- **Add user** to mailbox  
- **Edit user** (including **rotate / update SSH key**)  
- **Deactivate / remove user**  
- **Assign permissions** at **mailbox** level (READ/WRITE/DELETE) — not per-folder in MVP  
- **Destructive actions** — confirmations (delete mailbox, remove user, etc.)

#### States & feedback

- **Empty:** no mailboxes yet; no users yet  
- **Success** confirmations  
- **Inline errors** and field-level validation  
- **Loading** and **partial failure** states **TBD** with API behavior  

#### Validation & microcopy

- Helpful **hints** for SSH key format, realm implications, folder naming  
- **Duplicate prevention** (mailbox name, user name within mailbox — rules **TBD**)  
- Accessible labels and errors (**WCAG** target — align with ConfigHQ standards **TBD**)

---

## 6. Visual references & alignment

### 6.1 Sample images / references

- **SFTP Mailbox Manager API** — align UI terminology with API resources (mailbox, user, folder, realm).  
- **Terraform reference:** [`clients.prod.tfvars`](https://github.com/iFactor/khq-common-infra-terraform-sftp-server/blob/main/clients.prod.tfvars) — useful for **legacy field names** and structure during migration UX (avoid exposing raw Terraform concepts to end users unless intentional).

*Attach design mocks / competitor screenshots / ConfigHQ patterns here as they become available.*

### 6.2 ConfigHQ design system

- Reuse existing **ConfigHQ** layout, navigation, tables, forms, and **KUBRA branding** where applicable (see existing ConfigHQ SFTP / module patterns when designs exist).

---

## 7. Design inspection (post-build)

Per design ops process:

- Confirm whether this initiative requires a **formal design inspection** task.  
- If yes: an inspection task is created and completed **after Engineering** has shipped to an environment, when the **PM / requester** provides links to the **inspectable environment**.

**Trigger checklist (for later):**

- [ ] Engineering notifies design-ready build  
- [ ] PM provides environment URL(s)  
- [ ] Inspection task completed and findings tracked  

---

## 8. Open questions & dependencies

| Topic | Question / dependency |
|--------|------------------------|
| Audit UI | In MVP or strictly future? |
| Delete mailbox | MVP vs phased |
| Folder templates | Fixed list vs configurable labels |
| RBAC detail | Exact Viewer capabilities; integration with IdP / ConfigHQ roles |
| API readiness | Which endpoints land by mid-May vs later (drives mock vs live flows) |
| Billing / quotas | UI surfacing of limits (may be Phase 3 per PRD) |

---

## 9. Document control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | *(creation)* | Derived from request | Initial DRD from design request inputs |

---

*End of DRD.*
