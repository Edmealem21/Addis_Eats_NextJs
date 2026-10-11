// src/lib/dishes.js
export const dishes = [
  { id: "doro-wat", name: "Doro Wat", category: "Mains", price: 320,
    description: "Slow-simmered chicken in berbere and niter kibbeh, served with injera.",
    image: "/dishes/doro-wat.jpg" },
  { id: "kitfo", name: "Kitfo", category: "Mains", price: 380,
    description: "Minced beef tossed in mitmita and niter kibbeh, warmed or raw.",
    image: "/dishes/kitfo.jpg" },
  { id: "shiro", name: "Shiro", category: "Veg", price: 180,
    description: "Creamy chickpea stew with garlic, ginger, and berbere.",
    image: "/dishes/shiro.jpg" },
  { id: "tibs", name: "Beef Tibs", category: "Mains", price: 340,
    description: "Sautéed beef cubes with onions, rosemary, and jalapeño.",
    image: "/dishes/tibs.jpg" },
  { id: "misir-wot", name: "Misir Wot", category: "Veg", price: 200,
    description: "Red lentil stew simmered in berbere and onions.",
    image: "/dishes/misir-wat.jpg" },
  { id: "gomen", name: "Gomen", category: "Veg", price: 190,
    description: "Collard greens cooked with garlic, ginger, and spices.",
    image: "/dishes/gomen.jpg" },
  { id: "firfir", name: "Firfir", category: "Mains", price: 250,
    description: "Shredded injera tossed in spicy berbere sauce.",
    image: "/dishes/firfir.jpg" },
  { id: "beyaynetu", name: "Beyaynetu", category: "Veg", price: 260,
    description: "A combination platter of vegetarian stews on injera.",
    image: "/dishes/beyaynet.jpg" },
];

export async function getDishes() { return dishes; }
export async function getDish(id) { return dishes.find((d) => d.id === id) ?? null; }