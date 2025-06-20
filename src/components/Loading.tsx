import { Loader2 } from "lucide-react";

const LoadingIndicator: React.FC<{ message?: string }> = ({
  message = "Loading more users...",
}) => (
  <div className="flex justify-center items-center py-8" aria-live="polite">
    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
    <span className="text-gray-600">{message}</span>
  </div>
);
export default LoadingIndicator;
