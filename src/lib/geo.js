// src/lib/geo.js

export const NEIGHBOURHOOD_COORDS = {
  "Bole":       [9.0104, 38.7616],
  "Kirkos":     [9.0045, 38.7523],
  "Yeka":       [9.0419, 38.8035],
  "Arada":      [9.0372, 38.7523],
  "Gullele":    [9.0597, 38.7506],
  "Akaki":      [8.9352, 38.7862],
  "Nifas Silk": [8.9990, 38.7141],
  "Unknown":    [9.0192, 38.7525],
};

export const RESTAURANT = [9.0104, 38.7616];

export function coordsFor(neighbourhood) {
  const delivery =
    NEIGHBOURHOOD_COORDS[neighbourhood] ?? NEIGHBOURHOOD_COORDS.Unknown;
  return { restaurant: RESTAURANT, delivery };
}