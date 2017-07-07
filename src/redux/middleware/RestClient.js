const methods = ['get', 'post', 'put', 'patch', 'del'];

export default class RestClient {
  constructor() {
    methods.forEach(method =>
      // Wrap the request(s) in a promise
      this[method] = (path, { data, headers: customHeaders = {} } = {}) => new Promise((resolve, reject) => {
        let headers = new Headers();
        headers = {
          ...customHeaders,
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31',
          'Accept-Language': 'en-US,en;q=0.8'
        };

        const request = () => fetch(path, {
          method,
          headers,
          body: data,
          credentials: 'include'
        });

        return request().then((response) => {
          if (response.ok) {
            return response.json()
              .then(resp => resolve(resp))
              .catch(message => message ? resolve({ status: response.status, statusText: message }) : resolve({}));
          } else {
            return reject({ status: response.status });
          }
        });
      }));
  }
}
