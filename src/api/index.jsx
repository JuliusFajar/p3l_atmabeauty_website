import axios from "axios";

export const BASE_URL = 'https://atmabueatyapi.site'; // Proxy akan mengarahkan permintaan ke backend


export const getThumbnail = (thumbnail) => {
    return `${BASE_URL}/storage/contents/${thumbnail}`;
}

const useAxios = axios.create({
    baseURL: `${BASE_URL}/Api`,
});

export default useAxios;
