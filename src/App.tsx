import type { ReactNode } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clearAccount, isFaculty } from "./utils/account";
import { clearToken, hasValidToken } from "./utils/authToken";
import { onAuthExpired } from "./utils/authEvents";
import AppLayout from "./views/layout/AppLayout";
import FacultyLayout from "./views/layout/FacultyLayout";
import LandingPage from "./views/pages/LandingPage";
import AuthPage from "./views/pages/AuthPage";
import OnboardingPage from "./views/pages/OnboardingPage";
import RoleRecommendationPage from "./views/pages/RoleRecommendationPage";
import HomePage from "./views/pages/HomePage";
import RoadmapCatalogPage from "./views/pages/RoadmapCatalogPage";
import RoadmapPage from "./views/pages/RoadmapPage";
import RoadmapNodePage from "./views/pages/RoadmapNodePage";
import RoadmapNodeQuizPage from "./views/pages/RoadmapNodeQuizPage";
import ChatPage from "./views/pages/ChatPage";
import CollabPage from "./views/pages/CollabPage";
import MyTeamsPage from "./views/pages/MyTeamsPage";
import CareerPage from "./views/pages/CareerPage";
import CareerConsultPage from "./views/pages/CareerConsultPage";
import ProfilePage from "./views/pages/ProfilePage";
import FacultyDashboardPage from "./views/pages/FacultyDashboardPage";
import FacultyOnboardingPage from "./views/pages/FacultyOnboardingPage";
import FacultyRoadmapsPage from "./views/pages/FacultyRoadmapsPage";
import FacultyRoadmapEditPage from "./views/pages/FacultyRoadmapEditPage";
import FacultyNodeEditPage from "./views/pages/FacultyNodeEditPage";
import FacultyStudentsPage from "./views/pages/FacultyStudentsPage";
import FacultyGroupsPage from "./views/pages/FacultyGroupsPage";
import FacultyRequestsPage from "./views/pages/FacultyRequestsPage";

const queryClient = new QueryClient();

/**
 * Wajib login: kalau tak ada token valid (belum login / token basi), tendang
 * ke /login. Membungkus seluruh halaman inti (AppLayout).
 */
function RequireAuth({ children }: { children: ReactNode }) {
  if (!hasValidToken()) {
    clearToken();
    clearAccount();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/** Blokir dosen dari halaman khusus mahasiswa (mis. grup/community chat). */
function StudentOnly({ children }: { children: ReactNode }) {
  return isFaculty() ? <Navigate to="/faculty" replace /> : <>{children}</>;
}

const router = createBrowserRouter([
  // Flow pra-aplikasi (tanpa navigasi global)
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/onboarding/role", element: <RoleRecommendationPage /> },

  // Halaman inti dengan navigasi global (AppLayout) — wajib login
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/roadmap", element: <RoadmapCatalogPage /> },
      { path: "/roadmap/:roadmapId", element: <RoadmapPage /> },
      { path: "/roadmap/:roadmapId/:nodeId", element: <RoadmapNodePage /> },
      { path: "/roadmap/:roadmapId/:nodeId/quiz", element: <RoadmapNodeQuizPage /> },
      { path: "/community", element: <StudentOnly><ChatPage /></StudentOnly> },
      { path: "/partner", element: <CollabPage /> },
      { path: "/partner/teams", element: <MyTeamsPage /> },
      { path: "/career", element: <CareerPage /> },
      { path: "/career/consult", element: <CareerConsultPage /> },
      { path: "/profile", element: <ProfilePage /> },

      // Panel dosen (guard di FacultyLayout)
      {
        path: "/faculty",
        element: <FacultyLayout />,
        children: [
          { index: true, element: <FacultyDashboardPage /> },
          { path: "students", element: <FacultyStudentsPage /> },
          { path: "groups", element: <FacultyGroupsPage /> },
          { path: "requests", element: <FacultyRequestsPage /> },
          { path: "onboarding", element: <FacultyOnboardingPage /> },
          { path: "roadmaps", element: <FacultyRoadmapsPage /> },
          { path: "roadmaps/:roadmapId", element: <FacultyRoadmapEditPage /> },
          { path: "roadmaps/:roadmapId/:nodeId", element: <FacultyNodeEditPage /> },
        ],
      },
    ],
  },
]);

// 401 dari request terautentikasi (token basi) → redirect SPA ke /login.
// Pakai instance router langsung supaya bisa dipanggil dari luar React.
onAuthExpired(() => {
  void router.navigate("/login", { replace: true });
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
