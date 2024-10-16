import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Workflow from './pages/Workflow';
import Dataset from './pages/Dataset';
import WorkflowDetail from './pages/WorkflowDetail';
import Runner from "./pages/Runner";
import Device from "./pages/Device";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Device />,
  },
  {
    path: "/devices",
    element: <Device />,
  },
  {
    path: "runners",
    element: <Runner />,
  },
  {
    path: "workflows",
    element: <Workflow />,
  },
  {
    path: "workflow/:id",
    element: <WorkflowDetail />,
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
