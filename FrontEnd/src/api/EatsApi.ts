export const fetchRestaurants = async () => {
  const res = await fetch("http://localhost:5000/api/eats/restaurants");
  return res.json();
};

export const fetchMenu = async (restaurantId: string) => {
  const res = await fetch(
    `http://localhost:5000/api/eats/eat-items/${encodeURIComponent(
      restaurantId
    )}`
  );
  return res.json();
};
