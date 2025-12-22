
import React from 'react';
import { FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';

const Card = ({ data, onDetailsClick }) => {
  const {
    jobTitle,
    jobLocation,
    minPrice,
    maxPrice,
    postingDate,
    description,
  } = data;

  return (
    <section className="card" onClick={() => onDetailsClick(data)}>
      <div className="card-details">
        <h3 className="card-title">{jobTitle}</h3>
        <div className="card-meta">
          <span className="flex items-center gap-2">
            <FiMapPin /> {jobLocation}
          </span>
          <span className="flex items-center gap-2">
            <FiCalendar /> {postingDate}
          </span>
          <span className="flex items-center gap-2">
            <FiDollarSign /> {minPrice}-{maxPrice} ngày
          </span>
        </div>
        <p className="text-base text-primary/70">{description.length > 150 ? `${description.substring(0, 150)}...` : description}</p>
        <button className="text-blue-500 hover:underline mt-2">
          Xem chi tiết
        </button>
      </div>
    </section>
  );
};

export default Card;
