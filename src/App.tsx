import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserFeed from "./components/UserFeed";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-center my-6">User Feed</h1>
        <UserFeed />
      </main>
    </QueryClientProvider>
  );
}
