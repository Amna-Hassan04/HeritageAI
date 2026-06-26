// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000",
// });

// export const curateImage = async (file) => {
  
//   const formData = new FormData();
//   formData.append("image", file);

//   const response = await api.post("/curate", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return response.data;
// };
/// src/api/curatorApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // backend URL
});

export const curateImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file); // "image" must match FastAPI param name

  // Do NOT manually set the Content-Type. Axios/browser will set it correctly.
  const response = await api.post("/curate", formData);
  return response.data;
};