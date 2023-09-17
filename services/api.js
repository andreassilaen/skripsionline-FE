import axios from "axios";
import { getStorage } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 30000,
});

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

const getListEkspedisi = async () => {
  return await api.get("/scm/v1/ekspedisi", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getListEkspedisiPrice = async (params) => {
  return await api.get(`/scm/v1/ekspedisi/${params.code}/price`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getDataEkspedisi = async (params) => {
  return await api.get(`/scm/v1/ekspedisi?kode=${params.code}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const searchEkspedisi = async (params) => {
  return await api.get(`/scm/v1/ekspedisi?search=${params}`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const createEkspedisi = async (payload) => {
  return await api.post("/scm/v1/ekspedisi", payload, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const createEkspedisiPrice = async (params, payload) => {
  return await api.post(`/scm/v1/ekspedisi/${params.code}/price`, payload, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getListContainer = async (payload) => {
  const token = await getToken("token");
  return await api.get("/scm/v1/container", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getContainerByDescOrID = async (inputSearch) => {
  const token = await getToken("token");
  return await api.get(`/scm/v1/container?search=${inputSearch}`, inputSearch, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const createContainer = async (payload) => {
  const token = await getToken("token");
  return await api.post("/scm/v1/container", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const updateContainer = async (payload) => {
  const token = await getToken("token");
  return await api.put("/scm/v1/container/15", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getListDistributor = async (payload) => {
  const token = await getToken("token");
  return await api.get("/scm/v1/distributor", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getDistributorByNameOrDistCode = async (inputSearch) => {
  const token = await getToken("token");
  return await api.get(
    `/scm/v1/distributor?search=${inputSearch}`,
    inputSearch,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
};

const createDistributor = async (payload) => {
  const token = await getToken("token");
  return await api.post("/scm/v1/distributor", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const updateDistributor = async (payload) => {
  const token = await getToken("token");
  return await api.put("/scm/v1/distributor/47", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

//url untuk header detail cbng distributor
const getDistributorByDistCode = async (params) => {
  const token = await getToken("token");
  return await api.get(`/scm/v1/distributor`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const getCabangDistributor = async (params, distributor_code) => {
  const token = await getToken("token");
  return await api.get(`/scm/v1/distributor/${distributor_code}/cabang`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const createCabangDistributor = async (params, dist_code) => {
  const token = await getToken("token");
  return await api.post(`/scm/v1/distributor/${dist_code}/cabang`, params, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const updateCabangDistributor = async (payload) => {
  const token = await getToken("token");
  return await api.put("/scm/v1/distributor/1/cabang", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

export default {
  getListContainer,
  getContainerByDescOrID,
  createContainer,
  updateContainer,

  getListDistributor,
  getDistributorByNameOrDistCode,
  createDistributor,
  updateDistributor,

  getDistributorByDistCode,
  getCabangDistributor,
  createCabangDistributor,
  updateCabangDistributor,

  getListEkspedisi,
  getListEkspedisiPrice,
  getDataEkspedisi,
  searchEkspedisi,
  createEkspedisi,
  createEkspedisiPrice,
};
