import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import withAuth from "../WithAuth/WithAuth";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";
import TestPage from "../pages/TestPage";
import TestManager from "../pages/TestManager";
import CreateSchedulePage from "../pages/CreateSchedulePage";
import GroupManagementPage from "../pages/GroupManagementPage ";
import UserPage from "../pages/UserPage";

// Защита маршрутов с HOC
const AdminPageWithAuth = withAuth(AdminPage, ["admin", "teacher"]); // Только для admin
const TestManagerWithAuth = withAuth(TestManager, ["admin", "teacher"]); // Только для admin
const CreateSchedulePageWithAuth = withAuth(CreateSchedulePage, ["admin", "teacher"]); // admin и teacher
const GroupManagementPageWithAuth = withAuth(GroupManagementPage, ["admin", "teacher"]); // admin и teacher
const UserPageWithAuth = withAuth(UserPage, ["admin", "teacher"]); // Только для admin
const TestPageWithAuth = withAuth(TestPage, ["student","admin"]); // Для user и admin
const HomePageWithAuth = withAuth(HomePage, ["student", "admin"]); // Для авторизованных

const AppRoutes = () => {

  return (
    <Routes>
      {/* Закрываем доступ к HomePage для неавторизованных */}
      <Route
        path="/"
        element={<HomePageWithAuth />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Тесты: только для user и admin */}
      <Route
        path="/test/:id"
        element={ <TestPageWithAuth />}
      />

      {/* --------- АДМИНСКИЕ РАЗДЕЛЫ -------------------------------------------------- */}
      <Route path="/admin/tests" element={<AdminPageWithAuth />} />
      <Route path="/admin/test/:testId" element={<TestManagerWithAuth />} />
      <Route path="/admin/groups" element={<GroupManagementPageWithAuth />} />
      <Route path="/admin/students" element={<UserPageWithAuth />} />
      <Route path="/admin/shedules" element={<CreateSchedulePageWithAuth />} />
    </Routes>
  );
};

export default AppRoutes;
