// all the calls to the backend are kept in this one file

const BASE_URL = "http://localhost:5000/api";

// the logged in user is saved in localStorage so refresh does not logout
export function getUser() {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
}

export function saveLogin(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", data.token);
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// small helper that adds the token and handles errors
async function request(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  const options = {
    method: method,
    headers: { "Content-Type": "application/json" },
  };
  if (token) {
    options.headers.Authorization = "Bearer " + token;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const api = {
  login: (form) => request("/auth/login", "POST", form),
  register: (form) => request("/auth/register", "POST", form),
  getAllDonations: (search) => request("/donations?search=" + encodeURIComponent(search || "")),
  getMyDonations: () => request("/donations/mine"),
  addDonation: (form) => request("/donations", "POST", form),
  acceptDonation: (id) => request("/donations/" + id + "/accept", "PUT"),
  deleteDonation: (id) => request("/donations/" + id, "DELETE"),
};
