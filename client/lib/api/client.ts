import axios from "axios";


console.log(
  "BASE URL:",
  process.env.NEXT_PUBLIC_API_URL
);

const apiClient =
  axios.create({

    baseURL:
      process.env.NEXT_PUBLIC_API_URL,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

/*
 =====================================
 AUTO ATTACH JWT TOKEN
 =====================================
*/

apiClient.interceptors.request.use(

  (config) => {

    if (
      typeof window !==
      "undefined"
    ) {

      const token =
        localStorage.getItem(
          "token"
        );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  }
);

export default apiClient;