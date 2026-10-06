## Meta's Muse Went Viral — But It Wasn't the First AI Assistant That Can Actually Do Things

On September 8, 2026, Meta launched Muse, a personal AI agent: every user gets a dedicated cloud computer (the Muse Secure VM) that keeps working after you close the app — browsing, filling forms, sending email, booking, negotiating, and paying via Stripe Link one-time card numbers (official claim). It lives in the Muse app, on muse.ai, and inside WhatsApp; a Mac app followed on September 17, and Canada opened on September 18 (official claim / media reporting). In 22 days it racked up roughly 5 million downloads (Sensor Tower, third-party estimate) and topped both US charts.

But one question deserves a straight answer first: **was Muse really the first personal AI assistant that can actually do things?** Clearly not. It blew up for other reasons. This article walks through 11 products in the field, keeps source labels on every number, and writes "not publicly disclosed" wherever the data doesn't exist.

First, the three name checks — all three guesses were right:

- **"minus" = Manus**: the general autonomous agent launched March 6, 2025. After China's regulators blocked Meta's reported ~$2B acquisition, Manus became independent again on September 1, 2026; it shipped Manus 2.0 and the personal-agent app Cue on September 28 (media reporting).
- **"dots" = OpenAI Dots**: not a garble — a real product, launched September 29, 2026 at DevDay, where each "Dot" is a persistent agent (official claim / media reporting).
- **Grok's "bots" = Grok Bot**: the agent product that entered beta on August 11, 2026. The companion characters (Ani, Rudi) are a separate line that moved to a standalone app, Animates, in September — don't conflate them (media reporting).

### The "first" question, settled by timeline

| Date | Product | What it shipped first |
|---|---|---|
| Oct 2024 | Anthropic computer use (preview) | AI operating a computer interface directly |
| Jan 23, 2025 | OpenAI Operator | Its own browser; filled forms and placed orders |
| Mar 6, 2025 | Manus | General autonomous agent delivering finished work |
| Jul 9, 2025 | Perplexity Comet | An agentic browser that does tasks |
| Jan 12, 2026 | Claude Cowork | Desktop file agent |
| May 19, 2026 | Google Gemini Spark | 24/7 cloud personal agent |
| Aug 11, 2026 | Grok Bot (beta) | Multi-bot team agent |
| Sep 8, 2026 | **Meta Muse** | Free, WhatsApp-distributed consumer personal agent |

Before all of them, Alexa, Siri, and Google Assistant spent a decade doing narrow real-world actions. The conclusion: **every technical ingredient of Muse shipped earlier somewhere else.** Muse's defensible "first" is much narrower — the first free, standalone, consumer-branded personal agent with its own cloud computer and transaction rails, distributed through WhatsApp-scale surfaces. That's a claim about audience and price, not invention.

### So why did it explode?

- **Distribution, bought and owned**: Meta house ads started September 9; between September 14–27 Muse took up to roughly half of Meta's daily house-ad impressions and ranked among the top-15 US brands by ad impressions that week (media reporting / third-party data). Add cross-promotion to Facebook and Instagram users — the Threads playbook — on top of Meta AI's claimed ~1 billion monthly users (company figure, via secondary reporting), a funnel Muse inherits for free.
- **A concept that demos in one sentence**: "an agent with its own computer that buys, books, and messages for you." Rivals' equivalents were priced ($100–300/month tiers), work-flavored, or buried as modes inside chatbots.
- **Free and phone-first**: the free tier reportedly includes a 100M-token weekly allowance (media reporting), versus Dots bundled into Pro ($100/mo), Spark into Ultra ($100/mo), and Perplexity Personal Computer at $200/mo. Free removes the evaluation barrier entirely.
- **A news cycle that kept compounding**: Mac app (Sep 17), #1 on both charts (Sep 18–19), blocked by Amazon (Sep 20), Connect keynote (Sep 23), small-business launch and OpenAI Dots the same day (Sep 29) — three straight weeks of fresh headlines.
- **Controversy amplification**: the Marketplace address incident and the Amazon block generated earned media no ad buy could purchase — while also defining Muse's risk story (details in the companion piece).

### The one-line verdict: the trial heat is real; the habit is unproven

Here is the heat, with its sourcing kept intact:

