import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
  const token = await getUserToken();
  const header = {
    authorization: `Bearer ${token}`,
  };
  return token ? header : {};
};

export const serverMutation = async (path, method, data) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...await authHeader(),
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const serverDelete = async (path) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...await authHeader(),
    },
  });
  return res.json();
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    cache: "no-store",
  });
  return res.json();
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    cache: "no-store",
    headers: await authHeader(),
  });
  return res.json();
};