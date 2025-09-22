"use client";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import HoldingAccountsList, {
  InvoiceTransaction,
} from "@/components/modules/p-admin/users/HoldingAccountsList";
import HolddingAccountAuthoSwitch from "@/components/Ui/Modals/p-admin/HolddingAccountAuthoSwitch";
import { apiRequest } from "@/libs/api";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";

interface HoldingAccountsInfo {
  counts_by_plan: { name: string; total: number }[];
  total_in_queue: number;
  total_amount: number;
  auto_release_enabled: boolean;
}

interface HoldingAccountsSummaryApiResponse {
  success: boolean;
  message: string;
  data: HoldingAccountsInfo;
  errors: null | any;
}

export default function HoldingAccountPage() {
  const [holdAccounts, setHoldAccounts] = useState<InvoiceTransaction[]>([]);
  const [holdAccountsInfo, setHoldAccountsInfo] =
    useState<HoldingAccountsInfo | null>(null);
  const [accountSwitch, setAccountSwitch] = useState<boolean>(false);
  const [releasing, setReleasing] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchHoldingAccounts = async (
    pageNumber = 1,
    filter_by?: string,
    filter_value?: string
  ) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      queryParams.append("page", pageNumber.toString());
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<any>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/holdingAccounts?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.data.success) {
        setHoldAccounts(res.data.data);
        setPage(res.data.meta.current_page);
        setPerPage(res.data.meta.per_page);
        setTotal(res.data.meta.total);
      } else {
        toast.error("Error fetching transactions: " + res.data.message);
      }
    } catch (err: any) {
      toast.error("Error fetching transactions: " + err.message);
    }
  };

  const fetchHoldingAccountsInfo = async () => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<HoldingAccountsSummaryApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/holdingAccountsSummery`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.data.success) {
        setHoldAccountsInfo(res.data.data);
        setAccountSwitch(res.data.data.auto_release_enabled);
      } else {
        toast.error("Error fetching summary: " + res.data.message);
      }
    } catch (err: any) {
      toast.error("Error fetching summary: " + err.message);
    }
  };

  const releaseAllHoldingAccounts = async () => {
    setReleasing(true);
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/releaseAllHoldingAccounts`,
        "POST",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("All holding accounts released successfully 🎉");
        fetchHoldingAccountsInfo();
        setReleasing(false);
        fetchHoldingAccounts(page);
      } else {
        toast.error("Error releasing accounts: " + res.message);
        setReleasing(false);
      }
    } catch (err: any) {
      toast.error("Error releasing accounts: " + err.message);
    }
  };

  const handleAutoMode = async () => {
    const newValue = !accountSwitch;
    setAccountSwitch(newValue);

    try {
      const token = loadEncryptedData()?.token;
      const payload = { enabled: newValue };
      const response = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/updateAutoRelease`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success) {
        toast.success(
          response.message || "Auto release mode changed successfully 😊"
        );
        fetchHoldingAccountsInfo();
      } else {
        toast.error("Error changing auto release: " + response.message);
      }
    } catch (err: any) {
      toast.error("Error changing auto release: " + err.message);
    }
  };

  useEffect(() => {
    fetchHoldingAccountsInfo();
    fetchHoldingAccounts();
  }, []);

  const [showHoldingAccounts, setShowHoldingAccounts] = useState(true);

  return (
    <>
      <ToastContainer />
      <LineTitle
        onClick={() => {
          setShowHoldingAccounts(!showHoldingAccounts);
        }}
        title="Holding account"
      />

      {showHoldingAccounts && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "user",
                value: "user",
                placeholder: "Enter From User...",
              },
              {
                label: "invoice number",
                value: "invoice_number",
                placeholder: "Enter invoice number...",
              },
            ]}
            onSearch={(filter_by, filter_value) =>
              fetchHoldingAccounts(1, filter_by, filter_value)
            }
            onClear={() => fetchHoldingAccounts(1)}
          />

          <div className="flex items-center gap-4 mt-8">
            {holdAccountsInfo?.counts_by_plan?.map((account, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-[2rem] py-2 border-[1px] border-[#383C47] rounded-[.5rem]"
              >
                <span className="text-[#707070]">{account.name} :</span>
                <span className="text-white">{account.total}</span>
              </div>
            ))}
          </div>

          <HoldingAccountsList
            holdAccounts={holdAccounts}
            onFetch={fetchHoldingAccounts}
          />

          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(total / perPage)}
              page={page}
              onChange={(event, newPage) => fetchHoldingAccounts(newPage)}
            />
          </div>

          <div className="flex justify-center sm:justify-start items-center flex-wrap gap-4 mt-8">
            <div className="flex items-center px-[2rem] py-2 border border-[#383C47] rounded-[.5rem]">
              <span className="text-[#707070]">Investments in queue :</span>
              <span className="text-white">
                {holdAccountsInfo?.total_in_queue}
              </span>
            </div>
            <div className="flex items-center px-[2rem] py-2 border border-[#383C47] rounded-[.5rem]">
              <span className="text-[#707070]">Total Amount :</span>
              <span className="text-white">
                $ {holdAccountsInfo?.total_amount}
              </span>
            </div>
            <div className="flex items-center px-[2rem] py-2 border border-[#383C47] rounded-[.5rem]">
              <span className="text-[#707070]">Auto Release:</span>
              <span className="text-white">
                <HolddingAccountAuthoSwitch
                  checked={accountSwitch}
                  onChange={handleAutoMode}
                />
              </span>
            </div>
            <button
              onClick={releaseAllHoldingAccounts}
              disabled={releasing}
              className={`py-[.5rem] px-[3rem] rounded-[.5rem] text-white ${
                releasing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#DF6E27] hover:bg-[#e07b3c]"
              }`}
            >
              {releasing ? "Releasing..." : "Release All"}
            </button>
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
