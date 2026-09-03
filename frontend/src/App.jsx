import AuthPage from "./pages/AuthPage"
import ChatPage from "./pages/ChatPage"
import { ThemeProvider } from "./context/ThemeContext"
import { WallpaperProvider } from "./context/WallpaperContext"
import { Navigate, Route, Routes } from "react-router"
import { useAuth } from "@clerk/react"
import PageLoader from "./components/PageLoader"
import {Toaster} from "react-hot-toast"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

function App() {

  const { isSignedIn, isLoaded } = useAuth()

  const checkAuth = useAuthStore((state) => state.checkAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)


  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) checkAuth()
    else clearAuth()
  }, [checkAuth, clearAuth, isSignedIn, isLoaded])

  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} path="/" />
          <Route element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />} path="/auth" />
        </Routes>
        <Toaster/>
      </WallpaperProvider>
    </ThemeProvider>

  )
}

export default App
