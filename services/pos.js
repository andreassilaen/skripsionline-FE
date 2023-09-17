import axios from "axios";
import { getStorage } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const stockPrint = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CFU_API_URL,
  timeout: 10000,
});

// const finance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
//   timeout: 10000,
// });

api.interceptors.request.use(
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

const getHistoryTransactions = async (params) => {
  return await api.get(`/scm/v2/sales/getlastsales`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getProductByProcode = async (params) => {
  return await api.get(`/scm/v2/sales/scanproduct`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getProductByBarcode = async (params) => {
  return await api.get(`/scm/v2/sales/scanproduct`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getPaymentType = async (gudangID) => {
  // return await finance.get(
  //   `/finance/v1/master/payments?outcode=${gudangID}`,
  //   {}
  // );

  return await api.get(
    `/finance/v1/master/payments?outcode=${gudangID}`,
    {}
  );
};

const findHistoryTransactions = async (params) => {
  return await api.get(`/scm/v2/sales/getsalesbytrannonew`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const insertTransaction = async (body) => {
  return await api.post(`/scm/v2/sales/insertsalesnew`, body, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const insertRefund = async (body) => {
  return await api.post(`/scm/v2/sales/insertrefund`, body);
};

const printHistoryStruk = async (PTID, gudangID, strookNumber) => {
  return await api.get(
    `/scm/v2/sales/generatestruknew?ptid=${PTID}&outcode=${gudangID}&trannum=${strookNumber}`,
    {
      headers: {
        "Content-Type": "application/pdf",
      },
      responseType: "blob",
    }
  );
};

const getLast200DataSales = async (params) => {
  return await api.get(`/scm/v2/sales/getlast200datasalesnew`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getByCategory = async (params) => {
  return await api.get(`/scm/v2/sales/getdatarefund`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getReason = async () => {
  return await stockPrint.get(`/bridging-internal/cfu10?type=getreason`);
};

export default {
  getHistoryTransactions,
  getProductByProcode,
  getPaymentType,
  getProductByBarcode,
  findHistoryTransactions,
  insertTransaction,
  printHistoryStruk,
  getLast200DataSales,
  getByCategory,
  getReason,
  insertRefund,
};
