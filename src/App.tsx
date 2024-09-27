import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Builder from './pages/Builder';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "builders",
    element: <Builder />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
