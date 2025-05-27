import React from "react";

const Card = ({ name, email, phone }) => {
  return (
    <div className="card mt-2 h-100">
      <div className="card-body">
        <div className="row align-items-center">
          <span className="fw-bold col-4 text-end">Name:</span>
          <p className="card-title col-8 text-start mb-2">
            {name || "Nishu Singh"}
          </p>
          <span className="fw-bold col-4 text-end">Email:</span>
          <p className="card-text col-8 text-start mb-2">
            {email || "nishus@gmail.com"}
          </p>
          <span className="fw-bold col-4 text-end">Phone:</span>
          <p className="card-text col-8 text-start mb-0">
            {phone || "999992788"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
