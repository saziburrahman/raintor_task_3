import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import UserCardSkeleton from "./UserCardSkeleton";

interface ErrorFallbackProps {
  error: string;
}

const useInfiniteUsers = (): UseInfiniteUsersReturn => {
  const [data, setData] = useState<{ users: UserData[]; total: number }>({
    users: [],
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const skipRef = useRef<number>(0);
  const fetchingRef = useRef<boolean>(false);

  const fetchUsers = useCallback(
    async (isRefresh: boolean = false): Promise<void> => {
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      const currentSkip = isRefresh ? 0 : skipRef.current;

      try {
        const response = await fetch(
          `https://tech-test.raintor.com/api/users/GetUsersList?take=10&skip=${currentSkip}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();

        setData((prev) => ({
          users: isRefresh ? result.users : [...prev.users, ...result.users],
          total: result.total,
        }));

        skipRef.current = isRefresh
          ? result.users.length
          : skipRef.current + result.users.length;
        setHasNextPage(skipRef.current < result.total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    []
  );

  const refetch = useCallback((): void => {
    skipRef.current = 0;
    fetchUsers(true);
  }, [fetchUsers]);

  const fetchNextPage = useCallback((): void => {
    if (hasNextPage && !loading) {
      fetchUsers(false);
    }
  }, [hasNextPage, loading, fetchUsers]);

  useEffect(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  return {
    data: data.users,
    total: data.total,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
};

UserCard.displayName = "UserCard";

const EndOfList: React.FC<{ count: number }> = ({ count }) => (
  <div
    className="text-center py-8 text-gray-500"
    role="status"
    aria-live="polite"
  >
    <p>You've reached the end of the user list</p>
    <p className="text-sm mt-1">Showing all {count} users</p>
  </div>
);

const UserGrid: React.FC<{ users: UserData[] }> = ({ users }) => (
  <div
    className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
    role="list"
    aria-label={`User list with ${users.length} users`}
  >
    {users.map((user, index) => (
      <motion.div
        key={user.id}
        role="listitem"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <UserCard user={user} index={index} />
      </motion.div>
    ))}
  </div>
);

const InitialLoading: React.FC = () => (
  <div className="space-y-6" aria-label="Loading users">
    {[...Array(6)].map((_, i) => (
      <UserCardSkeleton key={i} />
    ))}
  </div>
);

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Failed to load users
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
    </div>
  </div>
);

const UserFeed: React.FC = () => {
  const {
    data: users,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteUsers();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !loading && !loadingMore) {
          setLoadingMore(true);
          await fetchNextPage();
          setLoadingMore(false);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observerRef.current = observer;

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, loading, loadingMore, fetchNextPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "r" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        refetch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [refetch]);

  if (error && users.length === 0) {
    return <ErrorFallback error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && users.length === 0 && <InitialLoading />}

        {users.length > 0 && <UserGrid users={users} />}

        {loadingMore && `Loading more users...`}

        {!hasNextPage && users.length > 0 && <EndOfList count={users.length} />}

        <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
      </main>
    </div>
  );
};

export default UserFeed;
