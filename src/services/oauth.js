import api from "./api";

function normalizeProvider(provider) {
  const value = String(provider || "").trim().toLowerCase();
  if (value === "google") {
    return "gmail";
  }
  return value;
}

function getProviderLabel(provider) {
  const normalized = normalizeProvider(provider);
  if (normalized === "gmail") {
    return "Google";
  }
  if (normalized === "outlook") {
    return "Outlook";
  }
  return "OAuth";
}

export async function startOAuthLogin(provider) {
  const normalizedProvider = normalizeProvider(provider);
  const providerLabel = getProviderLabel(normalizedProvider);

  try {
    const response = await api.get(`/${normalizedProvider}/login`);
    const loginUrl =
      response?.data?.loginUrl ||
      response?.data?.url ||
      response?.data?.authUrl;

    if (!loginUrl) {
      throw new Error(`${providerLabel} login URL was not returned by the server.`);
    }

    window.location.assign(loginUrl);
    return null;
  } catch (error) {
    return (
      error?.response?.data?.error ||
      error?.message ||
      `Failed to start ${providerLabel} login.`
    );
  }
}
