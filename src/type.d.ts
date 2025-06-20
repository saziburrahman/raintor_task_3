interface Company {
  title: string;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  university: string;
  company: Company;
}

interface ApiResponse {
  users: UserData[];
  total: number;
  skip: number;
  limit: number;
}

interface UseInfiniteUsersReturn {
  data: UserData[];
  total: number;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}
