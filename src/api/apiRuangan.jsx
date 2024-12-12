import useAxios from ".";

export const GetAllRuangan = async () => {
    try {
        const response = await useAxios.get("/ruangan", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;;
    } 
    catch (error) {
        throw error.response.data;
    }
};

export const GetRuanganByNoRuangan = async (no_ruangan) => {
  try {
    const response = await useAxios.get(`/ruangan/search/${no_ruangan}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
      return response.data.data; 
  }
  catch (error) {
    throw error.response?.data;
  }
}


  
export const CreateRuangan = async (values) => {
    try {
        const response = await useAxios.post("/ruangan", values, {
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
}

export const UpdateRuangan = async (values) => {
    try {
        const response = await useAxios.put(`/ruangan/${values.id_ruangan}`, values, {
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
}


export const DeleteRuangan = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`/ruangan/${id}`, {
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
}

