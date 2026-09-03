import AuthPage from "./pages/AuthPage"
import ChatPage from "./pages/ChatPage"
import { ThemeProvider } from "./context/ThemeContext"
import { WallpaperProvider } from "./context/WallpaperContext"
import { Navigate, Route, Routes } from "react-router"
import { useAuth } from "@clerk/react"


function App() {

  const { isSignedIn, isLoaded } = useAuth()

  if(!isLoaded) return <p>Loading....</p>

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} path="/" />
          <Route element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />} path="/auth" />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>

  )
}

export default App
