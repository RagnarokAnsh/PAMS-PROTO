import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Agreements } from "./pages/Agreements";
import { CreateAgreement } from "./pages/CreateAgreement";
import { AgreementDetails } from "./pages/AgreementDetails";
import { Partners } from "./pages/Partners";
import { CreatePartner } from "./pages/CreatePartner";
import { Users } from "./pages/Users";
import { AuditLog } from "./pages/AuditLog";
import { Amendments } from "./pages/Amendments";
import { Grants } from "./pages/Grants";
import { Projects } from "./pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "agreements", Component: Agreements },
      { path: "agreements/create", Component: CreateAgreement },
      { path: "agreements/:agreementId", Component: AgreementDetails },
      { path: "partners", Component: Partners },
      { path: "partners/create", Component: CreatePartner },
      { path: "users", Component: Users },
      { path: "audit-log", Component: AuditLog },
      { path: "amendments", Component: Amendments },
      { path: "grants", Component: Grants },
      { path: "projects", Component: Projects },
    ],
  },
]);