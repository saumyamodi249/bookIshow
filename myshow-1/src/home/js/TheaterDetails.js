const API_BASE_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

// =====================================================
// AUTH HEADERS
// =====================================================

const getHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  return {
    Accept: "*/*",
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// =====================================================
// 1. GET THEATER DETAILS
// =====================================================

export const getTheaterDetails = async (theaterId) => {
  if (!theaterId) {
    throw new Error("Theater ID is missing.");
  }

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

  console.log("THEATER DETAILS API:", data);

  return data;
};

// =====================================================
// 2. GET THEATER SHOWS
// =====================================================

export const getTheaterShows = async (theaterId, date) => {
  if (!theaterId) {
    throw new Error("Theater ID is missing.");
  }

  if (!date) {
    throw new Error("Show date is missing.");
  }

  const url =
    `${API_BASE_URL}/theaters/${theaterId}/shows` +
    `?date=${encodeURIComponent(date)}`;

  console.log("THEATER SHOWS API:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theater shows. Status: ${response.status}`
    );
  }

  const data = await response.json();

  console.log("THEATER SHOWS API RESPONSE:", data);

  return data;
};