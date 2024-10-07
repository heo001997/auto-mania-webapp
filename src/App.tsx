import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Builder from './pages/Builder';
import Dataset from './pages/Dataset';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "builders",
    element: <Builder />,
  },
  {
    path: "datasets",
    element: <Dataset />,
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
