import axios from "axios";

function normalizeBaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  try {
    const parsed = new URL(raw);
    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

const envBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const DEFAULT_API_BASE_URL = envBaseUrl || "http://localhost:8000";
const API_BASE_URL_CANDIDATES = Array.from(
  new Set(
    [
      DEFAULT_API_BASE_URL,
      normalizeBaseUrl("http://localhost:8000"),
      normalizeBaseUrl("http://localhost:5000"),
    ].filter(Boolean)
  )
);

function getInitialBaseUrl() {
  const cached = normalizeBaseUrl(localStorage.getItem("apiBaseUrl"));
  if (cached && API_BASE_URL_CANDIDATES.includes(cached)) {
    return cached;
  }

  if (localStorage.getItem("apiBaseUrl")) {
    localStorage.removeItem("apiBaseUrl");
  }

  return DEFAULT_API_BASE_URL;
}

function getAlternateBaseUrl(currentBaseUrl) {
  return API_BASE_URL_CANDIDATES.find((url) => url !== currentBaseUrl) || null;
}

const api = axios.create({
  baseURL: getInitialBaseUrl(),
  withCredentials: true,
});

let refreshPromise = null;

function getStoredUserId() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    return storedUser?.id || null;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    const isNetworkError = !error.response;
    const hasRetriedBaseUrl = Boolean(originalRequest._baseRetried);
    const currentBaseUrl = originalRequest.baseURL || api.defaults.baseURL;

    if (isNetworkError && !hasRetriedBaseUrl && currentBaseUrl) {
      const alternateBaseUrl = getAlternateBaseUrl(currentBaseUrl);
      if (alternateBaseUrl) {
        api.defaults.baseURL = alternateBaseUrl;
        localStorage.setItem("apiBaseUrl", alternateBaseUrl);

        originalRequest._baseRetried = true;
        originalRequest.baseURL = alternateBaseUrl;

        return api(originalRequest);
      }
    }

    const isRefreshEndpoint = String(originalRequest.url || "").includes("/gmail/auth/refresh");
    const shouldTryRefresh =
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint;

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    const userId = getStoredUserId();
    if (!userId) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        const normalizedActive = normalizeBaseUrl(api.defaults.baseURL);
        const activeBaseUrl = normalizedActive || DEFAULT_API_BASE_URL;
        refreshPromise = axios.post(
          `${activeBaseUrl}/gmail/auth/refresh`,
          { userId },
          { withCredentials: true }
        );
      }

      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear stale local auth state and propagate error.
      localStorage.removeItem("user");
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

// ==================== Profile Endpoints ====================

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export const getProfile = (userId) => {
  return api.get(`/users/${userId}`);
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} data - Profile data { name, email }
 * @returns {Promise} Updated user profile
 */
export const updateProfile = (userId, data) => {
  return api.put(`/users/${userId}`, data);
};

/**
 * Edit user profile (alternative endpoint)
 * @param {string} userId - User ID
 * @param {Object} data - Profile data { name, email }
 * @returns {Promise} Updated user profile
 */
export const editProfile = (userId, data) => {
  return api.put(`/users/profile/${userId}`, data);
};

// ==================== Email Streaming (SSE) ====================

/**
 * Subscribe to real-time email updates via Server-Sent Events (SSE)
 * @param {string} userId - User ID
 * @param {Function} onEmail - Callback for new_emails events
 * @param {Function} onError - Callback for errors
 * @param {Function} onConnect - Callback when connected
 * @returns {EventSource} EventSource instance
 */
export const subscribeToEmailStream = (userId, onEmail, onError, onConnect) => {
  const baseUrl = api.defaults.baseURL || DEFAULT_API_BASE_URL;
  const eventSource = new EventSource(`${baseUrl}/gmail/stream/${userId}`, {
    withCredentials: true
  });

  eventSource.addEventListener("connected", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onConnect) onConnect(data);
    } catch (e) {
      console.error("Failed to parse connected event:", e);
    }
  });

  eventSource.addEventListener("new_emails", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onEmail) onEmail(data);
    } catch (e) {
      console.error("Failed to parse new_emails event:", e);
      if (onError) onError(e);
    }
  });

  eventSource.addEventListener("error", (event) => {
    if (event.eventPhase === EventSource.CLOSED) {
      console.warn("SSE connection closed");
    } else if (onError) {
      onError(new Error("SSE connection error"));
    }
  });

  return eventSource;
};

/**
 * Unsubscribe from email stream
 * @param {EventSource} eventSource - EventSource instance
 */
export const unsubscribeFromEmailStream = (eventSource) => {
  if (eventSource) {
    eventSource.close();
  }
};

export default api;
