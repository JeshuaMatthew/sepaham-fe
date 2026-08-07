import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import ActiveCommunityPage from "./views/pages/ActiveCommunityPage";
import ProfilePage from "./views/pages/ProfilePage";
import FacultyDashboardPage from "./views/pages/FacultyDashboardPage";
import FacultyOnboardingPage from "./views/pages/FacultyOnboardingPage";
import FacultyRoadmapsPage from "./views/pages/FacultyRoadmapsPage";
import FacultyRoadmapEditPage from "./views/pages/FacultyRoadmapEditPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // Flow pra-aplikasi (tanpa navigasi global)
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/onboarding/role", element: <RoleRecommendationPage /> },

  // Halaman inti dengan navigasi global (AppLayout)
  {
    element: <AppLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/roadmap", element: <RoadmapCatalogPage /> },
      { path: "/roadmap/:roadmapId", element: <RoadmapPage /> },
      { path: "/roadmap/:roadmapId/:nodeId", element: <RoadmapNodePage /> },
      { path: "/roadmap/:roadmapId/:nodeId/quiz", element: <RoadmapNodeQuizPage /> },
      { path: "/community", element: <ChatPage /> },
      { path: "/partner", element: <CollabPage /> },
      { path: "/active", element: <ActiveCommunityPage /> },
      { path: "/profile", element: <ProfilePage /> },

      // Panel dosen (guard di FacultyLayout)
      {
        path: "/faculty",
        element: <FacultyLayout />,
        children: [
          { index: true, element: <FacultyDashboardPage /> },
          { path: "onboarding", element: <FacultyOnboardingPage /> },
          { path: "roadmaps", element: <FacultyRoadmapsPage /> },
          { path: "roadmaps/:roadmapId", element: <FacultyRoadmapEditPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
