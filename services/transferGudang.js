import axios from "axios";
import { handlePageParams } from "../utils/handleParams.js";
import { getStorage } from "../utils/storage";

const transferGudang = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    timeout: 10000
});

transferGudang.interceptors.request.use(
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

// Transfer Gudang

// Get List Data Gudang
const getListDataGudang = async (params) => {
    params = handlePageParams(params)
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    })
}

// Get Data Detail
const getDataDetail = async (params) => {
    // params = handlePageParams(params)
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    })
}

// Get List Product Transfer
const getListProductTransfer = async (params) => {
    // params = handlePageParams(params)
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    })
}

// Search No Receive
const searchNoReceive = async (params) => {
    // params = handlePageParams(params)
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    })
}

// Search List No Receive
const searchListNoReceive = async (params) => {
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    })
}

// Search List No Transfer
const searchListNoTransfer = async (params) => {
    return await transferGudang.get(`/transfer/tnin`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    });
};

// Generate No Receive
const searchListByDate = async (data, params) => {
    return await transferGudang.post(`/transfer/tnin?find=all&outcode=`, data, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    });
};

// Generate No Receive
const createNoReceive = async (data) => {
    return await transferGudang.post(`/transfer/tnin?insert=retur`, data, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
    });
};

// Add New Batch
const createNewBatch = async (data, params) => {
    return await transferGudang.post(`/transfer/tnin?insert=batch&NoTranrc=${params.NoTranrc}&TranrcDID=${params.TranrcDID}`, data, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
    });
};

// Edit Batch
const editBatch = async (data, params) => {
    return await transferGudang.put(`/transfer/tnin?NoTranrc=${params.NoTranrc}&TranrcDID=${params.TranrcDID}`, data, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
    });
};

// Delete Batch
const deleteBatch = async (params) => {
    return await transferGudang.delete(`/transfer/tnin?delete=ReceiveID&noRecv=${params.noRecv}&ptID=${params.ptID}`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
    });
};

// Print No Receive
const printNoReceive = async (params) => {
    return await transferGudang.get(`/transfer/tnin?`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    });
};

// Download PDF
const downloadPDF = async (params) => {
    return await transferGudang.get(`/transfer/tnin?`, {
        headers: {
            Authorization: `${getStorage("access_token")}`,
        },
        params,
    });
};

//

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // GET
    getListDataGudang,
    getListProductTransfer,
    getDataDetail,
    searchListNoReceive,
    searchNoReceive,
    searchListNoTransfer,
    printNoReceive,
    downloadPDF,

    // POST
    createNoReceive,
    createNewBatch,
    searchListByDate,

    // PUT
    editBatch,

    // DELETE
    deleteBatch,
}