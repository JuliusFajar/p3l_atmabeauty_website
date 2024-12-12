import useAxios from ".";

export const CreateTransaksi = async (values) => {
    try {
        const response = await useAxios.post("/transaksi", values, {
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

export const showAntrianDokter = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi/showAntrianDokter/${id}`, {
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

export const showRiwayatCustomer = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi/showRiwayatCustomer/${id}`, {
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

export const showDetailTransaksi = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi/${id}`, {
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

export const showPegawai = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi/showPegawai/${id}`, {
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

export const showCustomer = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi/showCustomer/${id}`, {
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

export const TransaksiBelumBayar = async () => {
    try {
        const response = await useAxios.get("/transaksiBelumBayar", {
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

export const BayarTransaksi = async (values) => { 
    try { 
        const response = await useAxios.put(`/transaksi/bayarTransaksi/${values.id_transaksi}`, values, { 
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

export const InputDataPemeriksaan = async (values) => { 
    try { 
        const response = await useAxios.patch(`/transaksi/inputDataPemeriksaan/${values.id_transaksi}`, values, { 
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

export const InputProduk = async (values) => {
    try {
        const response = await useAxios.post("/transaksi/inputProduk", values, {
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

export const InputPerawatan = async (values) => {
    try {
        const response = await useAxios.post("/transaksi/inputPerawatan", values, {
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