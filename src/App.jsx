import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import DepositsPage from "./pages/DepositsPage";
import TravellersPage from "./pages/TravellersPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />

        <Route path="/expenses" element={<ExpensesPage />} />

        <Route path="/deposits" element={<DepositsPage />} />

        <Route path="/travellers" element={<TravellersPage />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
