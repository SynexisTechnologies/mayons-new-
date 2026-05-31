const BASE = "http://localhost:5000/api";

// Use singular `/product` routes to match backend `productRouter` mounting
export const getProducts = async () =>
  fetch(`${BASE}/product/all`).then(r => r.json());



export const updateProduct = async (id: string, data: any) =>
  fetch(`${BASE}/product/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteProduct = async (id:string) =>
  fetch(`${BASE}/product/delete/${id}`, { method:"DELETE" });

export const getSoldSummary = async () =>
  fetch(`${BASE}/orders/summary`).then(r => r.json());
