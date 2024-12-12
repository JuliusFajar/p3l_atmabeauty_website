import useAxios from ".";

export const GetAllProduk = async () => {
    try {
        const response = await useAxios.get("/produk", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } 
    catch (error) {
        throw error.response.data;
    }
};

export const GetProdukByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/produk/search/${nama}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        return response.data.data; 
    } 
    catch (error) {
        throw error.response.data; 
    }
};

export const CreateProduk = async (values) => {
  try {
    const formData = new FormData();
    formData.append("nama_produk", values.nama_produk);
    formData.append("keterangan_produk", values.keterangan_produk);
    formData.append("stock_produk", values.stock_produk);
    formData.append("harga_produk", values.harga_produk);

    if (values.gambar_produk) {
      formData.append("gambar_produk", values.gambar_produk);
    }

    const response = await useAxios.post("/produk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const UpdateProduk = async (values) => {
  try {
    const formData = new FormData();

    formData.append("nama_produk", values.nama_produk);
    formData.append("keterangan_produk", values.keterangan_produk);
    formData.append("stock_produk", values.stock_produk);
    formData.append("harga_produk", values.harga_produk);

    if (values.gambar_produk) {
      formData.append("gambar_produk", values.gambar_produk);
    }

    const response = await useAxios.post(
      `/produk/${values.id_produk}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const DeleteProduk = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`/produk/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } 
    catch (error) {
        throw error.response.data;
    }
};
