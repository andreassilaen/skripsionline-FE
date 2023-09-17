import axios from "axios";
import { getStorage } from "../utils/storage";

const core = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const login = async (loginData) => {
  return await core.post("/auth/v2/login", null, {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(loginData.nip + ":" + loginData.password).toString(
          "base64"
        ),
    },
  });
};

const getAccessList = async (payload) => {
  return await core.post(`/auth/v2/access-list`, payload, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getUserPT = async (nip, params) => {
  return await core.get(`/core/v1/users/${nip}/pt`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getUserOutlet = async (nip, params) => {
  return await core.get(`/core/v1/users/${nip}/outlet`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getListProject = async () => {
  return await core.get(`/core/v1/project`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

// test ---------------------------------------------

const getListPT = async () => {
  return await core.get(`/core/v1/pt`, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

// const getListOutletByPT = async (pt) => {
//   return await api.get(`/core/v1/outlet?pt=${pt}`, {
//     headers: {
//       Authorization: `${getStorage("access_token")}`,
//     },
//   });
// };

export default {
  login,
  getAccessList,
  getUserPT,
  getUserOutlet,
  getListProject,

  getListPT,
};
