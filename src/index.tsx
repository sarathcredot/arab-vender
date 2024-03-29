import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./store/index";
import { ApolloProvider, createHttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { authLink, requestInterceptor, responseInterceptor } from "./Interceptor";
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { createUploadLink } from 'apollo-upload-client';
import { RecoilRoot, useRecoilValue } from "recoil";
import { ToastContainer } from "react-toastify";


const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
});


const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Apollo-Require-Preflight": "true"
  }
})





const client = new ApolloClient({
  link: ApolloLink.from([authLink, responseInterceptor, uploadLink]),
  cache: new InMemoryCache(),
  // link: ApolloLink.from([requestInterceptor, responseInterceptor /* other links if needed */]),
});

const getId: any = document.getElementById("root");


const root = ReactDOM.createRoot(getId);

if (process.env.REACT_APP_NODE_ENV === 'production') {
  console.log = () => { }
  console.error = () => { }
  console.debug = () => { }
}

root.render(
  <RecoilRoot>
    <ToastContainer />
    <Provider store={configureStore({})}>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
  </RecoilRoot>
);