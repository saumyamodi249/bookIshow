import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

import {
  getTheaterDetails,
  getTheaterShows,
} from "../js/TheaterDetails";

const TheaterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [theater, setTheater] = useState(null);
  const [shows, setShows] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState({});

  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // BACKGROUND
  // =====================================================

  const backgroundStyle = {
    background: `
      radial-gradient(
        circle 700px at 100% 0%,
        rgba(16, 144, 223, 0.60),
        rgba(16, 144, 223, 0.30) 45%,
        transparent 85%
      ),
      radial-gradient(
        circle 850px at 0% 100%,
        rgba(16, 144, 223, 0.60),
        rgba(16, 144, 223, 0.30) 45%,
        transparent 85%
      ),
      #ffffff
    `,
  };

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const formatApiDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const getDateInfo = (date) => {
    return {
      value: formatApiDate(date),

      day: String(date.getDate()).padStart(2, "0"),

      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),

      weekday: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    };
  };

  // =====================================================
  // THREE DATES
  // FIRST DATE IS DEFAULT
  // =====================================================

  const dates = Array.from({ length: 3 }, (_, index) => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    date.setDate(date.getDate() + index);

    return getDateInfo(date);
  });

  // =====================================================
  // DEFAULT FIRST DATE
  // =====================================================

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].value);
    }
  }, []);

  // =====================================================
  // GET THEATER DETAILS
  // =====================================================

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Theater ID is missing.");
        }

        console.log("THEATER ID:", id);

        const response = await getTheaterDetails(id);

        console.log("THEATER DETAILS RESPONSE:", response);

        const theaterData =
          response?.data ||
          response?.theater ||
          response;

        setTheater(theaterData || null);
      } catch (error) {
        console.error("THEATER DETAILS ERROR:", error);

        setError(
          error?.message ||
            "Failed to load theater details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTheater();
  }, [id]);

  // =====================================================
  // GET SHOWS WHEN DATE CHANGES
  // =====================================================

  useEffect(() => {
    if (!id || !selectedDate) {
      return;
    }

    const fetchShows = async () => {
      try {
        setShowsLoading(true);

        console.log(
          "FETCHING SHOWS FOR DATE:",
          selectedDate
        );

        const response = await getTheaterShows(
          id,
          selectedDate
        );

        console.log(
          "THEATER SHOWS RESPONSE:",
          response
        );

        const showsData =
          response?.data ||
          response?.shows ||
          [];

        const finalShows = Array.isArray(showsData)
          ? showsData
          : [];

        setShows(finalShows);

        // =================================================
        // FIRST TIME OF EVERY MOVIE AS DEFAULT
        // =================================================

        const defaultTimes = {};

        finalShows.forEach((movie, index) => {
          const movieId =
            movie?.id ||
            movie?._id ||
            `movie-${index}`;

          const showTimes =
            movie?.showTimes ||
            movie?.showtimes ||
            movie?.times ||
            [];

          if (
            Array.isArray(showTimes) &&
            showTimes.length > 0
          ) {
            const firstShow = showTimes[0];

            const firstTime =
              typeof firstShow === "string"
                ? firstShow
                : firstShow?.startTime ||
                  firstShow?.time ||
                  firstShow?.showTime ||
                  firstShow?.start ||
                  firstShow?.dateTime ||
                  "";

            if (firstTime) {
              defaultTimes[movieId] = firstTime;
            }
          }
        });

        setSelectedTimes(defaultTimes);
      } catch (error) {
        console.error(
          "THEATER SHOWS ERROR:",
          error
        );

        setShows([]);
        setSelectedTimes({});
      } finally {
        setShowsLoading(false);
      }
    };

    fetchShows();
  }, [id, selectedDate]);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatShowTime = (time) => {
    if (!time) {
      return "";
    }

    try {
      const date = new Date(time);

      if (Number.isNaN(date.getTime())) {
        return time;
      }

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  // =====================================================
  // GET SHOW TIME VALUE
  // =====================================================

  const getShowTimeValue = (showTime) => {
    if (typeof showTime === "string") {
      return showTime;
    }

    return (
      showTime?.startTime ||
      showTime?.time ||
      showTime?.showTime ||
      showTime?.start ||
      showTime?.dateTime ||
      ""
    );
  };

  // =====================================================
  // THEATER NAME
  // =====================================================

  const theaterName =
    theater?.name ||
    theater?.theaterName ||
    theater?.title ||
    "Theater Name";

  // =====================================================
  // THEATER ADDRESS
  // =====================================================

  const theaterAddress =
    theater?.address ||
    theater?.location ||
    theater?.city ||
    "123 Main Street, Springfield, USA";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main
        className="min-h-screen overflow-y-auto hide-scrollbar"
        style={backgroundStyle}
      >
        <Navbar />

        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="
                mb-8
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-500
                transition
                hover:text-[#1090DF]
              "
            >
              <span className="text-xl">←</span>
              Back
            </button>

            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white/70
                p-12
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  mx-auto
                  mb-5
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-sky-200
                  border-t-[#1090DF]
                "
              />

              <p className="text-gray-500">
                Loading theater details...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main
        className="min-h-screen overflow-y-auto hide-scrollbar"
        style={backgroundStyle}
      >
        <Navbar />

        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="
                mb-8
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-500
                transition
                hover:text-[#1090DF]
              "
            >
              <span className="text-xl">←</span>
              Back
            </button>

            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-5
                text-red-600
              "
            >
              {error}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main
      className="
        min-h-screen
        overflow-y-auto
        hide-scrollbar
      "
      style={backgroundStyle}
    >
      <Navbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">

          {/* =================================================
              BACK
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="
              mb-8
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-500
              transition
              duration-200
              hover:text-[#1090DF]
            "
          >
            <span className="text-xl">←</span>
            Back
          </button>

          {/* =================================================
              THEATER HEADER
          ================================================= */}

          <div className="mb-5">

            {/* THEATER NAME */}

            <div className="flex items-center gap-3">
              <span
                className="
                  text-2xl
                  font-normal
                  text-[#1090DF]
                "
              >
                ←
              </span>

              <h1
                className="
                  text-4xl
                  font-bold
                  text-[#1090DF]
                "
              >
                {theaterName}
              </h1>
            </div>

            {/* LOCATION */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                pl-11
                text-sm
                text-gray-500
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="
                    M12 21s7-6.2 7-12
                    a7 7 0 1 0-14 0
                    c0 5.8 7 12 7 12Z
                  "
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.2"
                />
              </svg>

              <span>
                {theaterAddress}
              </span>
            </div>
          </div>

          {/* =================================================
              DATE SELECTOR
          ================================================= */}

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            {/* PREVIOUS */}

            <button
              type="button"
              className="
                px-2
                text-xl
                text-[#1090DF]
              "
              onClick={() => {
                const currentIndex =
                  dates.findIndex(
                    (date) =>
                      date.value === selectedDate
                  );

                if (currentIndex > 0) {
                  setSelectedDate(
                    dates[currentIndex - 1].value
                  );
                }
              }}
            >
              ‹
            </button>

            {/* DATES */}

            {dates.map((date) => {
              const isSelected =
                selectedDate === date.value;

              return (
                <button
                  key={date.value}
                  type="button"
                  onClick={() =>
                    setSelectedDate(date.value)
                  }
                  className={`
                    min-w-[58px]
                    rounded-md
                    border
                    px-3
                    py-2
                    text-xs
                    transition
                    duration-200
                    ${
                      isSelected
                        ? `
                          border-[#1090DF]
                          bg-[#1090DF]
                          text-white
                        `
                        : `
                          border-gray-300
                          bg-white/70
                          text-gray-600
                          hover:border-[#1090DF]
                          hover:text-[#1090DF]
                        `
                    }
                  `}
                >
                  <div className="font-medium">
                    {date.day} {date.month}
                  </div>

                  <div className="mt-0.5">
                    {date.weekday}
                  </div>
                </button>
              );
            })}

            {/* NEXT */}

            <button
              type="button"
              className="
                px-2
                text-xl
                text-[#1090DF]
              "
              onClick={() => {
                const currentIndex =
                  dates.findIndex(
                    (date) =>
                      date.value === selectedDate
                  );

                if (
                  currentIndex <
                  dates.length - 1
                ) {
                  setSelectedDate(
                    dates[currentIndex + 1].value
                  );
                }
              }}
            >
              ›
            </button>
          </div>

          {/* DIVIDER */}

          <div
            className="
              mb-8
              border-b
              border-gray-300
            "
          />

          {/* =================================================
              SHOWS LOADING
          ================================================= */}

          {showsLoading ? (
            <div
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
              "
            >
              <div className="text-center">

                <div
                  className="
                    mx-auto
                    mb-4
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-4
                    border-sky-200
                    border-t-[#1090DF]
                  "
                />

                <p className="text-gray-500">
                  Loading shows...
                </p>

              </div>
            </div>
          ) : shows.length === 0 ? (

            /* =================================================
                NO SHOWS
            ================================================= */

            <div
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
                text-center
              "
            >
              <p
                className="
                  text-lg
                  text-gray-500
                "
              >
                No shows available for this date.
              </p>
            </div>

          ) : (

            /* =================================================
                SHOW LIST
            ================================================= */

            <div className="space-y-0">

              {shows.map((movie, movieIndex) => {

                // ===========================================
                // MOVIE ID
                // ===========================================

                const movieId =
                  movie?.id ||
                  movie?._id ||
                  `movie-${movieIndex}`;

                // ===========================================
                // MOVIE NAME
                // ===========================================

                const movieName =
                  movie?.name ||
                  movie?.title ||
                  movie?.movieName ||
                  `Movie ${movieIndex + 1}`;

                // ===========================================
                // LANGUAGE
                // ===========================================

                const language =
                  Array.isArray(movie?.languages)
                    ? movie.languages.join(", ")
                    : movie?.language ||
                      "Language";

                // ===========================================
                // CATEGORY
                // ===========================================

                const category =
                  Array.isArray(movie?.category)
                    ? movie.category.join(", ")
                    : movie?.category ||
                      movie?.genre ||
                      "";

                // ===========================================
                // SHOW TIMES
                // ===========================================

                const showTimes =
                  movie?.showTimes ||
                  movie?.showtimes ||
                  movie?.times ||
                  [];

                // ===========================================
                // CURRENT SELECTED TIME
                // ===========================================

                const selectedTime =
                  selectedTimes[movieId] || "";

                return (
                  <div
                    key={movieId}
                    className="
                      border-b
                      border-gray-300
                      py-6
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >

                      {/* =================================
                          LEFT
                      ================================= */}

                      <div className="flex-1">

                        {/* MOVIE NAME */}

                        <h2
                          className="
                            text-lg
                            font-semibold
                            text-[#1090DF]
                          "
                        >
                          {movieName}
                        </h2>

                        {/* LANGUAGE + CATEGORY */}

                        <div
                          className="
                            mt-2
                            flex
                            flex-wrap
                            gap-2
                            text-sm
                            text-gray-500
                          "
                        >
                          {language && (
                            <span>
                              {language}
                            </span>
                          )}

                          {category && (
                            <>
                              <span>,</span>

                              <span>
                                {category}
                              </span>
                            </>
                          )}
                        </div>

                        {/* TIME LABEL */}

                        <p
                          className="
                            mt-3
                            mb-2
                            text-sm
                            text-gray-500
                          "
                        >
                          Time
                        </p>

                        {/* TIME BUTTONS */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-3
                          "
                        >
                          {Array.isArray(
                            showTimes
                          ) &&
                          showTimes.length > 0 ? (

                            showTimes.map(
                              (
                                showTime,
                                timeIndex
                              ) => {

                                const timeValue =
                                  getShowTimeValue(
                                    showTime
                                  );

                                const isSelected =
                                  selectedTime ===
                                  timeValue;

                                return (
                                  <button
                                    key={
                                      timeIndex
                                    }
                                    type="button"
                                    onClick={() => {
                                      setSelectedTimes(
                                        (previous) => ({
                                          ...previous,
                                          [movieId]:
                                            timeValue,
                                        })
                                      );
                                    }}
                                    className={`
                                      rounded-lg
                                      border
                                      px-4
                                      py-2
                                      text-sm
                                      transition
                                      duration-200
                                      ${
                                        isSelected
                                          ? `
                                            border-[#1090DF]
                                            bg-[#1090DF]
                                            text-white
                                          `
                                          : `
                                            border-gray-300
                                            bg-white/70
                                            text-gray-600
                                            hover:border-[#1090DF]
                                            hover:text-[#1090DF]
                                          `
                                      }
                                    `}
                                  >
                                    {formatShowTime(
                                      timeValue
                                    )}
                                  </button>
                                );
                              }
                            )

                          ) : (

                            <span
                              className="
                                text-sm
                                text-gray-400
                              "
                            >
                              No show times
                            </span>
                          )}
                        </div>
                      </div>

                      {/* =================================
                          BOOK NOW
                      ================================= */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          justify-end
                        "
                      >
                        <button
                          type="button"
                          disabled={!selectedTime}
                          onClick={() => {
                            console.log(
                              "BOOK NOW",
                              {
                                theaterId: id,
                                movieId,
                                date: selectedDate,
                                time: selectedTime,
                              }
                            );
                          }}
                      className="
                        mt-11
                        w-full
                        rounded-md
                        border
                        border-[#1090DF]
                        bg-white
                        px-14
                        py-3
                        text-md
                        font-medium
                        text-[#1090DF]
                        transition-all
                        duration-200
                        hover:bg-[#1090DF]
                        hover:text-white
                      "
                    >
                      Book Now
                    </button>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      </section>
    </main>
  );
};

export default TheaterDetails;