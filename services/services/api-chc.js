import axios from "axios";
import { getStorage } from "../../utils/storage";
import { handlePageParams } from "../../utils/handleParams";

const qr = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QR_API_URL,
  timeout: 30000,
});

qr.interceptors.request.use(
    async (config) => {
      config.baseURL = await getBaseUrl();
      return config;
    },
    (error) => Promise.reject(error)
  );

  export async function getBaseUrl() {
    var value = window.location.hostname.includes("chc")
      ? process.env.NEXT_PUBLIC_CHC_API_URL
      : process.env.NEXT_PUBLIC_BASE_API_URL;
  
    return value;
  }

  const getProductByProcode = async (procode) => {
    return await qr.get(`/purchasing-neo/v1/products/${procode}`, {
      headers: {
        Authorization: `${getStorage("access_token")}`,
      },
    });
  };

  export default {
    getProductByProcode
  }

