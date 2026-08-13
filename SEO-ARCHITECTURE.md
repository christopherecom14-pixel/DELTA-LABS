# Delta Labs SEO Architecture

## Search positioning

**Business model:** AI automation and custom software agency serving international growth-stage businesses.

**Primary entity:** Delta Labs — provider of AI agent development, workflow automation, custom software development and business systems integration.

**Homepage intent:** Commercial investigation for businesses seeking an AI automation agency or custom software partner. The homepage targets the broad category; future service pages should own narrower service intent.

## Landing page foundations implemented

- One descriptive H1 aligned to the primary commercial topic.
- Search title, meta description, canonical URL, Open Graph and X metadata.
- Index/follow rules with full preview allowances.
- Dynamic `/robots.txt` and `/sitemap.xml` tied to the deployed host.
- JSON-LD graph connecting `Organization`, `WebSite`, `WebPage` and four `Service` entities through stable IDs.
- Visible copy and structured data use the same service names and claims.
- Existing long-form sections supply business context, service explanations, methodology, original product evidence, FAQs and contact information.

## Recommended page architecture

```text
/
├── /services/
│   ├── /ai-agent-development/
│   ├── /workflow-automation/
│   ├── /custom-software-development/
│   └── /systems-integration/
├── /work/
│   └── /housesbase/
├── /industries/
│   ├── /service-businesses/
│   ├── /agencies/
│   └── /growth-stage-companies/
├── /about/
├── /contact/
└── /insights/
    ├── /ai-agents/
    ├── /business-automation/
    └── /software-systems/
```

Only create a child page when Delta Labs can provide at least 800 words of genuinely distinct service content or verifiable first-hand evidence. Do not create thin industry/location variants.

## Internal linking model

- Homepage → every core service page using descriptive service anchors.
- Service pages → relevant case studies, methodology, contact and 2–4 supporting insights.
- Case studies → the service and industry pages they substantiate.
- Insights → one parent service plus closely related articles.
- About and contact remain reachable from global navigation and footer.

## Next implementation sequence

1. Create the four service pages and replace homepage section anchors with crawlable page links.
2. Publish a verifiable HousesBase case study with problem, role, process, original visuals and outcomes that can be substantiated.
3. Create standalone About and Contact pages with real company/team details, privacy policy and terms.
4. Add Search Console verification only after the production domain is final, then submit `/sitemap.xml` and establish a baseline.
5. Add insights only from first-hand project knowledge; avoid generic scaled AI articles.

## Measurement and falsifiability

| Change | Leading indicator | Failure check |
|---|---|---|
| Homepage targeting | Impressions for AI automation/custom software terms | After indexing and 8–12 weeks, no relevant impressions appear |
| Structured entity graph | Valid Schema.org output and consistent parsed entities | Validator errors or visible/schema claims diverge |
| Crawl controls | Homepage discovered in submitted sitemap | Canonical host mismatch or URL remains excluded |
| Service architecture | Service pages earn distinct queries and impressions | Pages cannibalize one another or remain thin/no-impression |

## Known trust gaps

No unverified trust signals were added. Before publishing stronger claims, supply real team identities, legal business details, client evidence, privacy/terms pages and verified social profiles. Add those facts to visible pages first, then mirror them in `Organization` schema.
