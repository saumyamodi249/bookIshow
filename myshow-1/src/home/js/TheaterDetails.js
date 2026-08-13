const API_BASE_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

// =====================================================
// API ENDPOINTS
// =====================================================

const SHOWS_API_URL = "";

// =====================================================
// AUTH HEADER
// =====================================================

const getHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// =====================================================
// 1. GET THEATER DETAILS
// GET /theaters/{id}
// =====================================================

export const getTheaterDetails = async (theaterId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/theaters/${theaterId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch theater details. Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Theater Details:", data);

    return data;
  } catch (error) {
    console.error("Error fetching theater details:", error);
    throw error;
  }
};

// =====================================================
// 2. GET THEATER SCREENS
// GET /theaters/{id}/screens
// =====================================================

export const getTheaterScreens = async (theaterId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/theaters/${theaterId}/screens`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch theater screens. Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Theater Screens:", data);

    return data;
  } catch (error) {
    console.error("Error fetching theater screens:", error);
    throw error;
  }
};

// =====================================================
// 3. GET THEATER MOVIES
// GET /theaters/{id}/movies
// =====================================================

export const getTheaterMovies = async (theaterId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/theaters/${theaterId}/movies`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch theater movies. Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Theater Movies:", data);

    return data;
  } catch (error) {
    console.error("Error fetching theater movies:", error);
    throw error;
  }
};

// =====================================================
// 4. GET THEATER SHOWS
// GET /theaters/{id}/shows
//
// SHOW API IS NOT AVAILABLE YET
// Keep endpoint blank for now.
// =====================================================

export const getTheaterShows = async (theaterId) => {
  // Show API not available yet.
  // Endpoint will be added later.

  if (!SHOWS_API_URL) {
    console.warn("Theater Shows API is not configured yet.");

    return {
      data: [],
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOWS_API_URL}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch theater shows. Status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Theater Shows:", data);

    return data;
  } catch (error) {
    console.error("Error fetching theater shows:", error);
    throw error;
  }
};