
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/transactions`;


async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("spendwise-token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response");
  }

  if (response.status === 401) {
    localStorage.removeItem("spendwise-token");
    localStorage.removeItem("spendwise-user");

    window.dispatchEvent(
      new Event("spendwise:session-expired")
    );

    throw new Error("Your session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}


export function getTransactions() {
  return apiRequest(API_URL);
}

export function createTransaction(transaction) {
  return apiRequest(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
}

export function updateTransaction(id, transaction) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
}

export function deleteTransaction(id) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
