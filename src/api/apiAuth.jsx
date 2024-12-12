import useAxios from ".";

const Login = async (data) => {
    try{
        const response = await useAxios.post("/login", data);
        return response.data;
    }catch (error){
        throw error.response.data;
    }
};

export { Login };