import { AppRouter } from "./routes/AppRouter";
import { ApiStatusBanner } from "./components/ApiStatusBanner";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ApiStatusBanner />
        <AppRouter />
      </CategoryProvider>
    </AuthProvider>
  );
}
