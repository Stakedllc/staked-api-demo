# Reporting API Demo

This repo showcases how to use reporting api for a number of cryptocurrencies supported by Staked. 

For more information, check out our documentation: https://staked.gitbook.io/staked/services/reporting-api

#### You can hit the /reports endpoint in your web app:

To recieve the balance of an address that has staked with us:

React with Axios
```javacript
import axios from "axios";

const api_key = 'YOUR API KEY';
const chain = 'CHAIN NAME';
const address = 'DELEGATOR ADDRESS';

var api = axios.create({
  baseURL: "http://testnet.staked.cloud/api",
  timeout: 1000000
});

api.defaults.headers.post["Content-Type"] = "application/json";

api.get(`/reports/${chain}/delegator/${address}/balance?api_key=${api_key}`).then(response => {
  console.log(res);
})
```


jQuery
```jquery
const api_key = 'YOUR API KEY';
const chain = 'CHAIN NAME';
const address = 'DELEGATOR ADDRESS';

var request = {
  "url": `http://testnet.staked.cloud/api/reports/${chain}/delegator/${address}/balance?api_key=${api_key}`,
  "method": "GET",
  "timeout": 0,
};

$.ajax(request).done(function (response) {
  console.log(response);
});
```

To recieve the transaction list (past rewards, paid rewards, future rewards) of an address that has staked with us:

React with Axios
```javacript
import axios from "axios";

const api_key = 'YOUR API KEY';
const chain = 'CHAIN NAME';
const address = 'DELEGATOR ADDRESS';

var api = axios.create({
  baseURL: "http://testnet.staked.cloud/api",
  timeout: 1000000
});

api.defaults.headers.post["Content-Type"] = "application/json";

api.get(`/reports/${chain}/delegator/${address}/txns?api_key=${api_key}`).then(response => {
  console.log(res);
})
```


jQuery
```jquery
const api_key = 'YOUR API KEY';
const chain = 'CHAIN NAME';
const address = 'DELEGATOR ADDRESS';

var request = {
  "url": `http://testnet.staked.cloud/api/reports/${chain}/delegator/${address}/txns?api_key=${api_key}`,
  "method": "GET",
  "timeout": 0,
};

$.ajax(request).done(function (response) {
  console.log(response);
});
```
