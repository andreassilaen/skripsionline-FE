import axios from "axios";
import { getToken } from "../utils/token";
import { handlePageParams } from "../utils/handleParams";

const apiStock = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/scm/v1/inventory",
  timeout: 10000,
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VN_API_URL,
  timeout: 10000,
});

const apiPrint = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

apiStock.interceptors.request.use(
  async (config) => {
    config.baseURL = await getBaseUrl();
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getBaseUrl() {
  var value = window.location.hostname.includes("chc")
    ? process.env.NEXT_PUBLIC_CHC_API_URL + "/scm/v1/inventory"
    : process.env.NEXT_PUBLIC_BASE_API_URL + "/scm/v1/inventory";

  return value;
}

// https://staging-api.pharmalink.id/scm/v1/inventory/stock?pt=0&outcode=B14&procode=&page=1&length=10&sort=asc
const getStockHeaderPagination = async (pt, outcode, procod, sort, params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  console.log(apiStock.defaults.baseURL)
  return await apiStock.get(
    `/stock?pt=${pt}&outcode=${outcode}&procode=${procod}&sort=${sort}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// https://staging-api.pharmalink.id/scm/v1/inventory/stock/1600001/batch?pt=0&outcode=B14&batch=&page=1&length=10
const getStockDetailBatch = async (procod, pt, outcode, batch, params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/stock/${procod}/batch?pt=${pt}&outcode=${outcode}&batch=${batch}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// https://staging-api.pharmalink.id/scm/v1/inventory/mutasi?pt=0&outcode=B14&procode=&page=1&length=10&group=0&startDate=2022-01-01&endDate=2022-12-31&noref=&type=Revisi
const getMutasiStockProcod = async (
  pt,
  outcode,
  procod,
  group,
  startdate,
  enddate,
  noref,
  type,
  params
) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/mutasi?pt=${pt}&outcode=${outcode}&procode=${procod}&group=${group}&startDate=${startdate}&endDate=${enddate}&noref=${noref}&type=${type}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// https://staging-api.pharmalink.id/scm/v1/inventory/mutasi/1600001/batch?pt=0&outcode=B14&batch=&page=1&length=4&startDate=2022-01-01&endDate=2022-12-31
const getMutasiStockDetail = async (
  procod,
  pt,
  outcode,
  batch,
  group,
  startdate,
  enddate,
  params
) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/mutasi/${procod}/batch?pt=${pt}&outcode=${outcode}&batch=${batch}&startDate=${startdate}&endDate=${enddate}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// https://staging-api.pharmalink.id/scm/v1/inventory/formula/project-outlet?pt=0&outcode=B14&page=1&length=5
const getFormulaStock = async (pt, outcode, params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/formula/project-outlet?pt=${pt}&outcode=${outcode}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// http://localhost:8080/scm/v1/inventory/getpilihapp?page=2&length=1
const getPilihApp = async (params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(`/getpilihapp?`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    params,
  });
};

// https://staging-api.pharmalink.id/scm/v1/inventory/stock/mapped?outcode=B14&pt=0&length=10&page=1&ptapp=0&projectapp=1&outcodeapp=000
// /scm/v1/inventory/stock/mapped?ptapp=14&projectapp=7&outcodeapp=000&pt=14&outcode=b14&procode=&page=0&length=0&sort=
const getMappedStock = async (
  ptapp,
  projectapp,
  outcodeapp,
  pt,
  outcode,
  procode,
  sort,
  params
) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/stock/mapped?ptapp=${ptapp}&projectapp=${projectapp}&outcodeapp=${outcodeapp}&pt=${pt}&outcode=${outcode}&procode=${procode}&sort=${sort}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

// https://staging-api.pharmalink.id/scm/v1/packing-list/B472301M6000001?pt=3&outcode=B47
const getHeaderDO = async (notransf, pt, outcode) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiPrint.get(
    `/scm/v1/packing-list/${notransf}?pt=${pt}&outcode=${outcode}`,
    {
      // headers: {
      //   // Authorization: `JWT ${token}`,
      // },
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
      // params,
    }
  );
};

// https://staging-api.pharmalink.id/transfer/tnin?printNoRecv=R22051845&ptID=9
const printTnIN = async (norecv, pt) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiPrint.get(`/transfer/tnin?printNoRecv=${norecv}&ptID=${pt}`, {
    // headers: {
    //   // Authorization: `JWT ${token}`,
    // },
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf",
    },
    // params,
  });
};

// https://staging-api.pharmalink.id/scm/v1/inventory/stock/batch/revisi
const updateBatch = async (payload) => {
  const token = await getToken("token");
  // params = handlePageParams(params);
  return await apiStock.put(`/stock/batch/revisi `, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    // params,
  });
};

// https://staging-api.pharmalink.id/scm/v1/inventory/mutasi/book?pt=9&outcode=A63&procode=&page=1&length=10&group=0&startDate=2022-10-31&endDate=2022-11-01&noref=&type=
const getMutasiBookStockProcod = async (
  pt,
  outcode,
  procod,
  group,
  startdate,
  enddate,
  noref,
  type,
  params
) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiStock.get(
    `/mutasi/book?pt=${pt}&outcode=${outcode}&procode=${procod}&group=${group}&startDate=${startdate}&endDate=${enddate}&noref=${noref}&type=${type}`,
    {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    }
  );
};

export default {
  getStockHeaderPagination,
  getStockDetailBatch,
  getMutasiStockProcod,
  getMutasiStockDetail,
  getFormulaStock,
  getMappedStock,
  getHeaderDO,
  printTnIN,
  updateBatch,
  getMutasiBookStockProcod,
  getPilihApp,
};