- **Downloads**: ~5 million in 22 days (Sensor Tower, third-party estimate); ~2.8 million in the first two weeks; #1 free app on the US App Store (Sep 18) and Google Play (Sep 19) (media reporting / third-party estimates).
- **Engagement**: over 3 million weekly prompting users, over 1 million daily, over 4 million interacting in any way per week — from leaked internal data reported by The Information; not Meta-official, not audited, and "any interaction" is a generous definition.
- **Retention, task completion rate, paid conversion**: all not publicly disclosed.

So the honest verdict is: **the trial heat is real; the habit is unproven.** Three-million-plus weekly users in week three means a meaningful share of downloaders came back — encouraging, but until someone publishes 30/60/90-day retention, "Muse has won" is launch PR.


### The 11 products, one by one

The autonomy scale used below: **L0** chat only · **L1** proactive briefings/scheduled tasks · **L2** browser/computer use · **L3** purchases/bookings/transactions · **L4** persistent messaging/email/calendar actions on your behalf.

**1. Muse (Meta)**
Autonomy L2–L4. Every user gets a dedicated cloud computer (Muse Secure VM, with its own browser) that keeps working after the app closes: browsing, form-filling, email, travel booking, negotiating, and paying (Link by Stripe; Shopify/Shop Pay partnership announced). Publishing, messaging, and purchasing require approval, and a separate Sentinel agent reviews sensitive actions. The free tier is reported at 100M tokens/week; Power is $20/mo and Maximum $100/mo — paid tiers buy headroom, not features. A payment card is reportedly required even for the free tier. US first (Canada followed), 18+, no Windows app. Adoption: fast downloads, retention not publicly disclosed (see above).

**2. OpenAI Dots (OpenAI)**
Launched September 29, 2026 — the same shape as Muse: a persistent agent with its own cloud computer. Autonomy L2–L4, but with the most explicitly tiered permission design in this set: background proactive research is **read-only by default** (it cannot send, edit, or take control), consequential actions need approval, custom rules can require approval or block actions outright, there's an activity view, and **password changes are never delegated**. The catch is price: Dots comes with Pro ($100–500/mo) or Business Premium ($100–125/user/mo); personal Pro excludes the EEA, UK, and Switzerland at launch. Dots user numbers: **not publicly disclosed**. Its parent, ChatGPT, reported 900M weekly users in February 2026 (OpenAI figure via secondary reporting).

**3. ChatGPT Work (OpenAI)**
A work-oriented agent launched July 9, 2026. Autonomy L1–L2 (plus local-computer control), with plugins for Drive, Slack, Teams, Salesforce, and scheduled execution. Included with Plus ($20/mo), Pro, and Business. Together with scheduled tasks, this is where the retired Operator, ChatGPT agent mode, and Pulse (proactive morning cards, retired June 17, 2026 into scheduled tasks) landed. User numbers not broken out publicly.

**4. Manus + Cue (Butterfly Effect)**
The longest-running general agent (March 2025). Autonomy L2; the Cue app (September 28, 2026) gives each agent its own email, phone number, wallet, and computer, pushing into L3/L4 within limits. Credit pricing: 300 free credits/day, Pro from $20/mo (4,000 credits); a complex task can burn 500–1,500 credits, so costs are unpredictable — its biggest complaint. The company claimed $100M+ ARR eight months after launch (December 2025, company claim). The "22 million users" figure circulating in comparisons is **unverified**; ~22M monthly *visits* is a traffic estimate, not users.

**5. Grok Bot (xAI/SpaceXAI)**
Beta since August 11, 2026. The pitch is "AI teammates": multiple Bots share one account-scoped cloud computer (browser, filesystem, terminal), sign into legacy sites without APIs, learn routines by watching you once, hand work to each other in threads, and return only for approval. Autonomy L2–L4. Pricing reports conflict: launch coverage cited $300/mo SuperGrok Heavy-style bundles, later coverage pointed to $30/$20 entry points — **check the official page**. Adoption: 418,000 weekly users as of September 14, 2026 — **company presentation figure, reported by financial media, not audited**. Its safety record is the worst in this set: a January 2026 Common Sense Media assessment (via secondary coverage) rated Grok near the bottom for teen safety, on top of the Grok chatbot's earlier controversies.

