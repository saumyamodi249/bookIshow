import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheaters } from "../js/Theater";

const Theater = () => {
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTheaters();

        // Handles both:
        // [ ...theaters ]
        // { data: [ ...theaters ] }
        setTheaters(data?.data || data || []);
      } catch (err) {
        console.error("Error fetching theaters:", err);
        setError("Unable to load theaters.");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  const handleTheaterClick = (theaterId) => {
    if (!theaterId) {
      console.error("Theater ID is missing");
      return;
    }

    navigate(`/theaters/${theaterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-8">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-600 mb-8">
          Now Showing
        </h1>

        {/* Movie / Theater Tabs */}
        <div className="flex items-center gap-5 mb-10">

          {/* Movie */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="
              w-[140px]
              h-[60px]
              bg-white
              text-gray-900
              rounded-xl
              font-bold
              text-lg
              shadow-sm
              hover:shadow-md
              transition
              cursor-pointer
            "
          >
            Movie
          </button>

          {/* Theater */}
          <button
            type="button"
            className="
              w-[160px]
              h-[60px]
              bg-blue-500
              text-white
              rounded-xl
              font-bold
              text-lg
              shadow-sm
              cursor-default
            "
          >
            Theater
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="
                w-10
                h-10
                border-4
                border-sky-200
                border-t-blue-500
                rounded-full
                animate-spin
                mb-4
              "
            ></div>

            <p className="text-gray-500 text-sm">
              Loading theaters...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex justify-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-6 text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>

              <p className="text-sm text-gray-500">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* No theaters */}
        {!loading && !error && theaters.length === 0 && (
          <div className="flex justify-center py-20">
            <div className="bg-white rounded-xl border border-gray-200 px-8 py-6 text-center">
              <p className="text-gray-500">
                No theaters found.
              </p>
            </div>
          </div>
        )}

        {/* Theater List */}
        {!loading && !error && theaters.length > 0 && (
          <div className="flex flex-col gap-2.5">

            {theaters.map((theater, index) => {

              const theaterId =
                theater.id ||
                theater.theaterId ||
                theater._id;

              const theaterName =
                theater.name ||
                theater.theaterName ||
                `Theater ${index + 1}`;

              const theaterLocation =
                theater.address ||
                theater.location ||
                theater.city ||
                theater.area ||
                "Location unavailable";

              return (
                <div
                  key={theaterId || index}
                  onClick={() => handleTheaterClick(theaterId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleTheaterClick(theaterId);
                    }
                  }}
                  className="
                    group
                    relative
                    w-full
                    min-h-[84px]
                    bg-white/70
                    border
                    border-gray-200
                    rounded-lg
                    px-4
                    py-3
                    cursor-pointer
                    hover:bg-white
                    hover:border-sky-300
                    hover:shadow-sm
                    transition-all
                    duration-200
                    select-none
                  "
                >

                  {/* Theater Name */}
                  <div className="flex items-center justify-between">

                    <h2
                      className="
                        text-sky-600
                        font-semibold
                        text-lg
                        group-hover:text-sky-700
                        transition
                      "
                    >
                      {theaterName}
                    </h2>

                    {/* Arrow */}
                    <span
                      className="
                        text-sky-500
                        text-xl
                        pr-1
                        group-hover:translate-x-1
                        transition-transform
                      "
                    >
                      ›
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mt-3">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4 text-gray-500 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                      />

                      <circle
                        cx="12"
                        cy="9"
                        r="2.2"
                      />
                    </svg>

                    <p className="text-sm text-gray-500 truncate">
                      {theaterLocation}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default Theater;