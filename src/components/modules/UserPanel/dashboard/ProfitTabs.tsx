"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import "./ProfitTabs.css";
import { FaArrowRight } from "react-icons/fa6";

interface Dataset {
  label: string;
  data: number[];
  percentage?: number;
}

interface ProfitTabsProps {
  datasets: Dataset[];
  activeDataset: number;
  onTabChange: (index: number) => void;
}

const TabsContainer = styled(Box)({
  position: "relative",
  maxWidth: "100%",
  overflow: "hidden",
});

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#004ada",
    height: 4,
    borderRadius: 2,
    transition: "none",
    "@media (max-width: 640px)": {
      display: "none",
    },
  },
  "& .MuiTabs-flexContainer": {
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "@media (max-width: 640px)": {
      gap: "8px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  "& .MuiTabs-scroller": {
    overflow: "auto !important",
  },
});

const CustomTab = styled(Tab)(({}) => ({
  textTransform: "none",
  fontWeight: "bold",
  padding: "10px",
  minWidth: "auto",
  whiteSpace: "nowrap",
  position: "relative",
  "&.Mui-selected": {
    color: "white",
    "&::after": {
      "@media (max-width: 640px)": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: "#00CB08",
        borderRadius: "1em",
        animation: "fadeIn 0.3s ease-in-out",
      },
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "scaleX(0)",
    },
    "100%": {
      opacity: 1,
      transform: "scaleX(1)",
    },
  },
}));

const getColorForLabel = (label: string) => {
  switch (label) {
    case "ROI":
      return "#4CAF50";
    case "Commission":
      return "#FFA500";
    case "Referral":
      return "#275EDF";
    default:
      return "#4CAF50";
  }
};

export default function ProfitTabs({
  datasets,
  activeDataset,
  onTabChange,
}: ProfitTabsProps) {
  console.log("datasets =>" , datasets)
  const [value, setValue] = React.useState(activeDataset);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  React.useEffect(() => {
    setValue(activeDataset);
  }, [activeDataset]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && value < datasets.length - 1) {
      setValue(value + 1);
      scrollToTab(value + 1);
    }
    if (isRightSwipe && value > 0) {
      setValue(value - 1);
      scrollToTab(value - 1);
    }
  };

  const scrollToTab = (index: number) => {
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    const tabElements = tabsElement.querySelectorAll('[role="tab"]');
    if (tabElements && tabElements[index]) {
      const tabElement = tabElements[index] as HTMLElement;
      const tabLeft = tabElement.offsetLeft;

      let targetScrollLeft = tabLeft - 16;

      if (index < datasets.length - 1) {
        targetScrollLeft = Math.max(0, targetScrollLeft - 50);
      }

      tabsElement.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onTabChange(newValue);
    scrollToTab(newValue);
  };

  return (
    <TabsContainer
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <CustomTabs
        ref={tabsRef}
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="profit tabs"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          position: "relative",
          "& .MuiTab-root": {
            color: "#7D7C7C",
          },
          "& .Mui-selected": {
            color: "#fff",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#00CB08",
            borderRadius: "1em",
            height: "4px",
          },
        }}
      >
        {datasets?.map((dataset, index) => (
          <CustomTab
            key={index}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: getColorForLabel(dataset.label),
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                />
                <span className="text-[var(--main-background)] dark:text-white whitespace-nowrap">
                  {dataset.label}
                </span>

                <span className="flex-shrink-0">
                  {dataset?.percentage !== undefined && (
                    <>
                      {dataset.percentage > 0 ? (
                        <FaArrowRight className="text-[var(--profit)] rotate-315" />
                      ) : dataset.percentage < 0 ? (
                        <FaArrowRight className="text-[var(--loss)] rotate-45" />
                      ) : (
                        <FaArrowRight className="text-gray-400 rotate-0" />
                      )}
                    </>
                  )}
                </span>

                <span
                  className="whitespace-nowrap"
                  style={{
                    color:
                      dataset?.percentage !== undefined
                        ? dataset.percentage > 0
                          ? "green"
                          : dataset.percentage < 0
                          ? "red"
                          : "gray" 
                        : "gray",
                  }}
                >
                  {dataset?.percentage !== undefined
                    ? `${
                        dataset.percentage > 0
                          ? "+"
                          : dataset.percentage < 0
                          ? ""
                          : ""
                      }${dataset.percentage.toFixed(2)}%`
                    : "--"}
                </span>
              </Box>
            }
          />
        ))}
      </CustomTabs>
    </TabsContainer>
  );
}
