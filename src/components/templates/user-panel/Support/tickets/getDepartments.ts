import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";

export interface DepartmentApiType {
  id: string;
  name: string;
  status: string;
}

interface GetDepartmentsResponse {
  data: DepartmentApiType[];
}

export const getDepartments = async (): Promise<{ id: string; label: string }[]> => {
  const token = loadUserData()?.access_token;

  const res = await apiRequest<GetDepartmentsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/client/getTickets`,
    "GET",
    undefined,
    { Authorization: `Bearer ${token}` }
  );

  if (!res.success || !res.data?.data) {
    return [];
  }

  return res.data.data
    ?.filter((item) => item.status === "active")
    .map((item) => ({
      id: String(item.id),
      label: item.name,
    }));
};
