import type { ReactNode } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { isFaculty } from "@/features/auth/utils/account";
import { hasValidToken } from "@/features/auth/utils/authToken";
import { endSession } from "@/features/auth/utils/session";
import { onAuthExpired } from "@/features/auth/utils/authEvents";
import { ThemeProvider } from "@/theme/ThemeProvider";
import PageTransition from "@/components/animations/PageTransition";
import AppLayout from "@/layout/AppLayout";
import FacultyLayout from "@/layout/FacultyLayout";

// Pages
import LandingPage from "@/features/landing/pages/LandingPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import OnboardingPage from "@/features/onboarding/pages/OnboardingPage";

// Roadmap pages — masih di views (kamu yang handle)
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
import FacultyRolesPage from "./views/pages/FacultyRolesPage";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: ReactNode }) {
  if (!hasValidToken()) {
    endSession();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function StudentOnly({ children }: { children: ReactNode }) {
  return isFaculty() ? <Navigate to="/faculty" replace /> : <>{children}</>;
}

const router = createBrowserRouter([
  { path: "/", element: <PageTransition><LandingPage /></PageTransition> },
  { path: "/login", element: <PageTransition><AuthPage /></PageTransition> },
  { path: "/onboarding", element: <PageTransition><OnboardingPage /></PageTransition> },

  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/home", element: <PageTransition><HomePage /></PageTransition> },
      { path: "/roadmap", element: <PageTransition><RoadmapCatalogPage /></PageTransition> },
      { path: "/roadmap/:roadmapId", element: <PageTransition><RoadmapPage /></PageTransition> },
      { path: "/roadmap/:roadmapId/:nodeId", element: <PageTransition><RoadmapNodePage /></PageTransition> },
      { path: "/roadmap/:roadmapId/:nodeId/quiz", element: <PageTransition><RoadmapNodeQuizPage /></PageTransition> },
      { path: "/community", element: <PageTransition><StudentOnly><ChatPage /></StudentOnly></PageTransition> },
      { path: "/partner", element: <PageTransition><CollabPage /></PageTransition> },
      { path: "/partner/teams", element: <PageTransition><MyTeamsPage /></PageTransition> },
      { path: "/career", element: <PageTransition><CareerPage /></PageTransition> },
      { path: "/career/consult", element: <PageTransition><CareerConsultPage /></PageTransition> },
      { path: "/profile", element: <PageTransition><ProfilePage /></PageTransition> },
      {
        path: "/faculty",
        element: <FacultyLayout />,
        children: [
          { index: true, element: <PageTransition><FacultyDashboardPage /></PageTransition> },
          { path: "students", element: <PageTransition><FacultyStudentsPage /></PageTransition> },
          { path: "groups", element: <PageTransition><FacultyGroupsPage /></PageTransition> },
          { path: "requests", element: <PageTransition><FacultyRequestsPage /></PageTransition> },
          { path: "roles", element: <PageTransition><FacultyRolesPage /></PageTransition> },
          { path: "onboarding", element: <PageTransition><FacultyOnboardingPage /></PageTransition> },
          { path: "roadmaps", element: <PageTransition><FacultyRoadmapsPage /></PageTransition> },
          { path: "roadmaps/:roadmapId", element: <PageTransition><FacultyRoadmapEditPage /></PageTransition> },
          { path: "roadmaps/:roadmapId/:nodeId", element: <PageTransition><FacultyNodeEditPage /></PageTransition> },
        ],
      },
    ],
  },
]);

onAuthExpired(() => {
  // Cache profil/user sebelumnya harus ikut dibuang supaya akun berikutnya
  // yang login tidak melihat data akun lama sebelum refetch selesai.
  queryClient.clear();
  void router.navigate("/login", { replace: true });
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function App() {
  const app = (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );

  // Wrap with GoogleOAuthProvider only if client ID is configured.
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {app}
      </GoogleOAuthProvider>
    );
  }

  return app;
}

export default App;
