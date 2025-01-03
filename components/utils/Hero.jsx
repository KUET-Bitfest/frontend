"use client";
import { Caveat, Kameron, Nunito, Rye } from "next/font/google";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AiOutlineMenu, AiOutlineClose, AiFillRobot } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { MdTranslate, MdHistory, MdSearch, MdLanguage } from "react-icons/md";
import { Button } from "../ui/components/button";
import ThemeChanger from "../utilities/ThemeChanger";
import TabItem from "../ui/components/tab-item";
import LoginModal from "../login/LoginModal";
import Notification from "../websocket/Notification";
import SearchSidebar from "./SearchSidebar";
import { RiAiGenerate, RiBrainLine } from "react-icons/ri";
import Image from "next/image";
import { Tooltip, TooltipProvider } from "../ui/components/tooltip";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../constants/languages";

const kameron = Kameron({ subsets: ["latin"], weight: "700" });

export default function Hero({ landing = true }) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [token, setToken] = useState(false);
  const [nav, setNav] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { currentLanguage, toggleLanguage } = useLanguage();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setSignedIn(true);
      setUser(JSON.parse(token));
    }
    if (!token) {
      return;
    }
    setToken(token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  function signOutHandler() {
    localStorage.removeItem("token");
    router.push("/");
    setSignedIn(false);
  }

  function TokenCheckHandler(url) {
    let token = localStorage.getItem("token");
    router.push(url);
  }

  return (
    <>
      <div className="flex justify-between items-center px-8 py-4 text-white w-[90%] mx-auto">
        {/* Logo - Left */}
        <div className="flex-none">
          <Link href={"/"} className="flex items-end gap-2">
            <Image src={"/logo.png"} alt="logo" width={48} height={48} />
            <span className={`${kameron.className} text-3xl font-black`}>
              <span className="text-grey">Bayanno</span>
              <span className="text-primary">.ai</span>
            </span>
          </Link>
        </div>

        {/* Navigation - Center */}
        <div className="flex-1 flex justify-center space-x-4">
          <TabItem
            to="/"
            value={translations.nav.home[currentLanguage]}
            className="mx-4"
          />
          <TabItem
            to="/translate"
            value={translations.nav.translate[currentLanguage]}
            className="mx-4"
          />
          <TabItem
            to="/chat"
            value={translations.nav.chat[currentLanguage]}
            className="mx-4"
          />
          <TabItem
            to="/documents"
            value={translations.nav.documents[currentLanguage]}
            className="mx-4"
          />
          <TabItem
            to="/audio"
            value={translations.nav.generateStory[currentLanguage]}
            className="mx-4"
          />
        </div>

        {/* Auth Controls - Right */}
        <div className="flex-none flex items-center space-x-4">
          <div className="relative group">
            <Button
              variant="icon"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Search by user's name or pdf title"
              onClick={() => setIsSearchOpen(true)}
            >
              <MdSearch className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
          <ThemeChanger />
          <Button
            variant="icon"
            size="icon"
            onClick={toggleLanguage}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            title={
              currentLanguage === "en"
                ? "Switch to Bangla"
                : "Switch to English"
            }
          >
            <MdLanguage className="w-6 h-6" />
          </Button>
          {!signedIn ? (
            <>
              <LoginModal />
              {landing && (
                <Link href={"/signup"}>
                  <Button size="sm" variant="primary">
                    {translations.auth.signUpButton[currentLanguage]}
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-5">
              <Notification />
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none outline-none border-none">
                  <div className="flex items-center space-x-2 p-2 transition-colors duration-200">
                    <img
                      src="/profile.png"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <AiOutlineMenu className="text-xl text-gray-600 dark:text-gray-300" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 mr-8 mt-2 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px] z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {translations.auth.signedInAs[currentLanguage]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <DropdownMenuItem className="px-4 py-2 rounded-lg cursor-pointer">
                      <Link
                        href={user.user_role === 'ADMIN' ? `/admin/statistics` : `/dashboard/${user.user_id}/statistics`}
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <span>
                          {translations.profile.dashboard[currentLanguage]}
                        </span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-4 py-2 rounded-lg cursor-pointer">
                      <Link
                        href="/profile/1"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>
                          {translations.profile.viewProfile[currentLanguage]}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <DropdownMenuItem className="px-4 py-2 rounded-lg cursor-pointer">
                      <Button
                        variant="outline"
                        onClick={signOutHandler}
                        className="flex items-center space-x-2 text-red-600 dark:text-red-400 w-full"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>
                          {translations.auth.signOut[currentLanguage]}
                        </span>
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <SearchSidebar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
