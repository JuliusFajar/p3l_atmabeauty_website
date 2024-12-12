import React, { useEffect, useState } from "react";
import "./Produk.css"
import facial from "./assets/images/greenteafacial.jpg";
import laser from "./assets/images/laserCO2.jpg";
import botanical from "./assets/images/botanicalMesotherapy.jpg";
import { GetAllProduk } from "./api/apiProduk";

const Produk = () => {
  const [Produk, setProduks] = useState([]);
  const showProduk = () => {
    // setIsLoading(true);
    GetAllProduk()
      .then((response) => {
        setProduks(response);
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
    showProduk();
  }, []);
  
  return (
    <div>
      <h1 className="mt-5">Our Product</h1>
      <div className="product-container">
        {Produk.map((produk) => (
          <div key={produk.id} className="product-card">
            <img
              src={`http://127.0.0.1:8000/images/produk/${produk.gambar_produk}`}
              alt={produk.nama_produk}
              style={{ width: "15vw", height: "auto", borderRadius: "10px" }}
            />
            <h3>{produk.nama_produk}</h3>
            <p>{produk.keterangan_produk}</p>
            <p>{produk.harga_produk}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produk;
