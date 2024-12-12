import React, { useEffect, useState } from "react";
import "./Produk.css"
import facial from "./assets/images/greenteafacial.jpg";
import laser from "./assets/images/laserCO2.jpg";
import botanical from "./assets/images/botanicalMesotherapy.jpg";
import { GetAllPerawatan } from "./api/apiPerawatan";

const Perawatan = () => {
  const [Perawatan, setPerawatans] = useState([]);
  const showPerawatan = () => {
    // setIsLoading(true);
    GetAllPerawatan()
      .then((response) => {
        setPerawatans(response);
        // setOriginalData(response);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setOriginalData(response);
        // setIsLoading(false);
      });
  };

  useEffect(() => {
    showPerawatan();
  }, []);
  
  return (
    <div>
      <h1 className="mt-5">Our Treatments</h1>
      <div className="product-container">
        {Perawatan.map((perawatan) => (
          <div key={perawatan.id} className="product-card">
            <img
              src={`http://127.0.0.1:8000/images/perawatan/${perawatan.gambar_perawatan}`}
              alt={perawatan.nama_perawatan}
              style={{ width: "15vw", height: "auto", borderRadius: "10px" }}
            />
            <h3>{perawatan.nama}</h3>
            <p>{perawatan.keterangan_perawatan}</p>
            <p>{perawatan.harga_perawatan}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Perawatan;
