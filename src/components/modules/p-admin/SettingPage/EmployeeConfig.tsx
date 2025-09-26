"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { AnimatePresence, motion } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";
import CustomAdminInput from "../CustomAdminInput";
import LineTitle from "../LineTitle";
import EmployeeList, { AdminUser } from "./EmployeeList";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`roll-tabpanel-${index}`}
      aria-labelledby={`roll-tab-${index}`}
      className="mt-4"
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `roll-tab-${index}`,
    "aria-controls": `roll-tabpanel-${index}`,
  };
}

interface Role {
  id: number;
  name: string;
}

interface FilterOption {
  label: string;
  value: number;
}

interface EmployeeForm {
  role: number | null;
  ceo2fa: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export default function EmployeeConfig() {
  const [value, setValue] = React.useState(0);
  const [showDeleteForm, setShowDeleteForm] = React.useState<boolean>(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [users, setUsers] = React.useState<AdminUser[]>([]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/admins`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const [form, setForm] = React.useState<EmployeeForm>({
    role: null,
    ceo2fa: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOpenMeta, setDropdownOpenMeta] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState<FilterOption>({
    label: "Select Role",
    value: 0,
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dropdownRefMeta = React.useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = roles.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = (
    field: keyof EmployeeForm,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const token = loadEncryptedData()?.token;
  const fetchRoles = React.useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roles`,
        "GET",
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (res.success) {
        setRoles(res.data.data);
      }
    } catch {
      toast.error("Failed to load roles");
    }
  }, [token, setRoles]);

