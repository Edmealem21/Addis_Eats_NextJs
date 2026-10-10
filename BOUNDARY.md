# Addis Eats — Server / Client Boundary

| Component | Side | Why |
|---|---|---|
| `app/layout.js` | Server | Renders html/body, reads session. No hooks. |
| `app/providers.jsx` | **Client** | Owns cart state via useState. Wraps children. |
| `app/cart-context.jsx` | **Client** | createContext/useContext are client-only. |
| `components/CartButton.jsx` | **Client** | Reads cart count from context. |
| `components/CartLines.jsx` | **Client** | Reads items, calls removeItem/clear. |
| `components/AddToCartButton.jsx` | **Client** | onClick writes to cart. Actions context only. |
| `components/SignOutButton.jsx` | **Client** | Submits a Server Action form. |
| `components/MobileNav.jsx` | **Client** | useState for toggle, usePathname, useRef. |
| `components/DishCard.jsx` | Server | Pure markup, no state. |
| `components/AnalyticsScript.jsx` | **Client** | Uses next/script. |
| `app/page.js` | Server | Static home. |
| `app/not-found.js` | Server | Static 404. |
| `app/menu/layout.js` | Server | Arranges sidebar. No state. |
| `app/menu/page.js` | Server | Async; awaits dishes. |
| `app/menu/DishList.js` | Server | Renders grid. No handlers. |
| `app/menu/MenuBrowser.jsx` | **Client** | useSWR, useState, useSearchParams. |
| `app/menu/SearchBox.jsx` | **Client** | useState input, useEffect debounce. |
| `app/menu/Pager.jsx` | **Client** | useRouter, usePathname, useSearchParams. |
| `app/menu/loading.js` | Server | Static skeleton. |
| `app/menu/error.js` | **Client** | Next requires error boundaries client. |
| `app/menu/[id]/page.js` | Server | Async; awaits dish. Emits JSON-LD. |
| `app/orders/[id]/OrderStatus.jsx` | **Client** | useSWR polling every 5s. |
| `app/checkout/CheckoutForm.jsx` | **Client** | useActionState + cart state. |
| `app/signin/SignInForm.jsx` | **Client** | useActionState. |
| `app/actions.js` | Server | "use server". |
| `app/api/**/route.js` | Server | Route handlers. |
| `lib/*.js` | Server | No JSX, no hooks. |

**Total client components: 12.** Each is a leaf that needs state, an event handler, or a browser API.