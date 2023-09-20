/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        options.callback(null, xhr.responseText);
      } else {
        options.callback(xhr.responseText, null);
      }
    });
  
try {
      if (options.method === "GET") {
      if (options.data) {
        const params = new URLSearchParams(options.data);
        options.url += `?${params.toString()}`;
      }
      xhr.open("GET", options.url);
      xhr.responseType = "json";
      xhr.send();
    }
  
    if (options.method !== "GET") {
      const formData = new FormData();
  
      for (const key in options.data) {
        if (options.data.hasOwnProperty(key)) {
          formData.append(key, options.data[key]);
        }
      }
  
      xhr.open("POST", options.url);
      xhr.responseType = "json";
      xhr.send(formData);
    }
  } catch(e) {
    options.callback(e)
  }
  };
  