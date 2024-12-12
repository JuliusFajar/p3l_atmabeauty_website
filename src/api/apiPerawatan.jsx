import useAxios from ".";

export const GetAllPerawatan = async () => {
    try {
        const response = await useAxios.get("/perawatan", {
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
}

export const GetPewawatanByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/perawatan/search/${nama}`, { 
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

export const CreatePerawatan = async (values) => {
    try {
        const formData = new FormData();
        formData.append("nama_perawatan", values.nama_perawatan);
        formData.append("keterangan_perawatan", values.keterangan_perawatan);
        formData.append("syarat_perawatan", values.syarat_perawatan);
        formData.append("harga_perawatan", values.harga_perawatan);
        
        if (values.gambar_perawatan) {
            formData.append("gambar_perawatan", values.gambar_perawatan);
        }

        const response = await useAxios.post("/perawatan", formData, {
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

export const UpdatePerawatan = async (values) => {
  try {
    const formData = new FormData();

    formData.append("nama_perawatan", values.nama_perawatan);
    formData.append("keterangan_perawatan", values.keterangan_perawatan);
    formData.append("syarat_perawatan", values.syarat_perawatan);
    formData.append("harga_perawatan", values.harga_perawatan);

    if (values.gambar_perawatan) {
      formData.append("gambar_perawatan", values.gambar_perawatan);
    }

    const response = await useAxios.post(
      `/perawatan/${values.id_perawatan}`,
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




export const DeletePerawatan = async (id) => { 
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    
    try { 
        const response = await useAxios.delete(`/perawatan/${id}`, { 
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

