export const geocodeAddress = async ({ city, state, pincode, country = "India" }) => {
  try {
    const query = [pincode, city, state, country].filter(Boolean).join(", ");
    const baseUrl =
      process.env.GEOCODE_PROVIDER_URL || "https://nominatim.openstreetmap.org/search";

    const url = `${baseUrl}?${new URLSearchParams({ q: query, format: "json", limit: "1" })}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: { "User-Agent": "aya-care-app" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Geocoding request failed with status ${res.status}`);

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.error("Geocoding failed, defaulting to [0,0]:", err.message);
  }
  return { lat: 0, lng: 0 };
};