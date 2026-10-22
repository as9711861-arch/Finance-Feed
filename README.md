# Finance Feed

Next.js 15 + Upstash Redis + TradingView widgets.

## Vercel par deploy
1. Is folder ko GitHub repo me push karo.
2. vercel.com > Add New > Project > repo import karo.
3. Project > Storage > Marketplace se **Upstash Redis** add karo (KV_REST_API_URL / KV_REST_API_TOKEN auto set ho jaate hain).
4. Settings > Environment Variables me `ADMIN_PASSWORD` add karo (long, unique).
5. Redeploy. Site live.

## Admin
Footer ke right me chhota sa dot (●) hai. Click karo > password > editor.
Ya seedha `/admin` kholo.

## Local
`npm i && cp .env.example .env.local` (values bharo) `&& npm run dev`
