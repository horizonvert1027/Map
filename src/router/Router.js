import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import HomeLayout from "../layouts/HomeLayout";
import EditLayout from "../layouts/EditLayout";
import AdminLayout from "layouts/AdminLayout";

import NotFound from "pages/Other/NotFound";

import Login from "../pages/Auth/Login";
import AdminLogin from "pages/Auth/AdminLogin";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Home/Dashboard";
import Profile from "../pages/Home/Profile";
import ContactUs from "../pages/Home/ContactUs";
import Projects from "pages/Home/Projects";
import ProjectEdit from "pages/Edit/ProjectEdit";
import Share from "pages/Edit/Share";
import Payments from "pages/Home/Payments";
import Guide from "pages/Home/Guide";
import Consultant from "pages/Home/Consultant";

import Home from "pages/Admin/Home";
import User from "pages/Admin/Users";
import UserEdit from "pages/Admin/UserEdit";
import Group from "pages/Admin/Groups";
import GroupEdit from "pages/Admin/GroupEdit";

import Subscription from "pages/Admin/Settlements/Subscriptions";
import Licenses from "pages/Admin/Settlements/Licenses";
import LicenseEdit from "pages/Admin/Settlements/LicenseEdit";
import Bill from "pages/Admin/Settlements/Bills";

import Messages from "pages/Admin/TechnicalSupport/Messages";
import HelpReport from "pages/Admin/TechnicalSupport/HelpReport";
import HelpReportEdit from "pages/Admin/TechnicalSupport/HelpReportEdit";

import Entrance from "pages/Admin/Raporty/Entrances";
import Activities from "pages/Admin/Raporty/Activities";
import Usage from "pages/Admin/Raporty/Usage";
import { AuthRoute } from "./AuthRoute";

const layouts = {
  auth: AuthLayout,
  home: HomeLayout,
  edit: EditLayout,
  admin: AdminLayout
};

const routes = {
  auth: [
    { path: '/', component: Login, title: 'Login', },
    { path: '/login', component: Login, title: 'Zaloguj się', },
    { path: '/admin/login', component: AdminLogin, title: 'Administracyjny Zaloguj się', },
    { path: '/register', component: Register, title: 'rejestracja', },
    // { path: '/forgot-password', component: ForgotPassword, title: 'rejestracja', },
  ],
  home: [
    { path: '/dashboard', component: Dashboard, title: 'Dashboard', authType: 'user' },
    { path: '/profile', component: Profile, title: 'Edit Profile', authType: 'user' },
    { path: '/projects', component: Projects, title: 'Project History', authType: 'user' },
    { path: '/payments', component: Payments, title: 'Payments and Invoices', authType: 'user' },
    { path: '/guide', component: Guide, title: 'Guide' },
    { path: '/consultant', component: Consultant, title: 'Consultant', authType: 'user' },
    { path: '/contact-us', component: ContactUs, title: 'Contact Us' },
  ],
  edit: [
    { path: '/project/:id', component: ProjectEdit, title: 'Edit Project', authType: 'user' },
    { path: '/share/:id', component: Share, title: 'Edit Project' },
  ],
  admin: [
    { path: '/admin', component: Home, title: 'Strona główna', authType: 'admin' },
    { path: '/admin/home', component: Home, title: 'Strona główna', authType: 'admin' },
    { path: '/admin/users', component: User, title: 'Użytkownicy', authType: 'admin' },
    { path: '/admin/user/add', component: UserEdit, title: 'Dodaj użytkownika', authType: 'admin' },
    { path: '/admin/user/edit/:id', component: UserEdit, title: 'Edytować użytkownika', authType: 'admin' },
    { path: '/admin/groups', component: Group, title: 'Użytkownicy', authType: 'admin' },
    { path: '/admin/group/add', component: GroupEdit, title: 'Dodaj grupę', authType: 'admin' },
    { path: '/admin/group/edit/:id', component: GroupEdit, title: 'Edytować grupę', authType: 'admin' },
    { path: '/admin/subscriptions', component: Subscription, title: 'Subskrypcję', authType: 'admin' },
    { path: '/admin/bills', component: Bill, title: 'Rachunki', authType: 'admin' },
    { path: '/admin/licenses', component: Licenses, title: 'Licencję', authType: 'admin' },
    { path: '/admin/license/add', component: LicenseEdit, title: 'Dodaj licencję', authType: 'admin' },
    { path: '/admin/license/edit/:id', component: LicenseEdit, title: 'Edytować licencję', authType: 'admin' },
    { path: '/admin/messages', component: Messages, title: 'Wiadomości', authType: 'admin' },
    { path: '/admin/help-report', component: HelpReport, title: 'Raporty pomocy', authType: 'admin' },
    { path: '/admin/help-report/add', component: HelpReportEdit, title: 'Dodaj Raporty pomocy', authType: 'admin' },
    { path: '/admin/help-report/edit:id', component: HelpReportEdit, title: 'Edytować Raporty pomocy', authType: 'admin' },
    { path: '/admin/entrances', component: Entrance, title: 'Raport wejścia uczestników', authType: 'admin' },
    { path: '/admin/activities', component: Activities, title: 'Raport aktywnych użytkowników', authType: 'admin' },
    { path: '/admin/usage', component: Usage, title: 'Raport użycia', authType: 'admin' },
  ]
}

const renderChildren = (item, layout) => {
  const Layout = layouts[layout];
  return <AuthRoute type={item.authType} children={<Layout children={React.createElement(item.component)} />} />;
}

const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        {Object.keys(routes).map(layout => routes[layout].map((item, index) =>
          <Route path={item.path} element={renderChildren(item, layout)} key={`${layout}_${index}`} />
        ))}
        <Route element={NotFound} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
