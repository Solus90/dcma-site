# DNS Cutover Runbook — doorcountymutualaid.org (Wix → Vercel)

Prereqs: production deploy verified on the vercel.app URL; Resend account with the
domain verified (DKIM/SPF) so the form's `from: contact@doorcountymutualaid.org` works;
`NUXT_RESEND_API_KEY` set in Vercel production env.

1. Lower DNS TTL to 300s at the current DNS host ~24h before cutover.
2. Deploy to production (`vercel --prod`) so the prod deployment is ready.
3. In Vercel: add custom domains `doorcountymutualaid.org` + `www`; note the records it asks for.
4. At the DNS host (check whether DNS is Wix-managed; if so, move DNS to the registrar
   or Vercel DNS first):
   - apex A → `76.76.21.21` (or the value Vercel shows); `www` CNAME → `cname.vercel-dns.com`
   - keep MX/Google records untouched (org uses Gmail)
   - add Resend DKIM/SPF records
5. Verify HTTPS cert issued; test both pages, the `/about-us` 301, and the contact form
   on the live domain.
6. Keep the Wix subscription until the new site has been live and stable ~2 weeks, then
   cancel. Do NOT delete the Wix site immediately — it's the only content backup besides Sanity.

Post-cutover: add the production domain as a CORS origin on the Sanity project if the
Studio is ever hosted there, and create a Vercel Deploy Hook + Sanity webhook so content
publishes trigger a rebuild.
