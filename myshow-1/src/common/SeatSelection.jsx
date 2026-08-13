import React, { useState } from "react";

const SeatSelection = ({ isOpen, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState(0);

  if (!isOpen) {
    return null;
  }

  const seats = Array.from({ length: 10 }, (_, index) => index + 1);

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(seatNumber);
  };

  const handleClose = () => {
    setSelectedSeats(0);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedSeats < 1) {
      return;
    }

    onConfirm(selectedSeats);
    setSelectedSeats(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[1px] px-4">
      {/* Modal */}
      <div className="w-full max-w-md rounded-xl bg-white px-8 py-7 shadow-2xl">
        {/* Heading */}
        <h2 className="mb-10 text-center text-2xl font-bold text-[#0b8bd3]">
          How many seats?
        </h2>

        {/* Seat Numbers */}
        <div className="mx-auto grid max-w-[250px] grid-cols-5 gap-4">
          {seats.map((seatNumber) => {
            const isSelected = selectedSeats === seatNumber;

            return (
              <button
                key={seatNumber}
                type="button"
                onClick={() => handleSeatSelect(seatNumber)}
                className={`
                  flex h-10 w-10 items-center justify-center
                  rounded-md border text-sm
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#0b8bd3] bg-[#0b8bd3] text-white shadow-md"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#0b8bd3] hover:text-[#0b8bd3]"
                  }
                `}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedSeats < 1}
            onClick={handleConfirm}
            className={`
              rounded-md border px-5 py-2.5 text-sm font-medium
              transition
              ${
                selectedSeats >= 1
                  ? "border-[#0b8bd3] bg-white text-[#0b8bd3] hover:bg-[#0b8bd3] hover:text-white"
                  : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
              }
            `}
          >
            Select seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
