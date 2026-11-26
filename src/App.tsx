import { AppRouter } from "./routes/AppRouter";
import { ApiStatusBanner } from "./components/ApiStatusBanner";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { TaskProvider } from "./contexts/TaskContext";

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <TaskProvider>
          <ApiStatusBanner />
          <AppRouter />
        </TaskProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
