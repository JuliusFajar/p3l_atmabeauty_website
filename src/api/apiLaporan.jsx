import useAxios from ".";

export const GetPerawatanTerlaris = async (value) => {
  try {
    // Kirim data bulan dan tahun sebagai query parameters menggunakan params
    const response = await useAxios.get("/perawatanTerlaris", {
      params: value, // Menggunakan params untuk query string
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

export const GetLaporanCustomerPerDokter = async (bulan, tahun) => {
  try {
    const response = await useAxios.get(`/customerPerDokter/${bulan}/${tahun}`, {
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

export const GetLaporanCustomer = async (year) => {
  try {
    const response = await useAxios.get(`/laporan-customer`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      params: { year },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// Fungsi untuk mendapatkan laporan pendapatan tahunan
export const GetLaporanPendapatan = async (year) => {
  try {
    const response = await useAxios.get(`/laporan-pendapatan`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      params: { year },
    });

    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const GetProdukTerlaris = async (value) => {
  try {
    // Kirim data bulan dan tahun sebagai query parameters menggunakan params
    const response = await useAxios.get("/produkTerlaris", {
      params: value, // Menggunakan params untuk query string
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