**6. Gemini Spark (Google)**
Announced at I/O on May 19, 2026: a 24/7 personal agent on Google Cloud VMs (Gemini 3.5 Flash) that works while your devices are off, with up to 15 concurrent tasks reported. Autonomy L1–L3: it operates Gmail, Calendar, Docs, Sheets, and Drive, with third-party connectors rolling out (Canva, OpenTable, Instacart named). **Purchases are not autonomous at launch** — approval required; a payment protocol with user-set limits and an audit trail (AP2) is planned for later. Sending and spending default to ask-first. Pricing: AI Ultra ($100/$200/mo) at launch; a July 24 report said Spark had expanded to the $20 Pro plan in the US — **single-source, not confirmed**. Spark user numbers not publicly disclosed; the parent Gemini app went from 900M MAU (May 2026, Google figure via compilations) to over 1B (August 2026).

**7. Siri AI (Apple)**
Unveiled at WWDC in June 2026 and shipped with iOS 27 in September — but still labeled **beta** and behind a **waitlist**, requiring iPhone 15 Pro or newer. Autonomy L1–L2, OS-native across apps, with privacy (on-device/private cloud) and system integration as the strengths. The weakness is the two-year delay saga: 2024 preview, March 2025 delay, false-advertising class action, and a **$250M settlement in May 2026**. Free with the device, no subscription. iPhone/iPad in the EU delayed over DMA issues; no China at launch. Siri-AI-specific user numbers: **not publicly disclosed**.

**8. Alexa+ (Amazon)**
Generally available in the US from February 4, 2026, playing the home-and-commerce lane: food and grocery ordering, restaurant booking, repairs, travel, smart-home control. Autonomy L2–L3. Free for Prime members, $19.99/mo standalone. Amazon said Alexa+ had scaled to "tens of millions" of customers by January 2026 (**company claim via secondary roundup**); the often-quoted 600M figure is devices/endpoints, **not users**. Its gap: voice/home-centric, weak at open-web and computer work. Note Amazon's two-way role: it sells Alexa+ while blocking Muse (September 20) and litigating against Perplexity's Comet.

**9. Copilot / Autopilot (Microsoft)**
On September 25, 2026 Microsoft merged consumer and work Copilot into one app; Autopilot (formerly Scout) is the proactive, long-running personal agent — but as of late September it was **private preview: announced, not generally shipped**. Autonomy L1–L2 in the work lane: Cowork creates files, drafts email, manages calendar and OneDrive, runs on schedule. Free chat tier; Microsoft 365 Premium ~$19.99/mo; the work add-on ~$30/user/mo. Official consumer MAU: **not publicly disclosed**. Strengths are Office/Teams distribution and enterprise governance; there's no consumer errand or shopping story.

**10. Comet / Computer / Personal Computer (Perplexity)**
Three stacked products. Comet is an AI-native browser with agentic browsing (July 9, 2025; free worldwide from October 2, 2025). Computer (February 25, 2026) is a cloud multi-agent system orchestrating ~19–20 models. Personal Computer (announced March 11, 2026, shipping from April 16) is an always-on agent on your own Mac with local file and native-app access (iMessage, Mail, Calendar), a kill switch, mandatory confirmations, and an audit trail — Max-only ($200/mo), waitlist-first. Autonomy L2–L3. Pricing: Comet free; Pro $20/mo includes Computer; Max $200/mo for Personal Computer. Adoption definitions conflict: core Perplexity is estimated at ~30–45M MAU by various third parties, while the CEO has claimed "100M+ across all products" — **no audited figure exists**. Legally, the Amazon v. Perplexity case is the category's landmark: a March 2026 preliminary injunction was **vacated by the Ninth Circuit on August 4, 2026**, holding that the *user*, not Perplexity, "accesses" the system — an important precedent for every browser agent.

**11. Claude Cowork (Anthropic)**
Launched January 12, 2026 as a research preview: grant it a folder, and Claude reads, edits, and creates files, runs multi-step tasks in parallel, and uses connectors (Gmail, Drive, Notion, Slack) plus Chrome for web tasks. Autonomy L2, selectively L4 via connectors and scheduled runs. Its **folder-scoped permissions** are the clearest least-privilege UX in this set — the direct opposite of Muse's coarse "Allow Always." Bundled in Claude Pro ($20/mo) and Max ($100–200/mo). Parent adoption: Claude at 245M monthly "True Audience" in May 2026 (Sensor Tower panel estimate, third-party).

### The comparison table

