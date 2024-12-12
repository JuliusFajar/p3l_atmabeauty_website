import useAxios from ".";

export const GetAllJadwal = async () => {
    try {
        const response = await useAxios.get("/jadwal", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error.response.data;
      }
};

export const AddJadwal = async (data) => {
    try {
      const response = await useAxios.post("/jadwal", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

export const UpdateJadwal = async (values) => { 
    try { 
        const response = await useAxios.put(`/jadwal/${values.id_jadwal}`, values, { 
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
            }, 
        }); 
        return response.data; 
    } catch (error) { 
        throw error.response.data; 
    } 
};

export const DeleteJadwal = async (id) => { 
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    
    try { 
        const response = await useAxios.delete(`/jadwal/${id}`, { 
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
            }, 
        }); 
        return response.data; 
    } catch (error) { 
        throw error.response.data; 
    } 
};
  