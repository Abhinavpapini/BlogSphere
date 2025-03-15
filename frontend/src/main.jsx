import { StrictMode } from "react"
import "bootstrap/dist/css/bootstrap.css"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Rootlayout from "./components/Rootlayout.jsx"
import Home from "./components/common/Home.jsx"
import Signin from "./components/common/Signin.jsx"
import Signup from "./components/common/Signup.jsx"
import UserProfile from "./components/user/UserProfile.jsx"
import AuthorProfile from "./components/author/AuthorProfile.jsx"
import Articles from "./components/common/Articles.jsx"
import ArticleByID from "./components/common/ArticleByID.jsx"
import PostArticle from "./components/author/PostArticle.jsx"
import UserAuthorContext from "./contexts/UserAuthorContext.jsx"
import AdminProfile from "./components/admin/AdminProfile.jsx"
import DeletedArticles from "./components/author/DeletedArticles.jsx"
import AdminLayout from "./components/admin/AdminLayout.jsx"
import AdminDashboard from "./components/admin/AdminDashboard.jsx"

const browserRouterObj = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <UserAuthorContext>
          <Rootlayout />
        </UserAuthorContext>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "user-profile/:email",
          element: <UserProfile />,
          children: [
            {
              path: "articles",
              element: <Articles />,
            },
            {
              path: ":articleId",
              element: <ArticleByID />,
            },
            {
              path: "",
              element: <Navigate to="articles" />,
            },
          ],
        },
        {
          path: "author-profile/:email",
          element: <AuthorProfile />,
          children: [
            {
              path: "articles",
              element: <Articles />,
            },
            {
              path: ":articleId",
              element: <ArticleByID />,
            },
            {
              path: "article",
              element: <PostArticle />,
            },
            {
              path: "deleted-articles",
              element: <DeletedArticles />,
            },
            {
              path: "",
              element: <Navigate to="articles" />,
            },
          ],
        },
        {
          path: "admin-profile/:email",
          element: <AdminProfile />,
          children: [
            {
              path: "",
              element: <AdminDashboard />,
            },
            {
              path: "dashboard",
              element: <AdminDashboard />,
            },
          ],
        },
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: <AdminDashboard />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider
      router={browserRouterObj}
      future={{
        v7_startTransition: true,
      }}
    />
  </StrictMode>,
)