| Product (company) | Status / launch | Autonomy | Permission design | Price (USD/mo) | Availability pitfalls | Adoption signal (source type) |
|---|---|---|---|---|---|---|
| **Muse** (Meta) | Shipped 2026-09-08 | L2–L4 | App-level grants + Sentinel review + approval for send/buy/publish; "Allow Always" shown too coarse | Free (100M tokens/wk); $20; $100 | US→Canada; 18+; card reportedly required; no Windows app | ~5M downloads/22 days (Sensor Tower estimate); >3M weekly prompting users (internal leak); retention not publicly disclosed |
| **OpenAI Dots** | Shipped 2026-09-29 | L2–L4 | Tiered: read-only background, approval rules, activity view, passwords never delegated | Included in Pro $100–500 / Business Premium $100–125 | EEA/UK/CH excluded (personal Pro) | Not publicly disclosed (parent ChatGPT: 900M weekly users, Feb 2026, official via secondary) |
| **ChatGPT Work** | Shipped 2026-07-09 | L1–L2 (+local computer control) | Plugin grants; confirmations for consequential actions | Included in Plus $20 / Pro / Business | Rollout staged by plan | Not broken out publicly |
| **Manus + Cue** | Manus 2025-03-06; 2.0/Cue 2026-09-28 | L2; Cue adds L3/L4 within limits | Connector grants; session authorization; governance flagged as behind autonomy | Free 300 credits/day; $20/$40/$200 tiers | Unpredictable credit burn; post-breakup data deletion | $100M+ ARR claimed Dec 2025 (company claim); user total unverified |
| **Grok Bot** | Beta 2026-08-11 | L2–L4 | Approval before send/buy/delete (with Allow Always option) | Bundled; reports conflict ($20–300) — check official | Beta; weakest safety record in set | 418K weekly users, Sep 14 2026 (company presentation, not audited) |
| **Gemini Spark** | Announced 2026-05-19 | L1–L3 | Ask-first for sending/spending; purchases approval-only | Ultra $100/$200; Pro $20 expansion reported, unconfirmed | US-first beta; no free agent tier | Spark: not publicly disclosed. Gemini app 900M→1B+ MAU (Google figures via compilations) |
| **Siri AI** | iOS 27, Sep 2026 — beta + waitlist | L1–L2 | On-device/private-cloud positioning, per-app controls | Free with device | EU iPhone/iPad delayed (DMA); no China at launch; 15 Pro+ only | Not publicly disclosed |
| **Alexa+** | US GA Feb 4, 2026 | L2–L3 | Wake-word + privacy dashboard | Free with Prime; $19.99 non-Prime | Staggered by country/language; no open-web/computer work | "Tens of millions" by Jan 2026 (Amazon claim via secondary); 600M is devices, not users |
| **Copilot / Autopilot** | Announced Sep 25, 2026; Autopilot private preview | L1–L2 | Enterprise admin/Entra controls | Free chat; M365 Premium ~$19.99; work add-on ~$30/user | Autopilot not generally available; work-first | No official consumer figure found |
| **Perplexity trio** | Comet 2025-07-09; Computer 2026-02-25; Personal Computer Mar–Apr 2026 | L2–L3 | Kill switch, mandatory confirmations, audit trail | Comet free; Pro $20; Max $200 | Personal Computer Mac-only, waitlist-first | Core ~30–45M MAU (third-party estimates) vs "100M+ all products" (CEO claim) — conflicting, no audited figure |
| **Claude Cowork** | Preview 2026-01-12 | L2 (+L4 via connectors) | Folder-scoped grants — clearest least-privilege UX | Included in Pro $20 / Max $100–200 | Desktop-first; burns plan limits faster than chat | Claude 245M monthly True Audience, May 2026 (Sensor Tower estimate) |

### Conclusion: where Muse actually wins, and where it lags

**Its real first-mover advantages are three.** First, distribution economics: WhatsApp plus Facebook/Instagram house inventory means near-zero acquisition cost; the only comparable funnels are Google's (Android) and Apple's (iOS) — and both gate their agents behind premium tiers or hardware-plus-beta. Second, a consumer transaction stack: Stripe Link protections and Shopify/Shop Pay agentic checkout at launch, with a stated take-rate-on-transactions monetization path; most rivals still stop at "added to cart, now asking." Third, a small-business wedge: Muse for Small Business (September 29) wired into Meta ad accounts and Facebook/Instagram Pages — it can act where small businesses already acquire customers.

