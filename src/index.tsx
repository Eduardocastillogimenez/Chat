import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App';
import Login from './view/Login';
import Register from './view/Register';
import Error404 from './Components/error404';
// import Error403 from './Components/error403';
import { AuthProvider } from "./contex";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <Error404 />,
  },
  {
    path: "/login",
    element: <Login/>,
    errorElement: <Error404 />,
  },
  {
    path: "/register",
    element: <Register/>,
    errorElement: <Error404 />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
