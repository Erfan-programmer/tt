"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { menuItems } from "./MenuItem";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Import the TitanModal component
import TitanModal from "@/components/Ui/Modals/TitanModal";
import CustomModal from "../CustomModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MobileSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  menuItemsList: string[];
  handleMenuItemClick: (item: string) => void;
  isScrolled: boolean;
  user: boolean;
  router: AppRouterInstance;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  menuItemsList,
  handleMenuItemClick,
  user,
}) => {
  // 1. Add state to control the visibility of the modal
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const router = useRouter();
  // 2. Define the new onClick handler for the Register button
  const [isOpen, setIsOpen] = useState(false);
  const handleRegisterClick = () => {
    router.push("/register");
    // setIsOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Add a unique key for the motion.div to help AnimatePresence track it */}
            <motion.div
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }} // <-- Add exit animation
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 z-[9999] w-64 h-full bg-[#212334] p-6 shadow-lg lg:hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* The rest of your sidebar content */}
              <div className="flex justify-between items-center mb-6">
                <Image

                  src="/titan-main-avatar.png"
                  className="w-24"
                  width={300}
                  height={300}
                  alt="titan logo"
                />
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block py-2 text-white hover:text-blue-500"
                    onClick={toggleSidebar}
                  >
                    Home
                  </Link>
                </li>
                {menuItemsList.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className="w-full text-left py-2 text-white hover:text-blue-500"
                    >
                      {item}
                    </button>
                  </li>
                ))}
                <li className="mt-4 pt-4 border-t border-gray-700">
                  {user ? (
                    <Accordion
                      sx={{
                        bgcolor: "#363848",
                        borderRadius: "8px",
                        boxShadow: 1,
                        color: "#fff",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                      >
                        <FaUser style={{ marginRight: 8, color: "#fff" }} />
                        <Typography fontWeight="bold" color="#fff">
                          Account
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <List>
                          {menuItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={toggleSidebar}
                            >
                              <ListItemButton sx={{ color: "#fff" }}>
                                <ListItemIcon sx={{ color: "#fff" }}>
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                              </ListItemButton>
                            </Link>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    // 3. Update the Register button's onClick handler
                    <button
                      className="topBarBg w-full py-2 px-8 text-[#222] font-semibold rounded-lg"
                      onClick={handleRegisterClick}
                    >
                      <span>Register</span>
                    </button>
                  )}
                </li>
              </ul>
            </motion.div>

            {/* The overlay also needs to be conditionally rendered inside AnimatePresence */}
            <motion.div
              key="mobile-sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-black/50"
              onClick={toggleSidebar}
            />
          </>
        )}
      </AnimatePresence>

      {/* 4. Conditionally render the new TitanModal */}
      {showRegistrationModal && (
        <TitanModal
          onClose={() => setShowRegistrationModal(false)}
          title="Website under Maintenance"
          description="We are launching our new website soon. We are unable to offer new registration at the moment. Please check back later."
        >
          {/* Add a children prop to resolve the type error */}
          <div></div>
        </TitanModal>
      )}

      {isOpen && (
        <CustomModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registration Notice"
        >
          <p>
            Registration will be available soon. The website is still under
            development.
          </p>
        </CustomModal>
      )}
    </>
  );
};

export default MobileSidebar;
