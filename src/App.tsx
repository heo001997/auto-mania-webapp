import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Workflow from './pages/Workflow';
import Dataset from './pages/Dataset';
import WorkflowDetail from './pages/WorkflowDetail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