**Its lags are just as concrete.** Permission design produced a real-world failure (the address incident) in a category where OpenAI's read-only-by-default proactive tier looks better designed. Platform politics bit within 12 days (Amazon's block), and the agent-identity question — the same one the Ninth Circuit weighed in the Comet case — will decide whether VM-browser agents keep working across the open web. Ecosystem depth is thin: Dots claims 4,000+ plugin apps (company claim), Spark owns Gmail/Workspace/Android natively, Copilot owns Office; Muse's non-Meta connectors number around 15 and lean business. Geography and form factor are narrow: US/Canada only, 18+, card-gated, no Windows client. And the evidence gap looms largest: no published retention, task-success, or revenue data, so unit economics at scale remain unproven.

**Closest substitutes, ranked by overlap with Muse's job:** OpenAI Dots (same always-on VM pattern; loses on price and free access), Gemini Spark (same pattern inside Google's data; loses on price and US-only beta), Manus/Cue (longest-proven deliverable agent; loses on consumer errands and pricing predictability), Grok Bot (genuinely differentiated multi-bot teams; loses on consumer polish, safety record, price clarity), then Perplexity Personal Computer and Claude Cowork (local/desktop file agents — a different job than phone-first errands). Siri AI and Alexa+ compete for a different slot entirely: the *default* assistant on your phone and in your home, a battle Muse fights through WhatsApp rather than hardware.

**What to watch next:** any Muse DAU/retention or transaction figure in Meta's October 28, 2026 earnings; whether Dots drops to Plus or reaches the EEA; whether Spark's reported move to the $20 Pro tier firms up and AP2 payments go live; post-Ninth-Circuit agent-identity standards and whether "partner vs. block" hardens into a toll model; whether Muse adopts action-tiered approvals (read/draft/send/commit) of the kind Dots shipped; and the Muse Charm hardware ship date and price (announced for December 2026). Until retention is published, treat "Muse has won" as launch PR — and keep respecting the distribution machine.

For the hands-on sequel — how much Muse can actually do for you every day — read the companion piece: [Putting Muse to Work: How Far Its Daily Tasks and Merchant Integrations Really Go](/tech/#meta-muse-daily-tasks).

### Main sources

- TechCrunch, "Meta is putting its muscle behind Muse as the AI app takes off" (2026-09-25) — https://techcrunch.com/2026/09/25/meta-is-putting-its-muscle-behind-muse-as-the-ai-app-takes-off/
- Storyboard18, "Meta Muse crosses 5 million downloads in 22 days" (2026-10-01) — https://www.storyboard18.com/digital/meta-muse-ai-agent-hits-5-million-us-downloads-in-22-days-ws-l-111781.htm
- TechCrunch, "Manus seeks $4B valuation, resumes independent ops" (2026-09-18) — https://techcrunch.com/2026/09/18/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops/
- Reuters, "Meta expands Muse AI agent for small businesses" (2026-09-29) — https://www.reuters.com/business/media-telecom/meta-expands-muse-ai-agent-small-businesses-2026-09-29/
- VentureBeat, "Google's Gemini Spark agent" (I/O 2026) — https://venturebeat.com/technology/googles-new-ai-agent-can-draft-your-emails-monitor-your-inbox-and-eventually-spend-your-money
- Wikipedia, "OpenAI Operator" (launched 2025-01-23; retirement lineage) — https://en.wikipedia.org/wiki/OpenAI_Operator
- PYMNTS, "Microsoft Bundles Copilot Features" (2026-09-25) — https://www.pymnts.com/news/artificial-intelligence/2026/microsoft-bundles-copilot-features-challenge-anthropic-openai-workplace/
- PYMNTS, "SpaceXAI's Grok Bot Gains Early Traction" (2026-09-22) — https://www.pymnts.com/news/artificial-intelligence/2026/spacexai-grok-bot-gains-early-traction-ai-agent-push/
- Mondaq, "Ninth Circuit Vacates CFAA Injunction Against Perplexity's Comet AI Agent" (2026-09-16) — https://www.mondaq.com/unitedstates/it-and-internet/1843346/ninth-circuit-vacates-cfaa-injunction-against-perplexitys-comet-ai-agent
- TechCrunch, "'Among the worst we've seen': report slams xAI's Grok over child safety failures" (2026-01-27) — https://techcrunch.com/2026/01/27/among-the-worst-weve-seen-report-slams-xais-grok-over-child-safety-failures/

*Data as of October 5, 2026. Pricing and availability change often — verify on each product's official site before buying. Third-party estimates, internal leaks, and company claims are labeled item by item; where no public data could be found, this article says so ("not publicly disclosed").*
