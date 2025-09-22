"use client"
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProfitToTWallet from "./ProfitToTWallet";
import TWalletTothers from "./TWalletTothers";
import IncreaserTWallet from "./IncreaseTWallet";
import TWalletStatement from "./TWalletStatement";
import Logout from "@/components/modules/UserPanel/Logout/Logout";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
// import { usePermissions } from "../hooks/usePermissions";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabsConfig = [
  {
    permissionKey: "twallet.action.to_twallet",
    component: <ProfitToTWallet />,
  },
  {
    permissionKey: "twallet.action.to_others",
    component: <TWalletTothers />,
  },
  {
    permissionKey: "twallet.action.increase_wallet",
    component: <IncreaserTWallet />,
  },
  {
    permissionKey: "twallet.action.statement",
    component: <TWalletStatement />,
  },
];

export default function TWalletTab() {
  const [value, setValue] = React.useState(0);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const route = useRouter();
  const { theme } = useTheme();

 React.useEffect(() => {
  if (typeof window !== "undefined") {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme || "light");
  }
}, [theme]);


  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    route.push("/login");
  };

//   const { data: permissions } = usePermissions();

//   let permissionArray: string[] = [];

//   if (typeof permissions?.data?.body === "string") {
//     permissionArray = permissions.data.body.split(",");
//   } else if (Array.isArray(permissions?.data?.body)) {
//     permissionArray = permissions.data.body;
//   }

  return (
    <Box sx={{ width: "95%", marginInline: "auto", paddingTop: "1rem" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "white",
          width: { xs: "95%", sm: "80%", md: "40%" },
          marginInline: { xs: "0", sm: "0"},
        }}
        className="tab-container mx-auto "
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
              backgroundColor: "#00CB08",
              borderRadius: "1em",
              height: "4px",
            },
          }}
          aria-label="basic tabs example"
        >
          <Tab
            {...a11yProps(0)}
            label={
              <span className="flex items-center gap-2 text-[var(--dark-color)] dark:text-white">
                All
              </span>
            }
          />
          {/* {permissionArray.includes("twallet.action.to_twallet") && ( */}
            <Tab
              {...a11yProps(1)}
              label={
                <span className="flex items-center gap-2 ">
                  <svg
                    width="31"
                    height="28"
                    viewBox="0 0 31 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke-[var(--dark-color)] dark:stroke-white"
                      d="M17.1111 23.7513L24.8444 23.75C26.6491 23.75 27.5514 23.75 28.2406 23.3958C28.8469 23.0842 29.3399 22.587 29.6488 21.9755C30 21.2803 30 20.3702 30 18.55V6.2C30 4.37983 30 3.46974 29.6488 2.77453C29.3399 2.163 28.8469 1.66582 28.2406 1.35423C27.5514 1 26.6491 1 24.8444 1H6.15556C4.35094 1 3.44863 1 2.75936 1.35423C2.15306 1.66582 1.66013 2.163 1.3512 2.77453C1 3.46974 1 4.37983 1 6.2V17.25M1 7.5H28.3889M10.6667 23.7513L1 23.75M10.6667 23.7513L7.44444 20.5M10.6667 23.7513L7.44444 27"
                      stroke="#D9D9D9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
            />
          {/* )} */}
          {/* {permissionArray.includes("twallet.action.to_others") && ( */}
            <Tab
              {...a11yProps(2)}
              label={
                <span className="flex items-center gap-2 ">
                  <svg
                    width="31"
                    height="28"
                    viewBox="0 0 31 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke-[var(--dark-color)] dark:stroke-white"
                      d="M13.8889 23.75H6.15556C4.35094 23.75 3.44864 23.75 2.75936 23.3958C2.15306 23.0842 1.66013 22.587 1.3512 21.9755C1 21.2803 1 20.3702 1 18.55V6.2C1 4.37983 1 3.46974 1.3512 2.77453C1.66013 2.163 2.15306 1.66582 2.75936 1.35423C3.44864 1 4.35094 1 6.15556 1H24.8444C26.6491 1 27.5514 1 28.2406 1.35423C28.8469 1.66582 29.3399 2.163 29.6488 2.77453C30 3.46974 30 4.37983 30 6.2V14M1 7.5H30M30 23.7513L20.3333 23.75M30 23.7513L26.7778 20.5M30 23.7513L26.7778 27"
                      stroke="#D9D9D9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
            />
          {/* )} */}
          {/* {permissionArray.includes("twallet.action.increase_wallet") && ( */}
            <Tab
              {...a11yProps(3)}
              label={
                <span className="flex items-center gap-2 ">
                  <svg
                    width="31"
                    height="28"
                    viewBox="0 0 31 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke-[var(--dark-color)] dark:stroke-white"
                      d="M13.8889 23.75H6.15556C4.35094 23.75 3.44864 23.75 2.75936 23.3958C2.15306 23.0842 1.66013 22.587 1.3512 21.9755C1 21.2803 1 20.3702 1 18.55V6.2C1 4.37983 1 3.46974 1.3512 2.77453C1.66013 2.163 2.15306 1.66582 2.75936 1.35423C3.44864 1 4.35094 1 6.15556 1H24.8444C26.6491 1 27.5514 1 28.2406 1.35423C28.8469 1.66582 29.3399 2.163 29.6488 2.77453C30 3.46974 30 4.37983 30 6.2V12.375M1 7.5H30M25.1667 27V17.25M30 22.1263L20.3333 22.125"
                      stroke="#D9D9D9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
            />
          {/* )} */}
          {/* {permissionArray.includes("twallet.action.statement") && ( */}
            <Tab
              {...a11yProps(4)}
              label={
                <span className="flex items-center gap-2 ">
                  <svg
                    width="30"
                    height="31"
                    viewBox="0 0 30 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke-[var(--dark-color)] dark:stroke-white"
                      d="M6.13208 30C4.33568 30 3.43749 30 2.75135 29.6488C2.14781 29.3399 1.65712 28.8469 1.3496 28.2406C1 27.5514 1 26.6491 1 24.8444V6.15556C1 4.35094 1 3.44864 1.3496 2.75936C1.65712 2.15306 2.14781 1.66013 2.75135 1.3512C3.43749 1 4.33568 1 6.13208 1H21.5283C23.3247 1 24.2229 1 24.9091 1.3512C25.5126 1.66013 26.0033 2.15306 26.3108 2.75936C26.6604 3.44864 26.6604 4.35094 26.6604 6.15556V7.44444M7.4151 7.44444H17.0378M7.4151 20.3333H9.01888M7.4151 13.8889H13.8302M12.5399 29.83L14.6485 29.4114C15.7863 29.1855 16.3552 29.0726 16.8857 28.8645C17.3566 28.6799 17.8041 28.4399 18.2189 28.1497C18.6862 27.8228 19.0963 27.4109 19.9164 26.587L28.1733 18.2923C29.2755 17.1851 29.2755 15.3899 28.1733 14.2826C27.0711 13.1754 25.2841 13.1754 24.1819 14.2826L15.7839 22.7191C15.0154 23.4911 14.6311 23.8771 14.3208 24.3146C14.0453 24.7031 13.8136 25.121 13.6299 25.5609C13.423 26.0563 13.2987 26.5877 13.0499 27.6504L12.5399 29.83Z"
                      stroke="#D9D9D9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              }
            />
          {/* )} */}
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {tabsConfig.map(
          (tab) =>
            // permissionArray.includes(tab.permissionKey) && (
              <React.Fragment key={tab.permissionKey}>{tab.component}</React.Fragment>
            )
        }
      </CustomTabPanel>

      {
      tabsConfig.map((tab, i) =>
          <CustomTabPanel key={tab.permissionKey} value={value} index={i + 1}>
            {tab.component}
          </CustomTabPanel>
      )}

      <Logout
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </Box>
  );
}
