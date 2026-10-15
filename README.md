# aerar

Simple GET API for FortiRecon ACI **stealer infections**.

## Setup

```bash
npm install
cp .env.example .env   # fill in FORTIRECON_API_KEY and FORTIRECON_ORG_ID
npm start              # http://localhost:3000
```

The API key is in the FortiRecon portal: Profile Settings → Subscription Details.
It is sent as the `Authorization` header to `https://api.fortirecon.forticloud.com`.

## Endpoints

| Local endpoint | FortiRecon endpoint |
| --- | --- |
| `GET /stealer-infections/leaked` | `/aci/{org_id}/stealers_infections/leaked` |
| `GET /stealer-infections/on-sale` | `/aci/{org_id}/stealers_infections/on_sale` |
| `GET /stealer-infections/stats/leaked/count-by-affiliated-domain` | `/aci/{org_id}/stats/stealers_infections/leaked/count_by_affiliated_domain` |
| `GET /stealer-infections/stats/leaked/count-by-status` | `/aci/{org_id}/stats/stealers_infections/leaked/count_by_status` |
| `GET /stealer-infections/stats/leaked/count-by-stealer` | `/aci/{org_id}/stats/stealers_infections/leaked/count_by_stealer` |
| `GET /stealer-infections/stats/on-sale/count-by-matched-domain` | `/aci/{org_id}/stats/stealers_infections/on_sale/count_by_matched_domain` |
| `GET /stealer-infections/stats/on-sale/count-by-stealer` | `/aci/{org_id}/stats/stealers_infections/on_sale/count_by_stealer` |
| `GET /health` | – |

Query parameters are forwarded as-is, e.g. pagination:

```bash
curl "http://localhost:3000/stealer-infections/leaked?page=1&size=100"
```

FortiRecon returns 10 records per page by default (max 500) and is rate limited to 60 requests/minute.
