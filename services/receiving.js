import axios from "axios";
import { getToken } from "../utils/token";
import { handlePageParams } from "../utils/handleParams";

const api1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

api1.interceptors.request.use(
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

const apiRecv = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/scm/v1/receivingpo",
  timeout: 10000,
});

apiRecv.interceptors.request.use(
  async (config) => {
    config.baseURL = await getReceiveURL();
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getReceiveURL() {
  var value = window.location.hostname.includes("chc")
    ? process.env.NEXT_PUBLIC_CHC_API_URL + "/scm/v1/receivingpo"
    : process.env.NEXT_PUBLIC_BASE_API_URL + "/scm/v1/receivingpo";

  return value;
}

const getReceivingHeader = async (
  group,
  pt,
  outcode,
  searchgroup,
  keyword,
  params
) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiRecv.get(
    `/viewpaginate?group=${group}&pt=${pt}&gudangid=${outcode}&searchby=${searchgroup}&search=${keyword}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

const getReceivingDetail = async (norecv, pt, outcode, group) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiRecv.get(
    `/viewprocess?norecv=${norecv}&pt=${pt}&gudangid=${outcode}&group=${group}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      // params,
    }
  );
};

// var url = `${myUrl1.url_detailPO}flag=N&group=${group}`;
const getDetailPO = async (flag, payload) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiRecv.post(`/set?flag=${flag}`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    // params,
  });
};

// https://staging-api.pharmalink.id/hr/karyawan?find=bynip&nip=070001U
const getKaryawan = async (nip) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await api1.get(`/hr/karyawan?find=bynip&nip=${nip}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    // params,
  });
};

const deleteBatchReceiving = async (payload) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiRecv.post(`/deletedetail?typedelete=batch`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    // params,
  });
};

// http://localhost:8080/scm/v1/receivingpo/print?pt=0&group=1&gudangid=B14&norecv=000000
const getReceivingPrint = async (pt, group, outcode, norecv) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiRecv.get(
    `/print?pt=${pt}&group=${group}&gudangid=${outcode}&norecv=${norecv}`,
    {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
      // params,
    }
  );
};

export default {
  getReceivingHeader,
  getReceivingDetail,
  getDetailPO,
  getKaryawan,
  deleteBatchReceiving,
  getReceivingPrint,
};
