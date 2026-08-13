import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { getMovieDetails } from "../js/MovieDetails";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --------------------------------------------------
  // MOVIE DATA
  // --------------------------------------------------

  const [movie, setMovie] = useState(null);

  // --------------------------------------------------
  // LOADING / ERROR
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // SELECTED OPTIONS
  // --------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTheater, setSelectedTheater] = useState(null);

  // DEFAULT TIME = 16:40 PM
  const [selectedTime, setSelectedTime] = useState("16:40 PM");

  // --------------------------------------------------
  // SEAT SELECTION
  // --------------------------------------------------

  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // --------------------------------------------------
  // FETCH MOVIE DETAILS
  // --------------------------------------------------

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieDetails(id);

        setMovie(data);

        if (data?.theaters?.length > 0) {
          setSelectedTheater(data.theaters[0]);
        }
      } catch (err) {
        console.error("Movie Details API Error:", err);
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // --------------------------------------------------
  // NEXT 7 DAYS
  // --------------------------------------------------

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const dates = getNextSevenDays();

  // --------------------------------------------------
  // TIME OPTIONS
  // --------------------------------------------------

  const times = ["16:40 PM", "18:40 PM", "21:25 PM", "23:20 PM"];

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  // --------------------------------------------------
  // FORMAT DAY
  // --------------------------------------------------

  const formatDay = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  // --------------------------------------------------
  // FULL DATE
  // --------------------------------------------------

  const formatFullDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // BOOK NOW
  // --------------------------------------------------

  const handleBookNow = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!selectedTheater) {
      alert("Please select a theater");
      return;
    }

    if (!selectedTime) {
      alert("Please select a time");
      return;
    }

    // Open seat modal
    setSelectedSeats([]);
    setSeatModalOpen(true);
  };

  // --------------------------------------------------
  // CONFIRM SEAT
  // --------------------------------------------------

  const handleConfirmSeats = () => {
    if (selectedSeats.length !== 1) {
      alert("Please select exactly 1 seat.");
      return;
    }

    console.log("Movie:", movie);
    console.log("Theater:", selectedTheater);
    console.log("Date:", selectedDate);
    console.log("Time:", selectedTime);
    console.log("Selected Seat:", selectedSeats[0]);

    setSeatModalOpen(false);

    navigate("/book-now", {
      state: {
        movie,
        date: selectedDate,
        theater: selectedTheater,
        time: selectedTime,
        seats: selectedSeats,
        seatCount: 1,
      },
    });
  };

  // --------------------------------------------------
  // CLOSE SEAT MODAL
  // --------------------------------------------------

  const handleCloseSeatModal = () => {
    setSeatModalOpen(false);
    setSelectedSeats([]);
  };

  // --------------------------------------------------
  // BACKGROUND
  // --------------------------------------------------

  const pageBackground = `
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
  `;

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main
        className="h-screen overflow-y-auto hide-scrollbar"
        style={{ background: pageBackground }}
      >
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-500">Loading movie details...</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main
        className="h-screen overflow-y-auto hide-scrollbar"
        style={{ background: pageBackground }}
      >
        <Navbar />

        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <p className="mb-4 text-red-500">{error}</p>

          <button
            onClick={() => navigate("/home")}
            className="rounded-lg bg-[#1090DF] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <main
      className="relative h-screen overflow-y-auto hide-scrollbar"
      style={{
        background: pageBackground,
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <section className="px-6 pb-12 pt-5">
        <div className="mx-auto max-w-7xl">

          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="
              mb-5
              text-sm
              text-gray-400
              transition
              hover:text-[#1090DF]
            "
          >
            ← Back
          </button>

          {/* LEFT + RIGHT */}
          <div
            className="
              grid
              grid-cols-1
              gap-8
              lg:grid-cols-[1.1fr_0.9fr]
            "
          >

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="mt-3 -translate-y-2 justify-start">

              {/* DATE */}

              <h2
                className="
                  mb-5
                  text-2xl
                  font-bold
                "
                style={{ color: "#1090DF" }}
              >
                Date
              </h2>

              {/* ALL 7 DATES */}

              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
                {dates.map((date, index) => {
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`
                        flex
                        h-[72px]
                        w-[82px]
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-lg
                        border
                        text-sm
                        transition-all
                        duration-200

                        ${
                          isSelected
                            ? "border-[#1090DF] bg-[#1090DF] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#1090DF]"
                        }
                      `}
                    >
                      <span className="font-medium">
                        {formatDate(date)}
                      </span>

                      <span className="mt-1 font-bold">
                        {formatDay(date)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ==================================================
                  THEATER
              ================================================== */}

              <h2
                className="
                  mb-5
                  mt-8
                  text-2xl
                  font-bold
                "
                style={{ color: "#1090DF" }}
              >
                Theater
              </h2>

              <div className="flex flex-wrap gap-3">
                {movie?.theaters?.length > 0 ? (
                  movie.theaters.map((theater) => {
                    const isSelected =
                      selectedTheater?.id === theater.id;

                    return (
                      <button
                        key={theater.id}
                        type="button"
                        onClick={() => setSelectedTheater(theater)}
                        className={`
                          rounded-lg
                          border
                          px-5
                          py-3
                          text-sm
                          transition-all
                          duration-200

                          ${
                            isSelected
                              ? "border-[#1090DF] bg-[#1090DF] text-white"
                              : "border-gray-300 bg-white text-gray-600 hover:border-[#1090DF] hover:text-[#1090DF]"
                          }
                        `}
                      >
                        <span className="mr-1">◉</span>

                        {theater.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    No theaters available.
                  </p>
                )}
              </div>

              {/* ==================================================
                  TIME
              ================================================== */}

              <h2
                className="
                  mb-5
                  mt-8
                  text-2xl
                  font-bold
                "
                style={{ color: "#1090DF" }}
              >
                Time
              </h2>

              <div className="flex flex-wrap gap-3">
                {times.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`
                        rounded-lg
                        border
                        px-6
                        py-3
                        text-sm
                        transition-all
                        duration-200

                        ${
                          isSelected
                            ? "border-[#1090DF] bg-[#1090DF] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#1090DF] hover:text-[#1090DF]"
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="w-full">

              {/* MOVIE IMAGE */}

              <div className="mb-5 flex -translate-x-24 -translate-y-12 justify-end">
                <img
                  src={movie?.image}
                  alt={movie?.name}
                  className="
                    h-[320px]
                    w-[320px]
                    rounded-xl
                    object-cover
                    shadow-md
                  "
                />
              </div>

              {/* CONTENT */}

              <div className="flex -translate-x-24 -translate-y-12 justify-end">
                <div className="w-[320px] max-w-full">

                  {/* MOVIE NAME */}

                  <h1
                    className="
                      w-full
                      break-words
                      text-2xl
                      font-bold
                      uppercase
                      leading-tight
                    "
                    style={{
                      color: "#1090DF",
                    }}
                  >
                    {movie?.name}
                  </h1>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      mt-3
                      w-full
                      break-words
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >
                    {movie?.description}
                  </p>

                  {/* MOVIE INFORMATION */}

                  <div
                    className="
                      mt-4
                      w-full
                      space-y-2
                      text-sm
                    "
                  >

                    {/* Duration */}

                    <div className="flex w-full">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Duration
                      </span>

                      <span className="break-words font-medium text-gray-800">
                        {movie?.duration} min
                      </span>
                    </div>

                    {/* Language */}

                    <div className="flex w-full">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Language
                      </span>

                      <span className="break-words font-medium text-gray-800">
                        {movie?.languages?.join(", ")}
                      </span>
                    </div>

                    {/* Type */}

                    <div className="flex w-full">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Type
                      </span>

                      <span className="font-medium text-gray-800">
                        2D
                      </span>
                    </div>
                  </div>

                  {/* ==================================================
                      BOOKING CARD
                  ================================================== */}

                  <div
                    className="
                      mt-6
                      min-h-[250px]
                      w-full
                      rounded-xl
                      border
                      border-[#1090DF]
                      bg-white/80
                      p-10
                    "
                  >

                    {/* SELECTED THEATER */}

                    {selectedTheater && (
                      <h2
                        className="
                          overflow-hidden
                          text-2xl
                          font-bold
                          leading-tight
                          whitespace-nowrap
                          text-ellipsis
                        "
                        style={{ color: "#1090DF" }}
                        title={selectedTheater.name}
                      >
                        {selectedTheater.name}
                      </h2>
                    )}

                    {/* DATE */}

                    <p className="mt-4 text-base text-gray-600">
                      {formatFullDate(selectedDate)}
                    </p>

                    {/* TIME */}

                    <p className="mt-1 text-base text-gray-600">
                      {selectedTime || "Select a time"}
                    </p>

                    {/* NOTE */}

                    <p className="mt-4 text-xs text-gray-500">
                      *Select your seat before booking
                    </p>

                    {/* BOOK NOW */}

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="
                        mt-5
                        w-full
                        rounded-md
                        border
                        border-[#1090DF]
                        bg-white
                        py-3
                        text-sm
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
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          SEAT SELECTION MODAL
      ========================================================== */}

      {seatModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/30
            px-4
            backdrop-blur-[1px]
          "
          onClick={handleCloseSeatModal}
        >

          {/* MODAL */}

          <div
            className="
              w-full
              max-w-[400px]
              rounded-2xl
              bg-white
              p-7
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >

            {/* TITLE */}

            <h2
              className="text-center text-2xl font-bold"
              style={{ color: "#1090DF" }}
            >
              How many seats?
            </h2>

            {/* SMALL DESCRIPTION */}

            <p className="mt-2 text-center text-sm text-gray-500">
              Select exactly one seat
            </p>

            {/* ==================================================
                SEAT NUMBERS
            ================================================== */}

            <div className="mt-7 grid grid-cols-5 justify-items-center gap-3">
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (seatNumber) => {
                  const isSelected =
                    selectedSeats.includes(seatNumber);

                  return (
                    <button
                      key={seatNumber}
                      type="button"

                      // ONLY ONE SEAT
                      onClick={() => {
                        setSelectedSeats([seatNumber]);
                      }}

                      className={`
                        flex
                        h-[48px]
                        w-[48px]
                        items-center
                        justify-center
                        rounded-md
                        border
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          isSelected
                            ? "border-[#1090DF] bg-[#1090DF] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#1090DF] hover:bg-[#C2E8FF] hover:text-[#1090DF]"
                        }
                      `}
                    >
                      {seatNumber}
                    </button>
                  );
                }
              )}
            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="mt-7 flex justify-center gap-3">

              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCloseSeatModal}
                className="
                  min-w-[100px]
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>

              {/* SELECT SEAT */}

              <button
                type="button"
                onClick={handleConfirmSeats}
                disabled={selectedSeats.length !== 1}
                className={`
                  min-w-[120px]
                  rounded-md
                  border
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  transition

                  ${
                    selectedSeats.length !== 1
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                      : "border-[#1090DF] bg-white text-[#1090DF] hover:bg-[#1090DF] hover:text-white"
                  }
                `}
              >
                Select seat
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MovieDetails;