  const handleAddEmployee = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/register`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Employee added successfully!");
        await fetchAdmins();
        setForm({
          role: null,
          ceo2fa: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
        setSelectedFilter({ label: "Select Role", value: 0 });
      } else {
        toast.error(res.message || "Failed to add employee");
      }
    } catch  {
      toast.error("Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = () => {
    toast.success("Employee info saved!");
    setForm({
      role: null,
      ceo2fa: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    });
    setSelectedFilter({ label: "Select Role", value: 0 });
  };


  React.useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false);
        }
        if (
          dropdownRefMeta.current &&
          !dropdownRefMeta.current.contains(event.target as Node)
        ) {
          setDropdownOpenMeta(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const renderDropdown = (
    open: boolean,
    setOpen: (val: boolean) => void,
    ref: React.RefObject<HTMLDivElement>,
    value: FilterOption,
    setValue: (val: FilterOption) => void,
    title?: string
  ) => (
    <div className="w-auto relative" ref={ref}>
      {title && <span className="text-white mb-1 block">{title}</span>}
      <div
        className="flex justify-between items-center p-2 rounded border border-[#555] bg-transparent text-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>{value.label}</span>
        <VscTriangleDown
          className={`transition-transform text-white text-xl ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded overflow-hidden shadow-lg"
          >
            {filterOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 cursor-pointer text-white hover:bg-[#275EDF]"
                onClick={() => {
                  setValue(option);
                  setOpen(false);
                  setForm((prev) => ({
                    ...prev,
                    role: option.value,
                  }));
                }}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] px-6 py-4 pb-8">
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="tab-container"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                justifyContent: "start",
                flexDirection: "column",
                borderBottom: "1px solid #222",
                display: "flex",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#1A68FF",
                  color: "white",
                  borderRadius: "1em",
                  height: "4px",
                },
              }}
              aria-label="roll config tabs"
            >
              <Tab
                label={<span className="text-white">Add New Employee</span>}
                {...a11yProps(0)}
              />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-4 items-end">
                <CustomAdminInput
                  title="First Name"
                  value={form.firstName}
                  onChange={(val) => handleInputChange("firstName", val)}
                />
                <CustomAdminInput
                  title="Last Name"
                  value={form.lastName}
                  onChange={(val) => handleInputChange("lastName", val)}
                />
                <CustomAdminInput
                  title="Email"
                  value={form.email}
                  onChange={(val) => handleInputChange("email", val)}
                />
                <CustomAdminInput
                  title="Phone Number"
                  value={form.phone}
                  onChange={(val) => handleInputChange("phone", val)}
                />
                {renderDropdown(
                  dropdownOpen,
                  setDropdownOpen,
                  dropdownRef,
                  selectedFilter,
                  setSelectedFilter,
                  "Select Role"
                )}
                <CustomAdminInput
                  title="Password"
                  value={form.password}
                  onChange={(val) => handleInputChange("password", val)}
                />
              </div>
              <button
                onClick={handleAddEmployee}
                className="titan-btn px-6 py-2 w-fit text-white rounded"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add Employee"}
              </button>
            </div>
            <EmployeeList users={users} refetch={fetchAdmins} />
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <div className="flex flex-col gap-4">
              <div className="w-64 my-4">
                <span className="text-white mb-2 block">Select Employee</span>
                {renderDropdown(
                  dropdownOpen,
                  setDropdownOpen,
                  dropdownRef,
                  selectedFilter,
                  setSelectedFilter
                )}
              </div>

              <div className="grid grid-cols-4 gap-4 items-end">
                <CustomAdminInput
                  title="First Name"
                  value={form.firstName}
                  onChange={(val) => handleInputChange("firstName", val)}
                />
                <CustomAdminInput
                  title="Last Name"
                  value={form.lastName}
                  onChange={(val) => handleInputChange("lastName", val)}
                />
                <CustomAdminInput
                  title="Email"
                  value={form.email}
                  onChange={(val) => handleInputChange("email", val)}
                />
                <CustomAdminInput
                  title="Phone Number"
                  value={form.phone}
                  onChange={(val) => handleInputChange("phone", val)}
                />
                {renderDropdown(
                  dropdownOpenMeta,
                  setDropdownOpenMeta,
                  dropdownRefMeta,
                  selectedFilter,
                  setSelectedFilter,
                  "Account Status"
                )}
                <CustomAdminInput
                  title="Enter CEO 2FA Code"
                  value={form.ceo2fa}
                  onChange={(val) => handleInputChange("ceo2fa", val)}
                />
              </div>

              <button
                onClick={handleEditEmployee}
                className="titan-btn px-6 py-2 w-fit text-white rounded mt-4"
              >
                Save Changes
              </button>

              <LineTitle onClick={() => {}} title="Meta Info" />
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 items-end mt-4">
                {renderDropdown(
                  dropdownOpenMeta,
                  setDropdownOpenMeta,
                  dropdownRefMeta,
                  selectedFilter,
                  setSelectedFilter,
                  "Account Status"
                )}
                <CustomAdminInput
                  title="Created At"
                  value={form.firstName}
                  onChange={(val) => handleInputChange("firstName", val)}
                />
                <CustomAdminInput
                  title="Last Updated"
                  value={form.lastName}
                  onChange={(val) => handleInputChange("lastName", val)}
                />
                <CustomAdminInput
                  title="Last Login"
                  value={form.email}
                  onChange={(val) => handleInputChange("email", val)}
                />
                {renderDropdown(
                  dropdownOpenMeta,
                  setDropdownOpenMeta,
                  dropdownRefMeta,
                  selectedFilter,
                  setSelectedFilter,
                  "Select Role"
                )}
                <CustomAdminInput
                  title="Temporary Password"
                  value={form.phone}
                  onChange={(val) => handleInputChange("phone", val)}
                />
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#FF6060] text-lg flex-1 text-nowrap">
                    Danger Zone
                  </span>
                  <div className="w-full my-4 h-[1px] bg-[#383C47]"></div>
                </div>
                <p className="text-[.8rem]  text-[#9A9A9A] my-4">
                  Deleting an employee requires entering the Admin 2FA code.
                </p>
                <div className="flex items-center justify-center">
                  <button
                    className="titan-logout-btn"
                    onClick={() => setShowDeleteForm(!showDeleteForm)}
                  >
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          </CustomTabPanel>
        </Box>
      </div>
      <AnimatePresence>
        {showDeleteForm && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteForm(false)}
            />
            <motion.div
              className="fixed z-[9999] flex items-center justify-center inset-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="min-w-80 p-4 rounded-[.5rem] pb-6 relative"
                style={{ background: "#8888883b", backdropFilter: "blur(2px)" }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-white text-xl hover:text-red-500"
                  onClick={() => setShowDeleteForm(false)}
                >
                  <FaTimes />
                </button>

                <div className="flex items-center justify-center gap-4">
                  <Image
                    width={500}
                    height={500}
                    src="/alert.png"
                    className="w-12"
                    alt=""
                  />
                  <span className="text-white text-lg font-bold text-center">
                    Are you absolutely sure?
                  </span>
                </div>

                <div className="description text-[#ABB0B2] my-8 w-[80%] text-center mx-auto">
                  Deleting this employee will permanently remove their access.
                  This action cannot be undone.
                </div>

                <div className="w-[80%] mx-auto">
                  <CustomAdminInput
                    title="Enter CEO 2FA Code"
                    value={form.ceo2fa}
                    onChange={(val) => handleInputChange("ceo2fa", val)}
                  />
                </div>

                <div className="flex flex-col items-center w-[80%] gap-4 mx-auto my-4">
                  <button className="titan-logout-btn w-full !py-3">
                    Confirm Delete
                  </button>
                  <button
                    className="titan-btn-download-white w-full !py-3 px-8"
                    onClick={() => setShowDeleteForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
