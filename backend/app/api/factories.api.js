import axiosClient from "./axiosClient";

/* GET all factories */
export const getFactories = () =>
  axiosClient.get("/factories");

/* GET factory by ID */
export const getFactoryById = (id) =>
  axiosClient.get(`/factories/${id}`);

/* CREATE factory */
export const createFactory = (data) =>
  axiosClient.post("/factories", data);

/* UPDATE factory */
export const updateFactory = (id, data) =>
  axiosClient.put(`/factories/${id}`, data);

/* DELETE factory */
export const deleteFactory = (id) =>
  axiosClient.delete(`/factories/${id}`);
