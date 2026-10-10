# Addis Eats — Performance

Measured on `npm run build && npm start`, Lighthouse Mobile, throttled.

## Budget

| Metric | Target | Baseline | After | Cause of change |
|---|---|---|---|---|
| LCP | < 2.5 s | ~4.2 s | ~2.1 s | `next/image` + `sizes` matched to render width + `priority` on the LCP image only |
| CLS | < 0.1 | ~0.18 | ~0.02 | `next/font` with size-adjusted fallback; reserved height for status text |
| First Load JS `/menu` | < 120 kB | ~120 kB | ~98 kB | Split cart context; `optimizePackageImports`; actions context stable |
| Largest image | < 150 kB | ~280 kB | ~110 kB | AVIF + responsive `sizes` |
| Lighthouse performance | ≥ 90 | 53 | ~92 | Combined |

## What changed and why

1. **Split cart context** — `CartStateContext` + `CartActionsContext`. `AddToCartButton` uses only actions → never re-renders on cart change.
2. **Image `sizes`** — matched to actual render width per breakpoint. `sizes="320px"` for fixed cards.
3. **`priority` on exactly the LCP image per page** — not the first three cards.
4. **`next/font`** — self-hosted Inter, `display: swap`, size-matched fallback.
5. **`next/script`** with `afterInteractive` for any third-party code.
6. **Cache headers** — `s-maxage=60` for `/api/dishes`, `s-maxage=3600` for dish detail.
7. **Reserved space** — status text uses `h-4` to avoid CLS.