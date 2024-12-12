import useAxios from ".";

export const GetAllPromo = async () => {
    try {
        const response = await useAxios.get("/promo", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error.response.data;
      }
}


export const CreatePromo = async (values) => {
    try {
        const response = await useAxios.post("/promo", values, {
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

export const UpdatePromo = async (values) => { 
    try { 
        const response = await useAxios.put(`/promo/${values.id_promo}`, values, { 
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


export const DeletePromo = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await useAxios.delete(`/promo/${id}`, {
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
