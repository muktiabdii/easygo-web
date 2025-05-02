import React from "react";
import { useLocation } from "react-router-dom";
import NavbarBack from "../components/NavbarBack";

const PlaceDetail = () => {
  const location = useLocation();
  const placeName = location.state?.placeName || "Detail Tempat"; 

  return (
    <div>
      <NavbarBack title={placeName} />

      <div className="p-4">
        <h2 className="text-xl font-bold">{placeName}</h2>
        <p className="mt-2">This page is under development.</p>
      </div>
    </div>
  );
};

export default PlaceDetail;