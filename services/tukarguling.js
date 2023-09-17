import axios from "axios";
import { getToken } from "../utils/token";
import { handlePageParams } from "../utils/handleParams";

const apiTukarGuling = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + '/scm/v1/tukarguling',
  timeout: 10000,
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const local = axios.create({
  baseURL: 'http://localhost:8080/scm/v1/tukarguling',
  timeout: 10000,
});

apiTukarGuling.interceptors.request.use(
  async (config) => {
    config.baseURL = await getTukarGulingBaseUrl();
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getTukarGulingBaseUrl() {
  var value = window.location.hostname.includes("chc")
    ? process.env.NEXT_PUBLIC_CHC_API_URL + "/scm/v1/tukarguling"
    : process.env.NEXT_PUBLIC_BASE_API_URL + "/scm/v1/tukarguling";

  return value;
}

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

// http://localhost:8080/scm/v1/tukarguling/getheader?pt=14&outcode=b14&groupprod=1&exchangestatus=&keyword=&searchtype=&length=5&page=1
const getTukarGuling = async (pt, outcode, group, filter, keyword, searchtype, params) => {
    const token = await getToken("token");
    params = handlePageParams(params);
    return await apiTukarGuling.get(`/getheader?pt=${pt}&outcode=${outcode}&groupprod=${group}&exchangestatus=${filter}&keyword=${keyword}&searchtype=${searchtype}`, {
      headers: {
        // Authorization: `JWT ${token}`,
      },
      params,
    });
};

  // http://localhost:8080/scm/v1/tukarguling/getheaderdetail?pt=14&outcode=B14&exchangestatus=&supcode=&exchangeid=2B14220800011&groupprod=2
const getTukarGulingHeaderDetail = async (pt, outcode, status, supcode, exchangeid, group) => {
    const token = await getToken("token");
    return await apiTukarGuling.get(`/getheaderdetail?pt=${pt}&outcode=${outcode}&exchangestatus=${status}&supcode=${supcode}&exchangeid=${exchangeid}&groupprod=${group}`, {
      headers: {
        // Authorization: `JWT ${token}`,
      },
    });
};

// http://localhost:8080/scm/v1/tukarguling/getdetail?pt=14&exchangeid=0220800000001&length=5&page=1
const getTukarGulingDetail = async (pt, exchangeid, params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await apiTukarGuling.get(`/getdetail?pt=${pt}&exchangeid=${exchangeid}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    params,
  });
};

// http://localhost:8080/scm/v1/tukarguling/getprint
const printTukarGuling = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/getprint`, payload, {
    responseType: 'arraybuffer',
    headers: {
      'Accept': 'application/pdf'
    }
  });
};

// https://staging-api.pharmalink.id/purchasing-neo/v1/suppliers/getcompactsupplier?group=2
const getSupplier = async (group) => {
  const token = await getToken("token");
  return await api.get(`/purchasing-neo/v1/suppliers/getcompactsupplier?group=${group}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/insertheader
const insertHeaderTukarGuling = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/insertheader`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// https://staging-api.pharmalink.id/purchasing-neo/v1/products/suppliers?outcode=000&supcode=5803
const getProduct = async (outcode, supcode) => {
  const token = await getToken("token");
  return await api.get(`/purchasing-neo/v1/products/suppliers?outcode=${outcode}&supcode=${supcode}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// https://staging-api.pharmalink.id/scm/v1/inventory/stock/0100001/batch?pt=9&outcode=A63&batch=&page=1&length=10
const getBatch = async (pt, outcode, procode, batch, params) => {
  const token = await getToken("token");
  params = handlePageParams(params);
  return await api.get(`/scm/v1/inventory/stock/${procode}/batch?pt=${pt}&outcode=${outcode}&batch=${batch}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
    params
  });
};

// http://localhost:8080/scm/v1/tukarguling/getreasonlist
const getReasonList = async () => {
  const token = await getToken("token");
  return await apiTukarGuling.get(`/getreasonlist`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/getdetailbyprocod?pt=14&exchangeid=0220800000001&procod=1600001
const getInsertDetailData = async (pt, exchangeid, procod) => {
  const token = await getToken("token");
  return await apiTukarGuling.get(`/getdetailbyprocod?pt=${pt}&exchangeid=${exchangeid}&procod=${procod}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/insertdetail
const insertDetailTukarGuling = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/insertdetail`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/deletebatchdetail?procod=5140&exchangeid=1B14220800001&batch=TF2H&pt=14
const deleteBatchAdd = async (procod, exchangeid, batch, pt) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/deletebatchdetail?procod=${procod}&exchangeid=${exchangeid}&batch=${batch}&pt=${pt}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/getunprocess?groupprod=2&pt=14&outcode=b14
const checkUnprocess = async (group, pt, outcode) => {
  const token = await getToken("token");
  return await apiTukarGuling.get(`/getunprocess?groupprod=${group}&pt=${pt}&outcode=${outcode}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/autodeleteunprocess?outcode=B14&pt=14&groupprod=2
const autoDeleteUnprocess = async (outcode, pt, group) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/autodeleteunprocess?outcode=${outcode}&pt=${pt}&groupprod=${group}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/updateconfirm
const saveTukarGuling = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/updateconfirm`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/recv/gettemprecv?pt=14&exchangeid=pt=14&exchangeid=2B14220800030
const getTempReceive = async (pt, exchangeid) => {
  const token = await getToken("token");
  return await apiTukarGuling.get(`/recv/gettemprecv?pt=${pt}&exchangeid=${exchangeid}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/recv/gettemprecvbyprocod?pt=14&exchangeid=1B14220800015&procod=1600001
const getTempReceiveByProcod = async (pt, exchangeid, procod) => {
  const token = await getToken("token");
  return await apiTukarGuling.get(`/recv/gettemprecvbyprocod?pt=${pt}&exchangeid=${exchangeid}&procod=${procod}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/recv/receivedetailproduct
const saveReceiveTukarGuling = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/recv/receivedetailproduct`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/recv/deletebatchtemprecv?pt=112&procod=tes&exchangeid=21b1422100001&batch=3
const deleteBatchReceive = async (pt, procod, exchangeid, batch) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/recv/deletebatchtemprecv?pt=${pt}&procod=${procod}&exchangeid=${exchangeid}&batch=${batch}`, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

// http://localhost:8080/scm/v1/tukarguling/recv/confirmrecv
const confirmReceive = async (payload) => {
  const token = await getToken("token");
  return await apiTukarGuling.post(`/recv/confirmrecv`, payload, {
    headers: {
      // Authorization: `JWT ${token}`,
    },
  });
};

export default {
    getTukarGuling, getTukarGulingHeaderDetail, getTukarGulingDetail, printTukarGuling, getSupplier, insertHeaderTukarGuling, getProduct, getBatch, getReasonList, getInsertDetailData, insertDetailTukarGuling, deleteBatchAdd, checkUnprocess, autoDeleteUnprocess, saveTukarGuling, getTempReceive, getTempReceiveByProcod, saveReceiveTukarGuling, deleteBatchReceive, confirmReceive
};
