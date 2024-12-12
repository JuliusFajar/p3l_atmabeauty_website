import useAxios from ".";

export const GetAllCustomer = async () => {
    try {
        const response = await useAxios.get("/customer", {
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

export const GetCustomerByName = async (name) => {
  try {
    const response = await useAxios.get(`/searchByName/${name}`, {
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

// export const GetCustomerByName = async (name) => {
//   try {
//     const response = await useAxios.get(`/customer/search/${name}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//       },
//     });

//     return response.data.data;
//   } 
//   catch (error) {
//     throw error.response.data;
//   }
// }

// // apiDaftarCustomer.jsx
// export const GetCustomerByName = (name) => {
//   // Function logic
//   return fetch(`/api/customers?name=${name}`)
//     .then(response => response.json())
//     .catch(error => console.error('Error:', error));
// };


export const AddCustomer = async (data) => {
    try {
      const response = await useAxios.post("/customer", data, {
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

export const UpdateCustomer = async (values) => { 
    try { 
        const response = await useAxios.put(`/customer/${values.id_customer}`, values, { 
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

export const DeleteCustomer = async (id) => {
    try {
      const response = await useAxios.delete(`/customer/${id}`, {
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
  