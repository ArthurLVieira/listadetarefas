import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRouter } from "./routes/AppRouter";

export default function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </StrictMode>
  );
}
