# StakedAPIDemo

Project Link: http://staked-api-demo.appspot.com/
(Note: You must use http:// because the api itself is http)

This demo showcases yield information for a number of cryptocurrencies supported by Staked. 

#### You can hit the /yields endpoint in your web app:

React with Axios
```javacript
import axios from "axios";

var api = axios.create({
  baseURL: "http://testnet.staked.cloud/api",
  timeout: 1000000
});

api.defaults.headers.post["Content-Type"] = "application/json";

api.get(`/yields?api_key=${api_key}&extended=true&by_key=false`).then(response => {
  console.log(res);
})
```


jQuery
```jquery
var settings = {
  "url": "http://testnet.staked.cloud/api/yields?api_key={api_key}&extended=true&by_key=false",
  "method": "GET",
  "timeout": 0,
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
```
