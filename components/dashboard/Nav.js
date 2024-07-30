"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sheeet from "./sheeet";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import axios from "axios";
import { useUserData } from "../../contexts/userrContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { useTheme } from "../../contexts/themeContext";
import { ScrollArea } from "../ui/scroll-area";

export default function Nav() {
  const router = useRouter();
  const { isDarkMode, baseColor, toggleTheme } = useTheme();
  const { coinPrices, setCoinPrices } = useUserData();
  const [loading, isloading] = useState(false);
  const { details, email, setDetails } = useUserData();
  const deposits = [
    {
      coinName: "Bitcoin",
      short: "Bitcoin",
      image: "/assets/bitcoin.webp",
      address: "0xiohxhihfojdokhijkhnofwefodsdhfodhod",
    },
    {
      coinName: "Ethereum",
      short: "Ethereum",
      image: "/assets/ethereum.webp",
      address: "0xiohxhihfojhijkhnowefodsdhfodhod",
    },
    {
      coinName: "Tether USDT",
      short: "Tether",
      image: "/assets/Tether.webp",
      address: "0Xxiohxhihfookhijkhnofwefodsdhfodhod",
    },
  ];
  const handleReadNotif = async () => {
    if (!details.isReadNotifications) {
      try {
        // Send a POST request to mark notifications as read
        const response = await axios.post(`/notifs/readNotifs/api`, { email });

        if (response.status === 200) {
          // Notifications marked as read successfully
          // Now, you can update the user's details to set isReadNotifications to true
          setDetails((prevDetails) => ({
            ...prevDetails,
            isReadNotifications: true,
          }));
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to mark notifications as read:", response.data);
        }
      } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("Error marking notifications as read:", error);
      }
    }
  };
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (details.notifications && details.notifications.length > 0) {
      setNotifications(details.notifications);
    }
  }, [details]);

  // ...

  const formatRelativeTime = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Calculate the relative time to now
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Map over notifications and format the date as relative time for each
  const formattedNotifications = notifications
    ? notifications.map((notification) => ({
        ...notification,
        date: formatRelativeTime(notification.date), // Format as relative time
      }))
    : [];
  const sortedNotifications = formattedNotifications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Compare dates in descending order (newest first)
  });

  const handleNotificationClick = (id) => {
    isloading(true);
    // Send a DELETE request to the backend API to delete the notification
    axios
      .delete(`/notifs/deleteNotifs/api/${id}/${email}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotifications = notifications.filter(
            (notification) => notification.id !== id
          );
          setNotifications(updatedNotifications);
          isloading(false);
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to delete notification:", response.data);
          isloading(false);
        }
      })
      .catch((error) => {
        // Handle network errors or other unexpected errors
        console.error("Error deleting notification:", error);
        isloading(false);
      });
  };
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        // Create an array of coin symbols for API request
        const coinSymbols = deposits.map((coin) => coin.short.toLowerCase());

        // API request to fetch coin prices
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinSymbols.join(
            ","
          )}&vs_currencies=usd`
        );

        // Update coinPrices state with fetched prices
        setCoinPrices(response.data);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
      }
    };

    fetchCoinPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    // Remove the "token" cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logout page or any other desired action
    router.replace("/auth"); // Replace "/logout" with your actual logout route
  };

  return (
    <>
      <div
        className={`nav-container flex justify-between ${
          isDarkMode
            ? `${baseColor} text-white border border-white/5`
            : "text-slate-900 border-b bg-white"
        } duration-300  items-center py-3 px-5 transition-colors  `}
      >
        <div className="burger md:hidden cursor-pointer">
          <Sheet className="p-0">
            <SheetTrigger>
              <div className="burger-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={`px-4 ${
                isDarkMode ? `${baseColor} text-gray-200 border-0` : ""
              }`}
            >
              <Sheeet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="title hidden md:flex">
          <h2 className="font-bold">
            <svg
              width="177"
              height="48"
              viewBox="0 0 177 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1366_622)">
                <path
                  d="M64.0001 25.7251L39.8579 36.0046C37.8559 36.8525 36.1747 37.2765 34.8144 37.2765C33.2744 37.2765 32.1574 36.737 31.4635 35.6581C31.0281 34.9651 30.8998 34.086 31.0785 33.0208C31.2582 31.9557 31.733 30.8199 32.503 29.6136C33.1447 28.6373 34.1975 27.354 35.6614 25.7636C35.1642 26.5453 34.7999 27.4039 34.5834 28.3046C34.1984 29.9473 34.5449 31.1536 35.6229 31.9236C36.1362 32.2829 36.8421 32.4626 37.7404 32.4626C38.4581 32.4626 39.2666 32.3471 40.1659 32.1161L64.0001 25.7251Z"
                  fill="#0052FF"
                />
              </g>
              <path
                d="M4.584 29.704L0.48 28.936C1.248 25.832 2.048 23.024 2.88 20.512C3.728 18 4.6 15.848 5.496 14.056C6.392 12.264 7.304 10.888 8.232 9.928C9.176 8.952 10.12 8.464 11.064 8.464C12.968 8.464 14.72 10.232 16.32 13.768C17.92 17.288 19.28 22.392 20.4 29.08L16.152 29.656C15.96 28.6 15.752 27.52 15.528 26.416C15.304 25.296 15.072 24.208 14.832 23.152C14.448 23.136 14.032 23.128 13.584 23.128C12.8 23.128 11.968 23.144 11.088 23.176C10.224 23.208 9.368 23.264 8.52 23.344C7.688 23.408 6.912 23.48 6.192 23.56C5.888 24.584 5.592 25.624 5.304 26.68C5.032 27.72 4.792 28.728 4.584 29.704ZM9 15.688C8.648 16.44 8.176 17.656 7.584 19.336C8.272 19.256 9 19.2 9.768 19.168C10.536 19.12 11.288 19.096 12.024 19.096C12.648 19.096 13.248 19.112 13.824 19.144C13.6 18.328 13.384 17.6 13.176 16.96C12.984 16.32 12.808 15.816 12.648 15.448C12.312 14.584 12.016 13.976 11.76 13.624C11.504 13.256 11.24 13.072 10.968 13.072C10.68 13.072 10.392 13.264 10.104 13.648C9.816 14.016 9.448 14.696 9 15.688ZM79.0343 29.752C78.9863 28.168 78.9623 26.648 78.9623 25.192C78.9623 22.568 79.0423 20.192 79.2023 18.064C79.3623 15.936 79.5943 14.128 79.8983 12.64C80.0423 11.952 80.2423 11.288 80.4983 10.648C80.7703 10.008 81.1463 9.488 81.6263 9.088C82.1223 8.672 82.7703 8.464 83.5703 8.464C84.3543 8.464 85.0183 8.672 85.5623 9.088C86.1063 9.488 86.5463 9.976 86.8823 10.552C87.2343 11.128 87.4903 11.68 87.6503 12.208C88.0663 13.456 88.4183 14.704 88.7063 15.952C88.9943 17.2 89.2503 18.392 89.4743 19.528C89.6343 18.696 89.8183 17.824 90.0262 16.912C90.2343 15.984 90.4423 15.112 90.6503 14.296C90.8583 13.464 91.0503 12.776 91.2263 12.232C92.0423 9.72 93.2983 8.464 94.9943 8.464C95.9383 8.464 96.7383 8.808 97.3943 9.496C98.0503 10.168 98.5303 11.144 98.8343 12.424C98.9783 13 99.1223 13.84 99.2663 14.944C99.4263 16.048 99.5703 17.36 99.6983 18.88C99.8423 20.384 99.9623 22.048 100.058 23.872C100.17 25.696 100.258 27.632 100.322 29.68L96.0983 29.584C96.0983 28.736 96.0743 27.752 96.0263 26.632C95.9943 25.512 95.9383 24.352 95.8583 23.152C95.7943 21.936 95.7143 20.752 95.6183 19.6C95.5383 18.448 95.4503 17.408 95.3543 16.48C95.2743 15.552 95.1943 14.816 95.1143 14.272C95.0343 13.712 94.9623 13.432 94.8983 13.432C94.8823 13.432 94.7943 13.72 94.6343 14.296C94.4903 14.856 94.3063 15.608 94.0823 16.552C93.8743 17.496 93.6423 18.536 93.3863 19.672C93.1303 20.808 92.8743 21.952 92.6183 23.104C92.3783 24.24 92.1623 25.296 91.9703 26.272C91.7783 27.232 91.6263 28.016 91.5143 28.624L87.7463 28.72C87.5543 27.824 87.3223 26.84 87.0503 25.768C86.7943 24.68 86.5223 23.576 86.2343 22.456C85.9623 21.32 85.6903 20.232 85.4183 19.192C85.1463 18.136 84.8903 17.192 84.6503 16.36C84.4263 15.528 84.2423 14.872 84.0983 14.392C83.9543 13.896 83.8663 13.648 83.8343 13.648C83.7703 13.648 83.6983 14 83.6183 14.704C83.5543 15.392 83.4903 16.328 83.4263 17.512C83.3623 18.696 83.3063 20.032 83.2583 21.52C83.2263 23.008 83.2103 24.544 83.2103 26.128C83.2103 26.88 83.2103 27.568 83.2103 28.192C83.2263 28.816 83.2423 29.328 83.2583 29.728L79.0343 29.752Z"
                fill="#0052FF"
              />
              <path
                d="M22.1799 34.816C22.0679 33.536 21.9879 32.248 21.9399 30.952C21.8919 29.656 21.8679 28.16 21.8679 26.464C21.8679 24.4 21.8999 22.344 21.9639 20.296C22.0279 18.248 22.1239 16.376 22.2519 14.68L26.3799 14.8C26.3319 15.168 26.2919 15.56 26.2599 15.976C26.8359 15.592 27.4519 15.312 28.1079 15.136C28.7799 14.96 29.4599 14.872 30.1479 14.872C31.0279 14.872 31.8839 15.016 32.7159 15.304C33.5479 15.576 34.2999 16.016 34.9719 16.624C35.6439 17.216 36.1719 17.984 36.5559 18.928C36.9559 19.872 37.1559 21.008 37.1559 22.336C37.1559 23.648 36.9559 24.792 36.5559 25.768C36.1559 26.744 35.6199 27.544 34.9479 28.168C34.2759 28.808 33.5239 29.28 32.6919 29.584C31.8599 29.904 31.0039 30.064 30.1239 30.064C28.5079 30.064 27.0839 29.584 25.8519 28.624C25.8839 29.648 25.9319 30.632 25.9959 31.576C26.0599 32.536 26.1399 33.512 26.2359 34.504L22.1799 34.816ZM29.4999 18.856C27.9159 18.856 26.7239 19.632 25.9239 21.184C25.8759 22.144 25.8439 23.12 25.8279 24.112C26.2119 24.624 26.7079 25.072 27.3159 25.456C27.9239 25.824 28.6999 26.008 29.6439 26.008C31.8999 26.008 33.0279 24.72 33.0279 22.144C33.0279 21.456 32.8999 20.896 32.6439 20.464C32.3879 20.032 32.0679 19.704 31.6839 19.48C31.2999 19.24 30.9079 19.08 30.5079 19C30.1079 18.904 29.7719 18.856 29.4999 18.856ZM46.1578 29.92C44.6218 29.92 43.2698 29.616 42.1018 29.008C40.9498 28.416 40.0458 27.584 39.3898 26.512C38.7498 25.44 38.4298 24.2 38.4298 22.792C38.4298 21.944 38.5738 21.056 38.8618 20.128C39.1498 19.184 39.6138 18.304 40.2538 17.488C40.8938 16.672 41.7338 16.008 42.7738 15.496C43.8298 14.984 45.1098 14.728 46.6138 14.728C47.7018 14.728 48.6138 14.848 49.3498 15.088C50.1018 15.328 50.7098 15.64 51.1738 16.024C51.6538 16.408 52.0138 16.816 52.2538 17.248C52.5098 17.68 52.6778 18.096 52.7578 18.496C52.8538 18.88 52.9018 19.2 52.9018 19.456C52.9018 21.008 52.2458 22.208 50.9338 23.056C49.6378 23.888 47.7978 24.304 45.4138 24.304C44.8698 24.304 44.3498 24.28 43.8538 24.232C43.3738 24.184 42.9258 24.128 42.5098 24.064C42.8138 24.864 43.3178 25.456 44.0218 25.84C44.7258 26.208 45.4538 26.392 46.2058 26.392C47.2938 26.392 48.2538 26.2 49.0858 25.816C49.9178 25.416 50.7018 24.808 51.4378 23.992L53.5738 27.064C53.0618 27.48 52.4858 27.912 51.8458 28.36C51.2218 28.808 50.4538 29.176 49.5418 29.464C48.6298 29.768 47.5018 29.92 46.1578 29.92ZM46.6858 18.328C45.7418 18.328 44.9098 18.568 44.1898 19.048C43.4698 19.528 42.9418 20.16 42.6058 20.944C43.0058 21.008 43.3978 21.064 43.7818 21.112C44.1818 21.144 44.5738 21.16 44.9578 21.16C45.3098 21.16 45.7098 21.128 46.1578 21.064C46.6218 21 47.0698 20.904 47.5018 20.776C47.9498 20.648 48.3178 20.488 48.6058 20.296C48.8938 20.088 49.0378 19.848 49.0378 19.576C49.0378 19.448 48.9738 19.288 48.8458 19.096C48.7178 18.904 48.4858 18.728 48.1498 18.568C47.8138 18.408 47.3258 18.328 46.6858 18.328ZM58.2413 30.04L55.2173 27.424C55.9853 26.528 56.8093 25.624 57.6893 24.712C58.5693 23.784 59.4733 22.864 60.4013 21.952C59.2813 20.976 58.2333 20.104 57.2573 19.336C56.2973 18.552 55.5533 18 55.0253 17.68L57.4253 14.512C58.2893 15.136 59.2253 15.848 60.2333 16.648C61.2413 17.448 62.2573 18.296 63.2813 19.192C64.2253 18.328 65.1533 17.488 66.0653 16.672C66.9773 15.84 67.8493 15.056 68.6813 14.32L71.4653 17.2C70.9533 17.568 70.2253 18.176 69.2812 19.024C68.3373 19.856 67.3133 20.784 66.2093 21.808C67.2653 22.768 68.2573 23.72 69.1853 24.664C70.1293 25.592 70.9613 26.456 71.6813 27.256L68.7533 29.92C68.4653 29.568 68.0493 29.112 67.5052 28.552C66.9613 27.992 66.3293 27.368 65.6093 26.68C64.9053 25.992 64.1533 25.288 63.3533 24.568C62.5853 25.32 61.8573 26.048 61.1693 26.752C60.4973 27.456 59.9053 28.088 59.3933 28.648C58.8813 29.224 58.4973 29.688 58.2413 30.04ZM108.637 29.896C107.437 29.896 106.349 29.584 105.373 28.96C104.397 28.352 103.621 27.528 103.045 26.488C102.485 25.432 102.205 24.256 102.205 22.96C102.205 21.744 102.429 20.648 102.877 19.672C103.325 18.68 103.933 17.832 104.701 17.128C105.485 16.424 106.373 15.888 107.365 15.52C108.357 15.136 109.397 14.944 110.485 14.944C111.397 14.944 112.293 15.072 113.173 15.328C113.237 14.992 113.293 14.656 113.341 14.32L117.445 15.016C117.333 15.32 117.221 15.776 117.109 16.384C116.997 16.992 116.901 17.672 116.821 18.424C116.757 19.176 116.701 19.928 116.653 20.68C116.605 21.432 116.581 22.112 116.581 22.72C116.581 23.216 116.613 23.704 116.677 24.184C116.757 24.648 116.917 25.032 117.157 25.336C117.397 25.624 117.765 25.768 118.261 25.768H118.597L117.997 29.944C116.941 29.944 116.069 29.76 115.381 29.392C114.693 29.04 114.141 28.56 113.725 27.952C113.037 28.72 112.253 29.232 111.373 29.488C110.493 29.76 109.581 29.896 108.637 29.896ZM106.141 23.44C106.221 24.208 106.533 24.824 107.077 25.288C107.637 25.736 108.341 25.96 109.189 25.96C110.005 25.96 110.685 25.744 111.229 25.312C111.773 24.864 112.221 24.256 112.573 23.488C112.557 23.232 112.549 22.968 112.549 22.696C112.549 22.136 112.565 21.56 112.597 20.968C112.629 20.376 112.669 19.792 112.717 19.216C112.045 18.96 111.341 18.832 110.605 18.832C109.741 18.832 108.965 19.008 108.277 19.36C107.605 19.696 107.077 20.168 106.693 20.776C106.309 21.384 106.117 22.088 106.117 22.888C106.117 22.984 106.117 23.08 106.117 23.176C106.117 23.272 106.125 23.36 106.141 23.44ZM120.001 29.872C120.065 28.544 120.113 27.216 120.145 25.888C120.177 24.56 120.193 23.248 120.193 21.952C120.177 20.768 120.153 19.6 120.121 18.448C120.105 17.28 120.065 16.152 120.001 15.064L124.033 14.944C124.049 15.536 124.073 16.144 124.105 16.768C124.617 16.128 125.209 15.616 125.881 15.232C126.569 14.832 127.353 14.632 128.233 14.632C128.569 14.632 129.001 14.68 129.529 14.776C130.057 14.872 130.593 15.056 131.137 15.328L130.681 19.384C130.281 19.144 129.849 18.976 129.385 18.88C128.937 18.768 128.561 18.712 128.257 18.712C127.233 18.712 126.361 19.176 125.641 20.104C124.937 21.016 124.457 22.288 124.201 23.92C124.201 25.04 124.185 26.112 124.153 27.136C124.137 28.144 124.097 29.056 124.033 29.872H120.001ZM132.289 29.752C132.225 28.984 132.169 28 132.121 26.8C132.089 25.6 132.073 24.296 132.073 22.888C132.073 21.64 132.081 20.352 132.097 19.024C132.129 17.696 132.169 16.392 132.217 15.112C132.281 13.816 132.345 12.608 132.409 11.488C132.489 10.352 132.577 9.36 132.673 8.512L136.849 8.8C136.625 10.432 136.449 12.088 136.321 13.768C136.209 15.432 136.137 17.128 136.105 18.856C137.001 18.232 138.041 17.576 139.225 16.888C140.425 16.184 141.865 15.392 143.545 14.512L145.801 18.28C144.073 18.824 142.545 19.448 141.217 20.152C139.889 20.84 138.801 21.536 137.953 22.24C137.793 22.352 137.689 22.432 137.641 22.48C137.593 22.528 137.569 22.56 137.569 22.576C137.569 22.672 137.833 22.848 138.361 23.104C139.065 23.472 139.793 23.832 140.545 24.184C141.297 24.536 142.137 24.896 143.065 25.264C143.993 25.616 145.057 25.992 146.257 26.392L144.601 29.944C143.145 29.512 141.689 28.968 140.233 28.312C138.777 27.656 137.457 26.992 136.273 26.32C136.289 26.864 136.313 27.416 136.345 27.976C136.393 28.536 136.433 29.096 136.465 29.656L132.289 29.752ZM154.509 29.92C152.973 29.92 151.621 29.616 150.453 29.008C149.301 28.416 148.397 27.584 147.741 26.512C147.101 25.44 146.781 24.2 146.781 22.792C146.781 21.944 146.925 21.056 147.213 20.128C147.501 19.184 147.965 18.304 148.605 17.488C149.245 16.672 150.085 16.008 151.125 15.496C152.181 14.984 153.461 14.728 154.965 14.728C156.053 14.728 156.965 14.848 157.701 15.088C158.453 15.328 159.061 15.64 159.525 16.024C160.005 16.408 160.365 16.816 160.605 17.248C160.861 17.68 161.029 18.096 161.109 18.496C161.205 18.88 161.253 19.2 161.253 19.456C161.253 21.008 160.597 22.208 159.285 23.056C157.989 23.888 156.149 24.304 153.765 24.304C153.221 24.304 152.701 24.28 152.205 24.232C151.725 24.184 151.277 24.128 150.861 24.064C151.165 24.864 151.669 25.456 152.373 25.84C153.077 26.208 153.805 26.392 154.557 26.392C155.645 26.392 156.605 26.2 157.437 25.816C158.269 25.416 159.053 24.808 159.789 23.992L161.925 27.064C161.413 27.48 160.837 27.912 160.197 28.36C159.573 28.808 158.805 29.176 157.893 29.464C156.981 29.768 155.853 29.92 154.509 29.92ZM155.037 18.328C154.093 18.328 153.261 18.568 152.541 19.048C151.821 19.528 151.293 20.16 150.957 20.944C151.357 21.008 151.749 21.064 152.133 21.112C152.533 21.144 152.925 21.16 153.309 21.16C153.661 21.16 154.061 21.128 154.509 21.064C154.973 21 155.421 20.904 155.853 20.776C156.301 20.648 156.669 20.488 156.957 20.296C157.245 20.088 157.389 19.848 157.389 19.576C157.389 19.448 157.325 19.288 157.197 19.096C157.069 18.904 156.837 18.728 156.501 18.568C156.165 18.408 155.677 18.328 155.037 18.328ZM170.985 29.896C170.025 29.896 169.265 29.688 168.705 29.272C168.145 28.872 167.737 28.312 167.481 27.592C167.225 26.872 167.057 26.048 166.977 25.12C166.913 24.192 166.881 23.216 166.881 22.192C166.881 21.136 166.921 20.04 167.001 18.904C165.929 19.048 164.897 19.232 163.905 19.456L163.161 15.688C164.489 15.336 165.905 15.08 167.409 14.92C167.521 14.104 167.641 13.248 167.769 12.352C167.897 11.44 168.041 10.48 168.201 9.472L172.329 9.832C172.137 10.664 171.969 11.496 171.825 12.328C171.681 13.144 171.553 13.936 171.441 14.704C172.337 14.704 173.177 14.728 173.961 14.776C174.761 14.808 175.497 14.872 176.169 14.968L175.689 18.736C175.129 18.672 174.545 18.632 173.937 18.616C173.345 18.584 172.745 18.568 172.137 18.568C171.769 18.568 171.401 18.576 171.033 18.592C170.937 19.76 170.873 20.76 170.841 21.592C170.825 22.424 170.817 23.016 170.817 23.368C170.817 24.248 170.865 24.88 170.961 25.264C171.073 25.648 171.249 25.84 171.489 25.84C171.761 25.84 172.065 25.752 172.401 25.576C172.737 25.384 173.065 25.128 173.385 24.808C173.721 24.488 174.001 24.144 174.225 23.776L176.073 27.64C174.489 29.144 172.793 29.896 170.985 29.896Z"
                fill={` ${isDarkMode ? "white" : "#111"}`}
              />
              <defs>
                <clipPath id="clip0_1366_622">
                  <rect
                    width="33"
                    height="33"
                    fill="white"
                    transform="translate(31 15)"
                  />
                </clipPath>
              </defs>
            </svg>
          </h2>
        </div>{" "}
        {details === 0 ? (
          <div className="flex items-center gap-x-3">
            {" "}
            <Skeleton
              className={`md:w-52 md:h-10 rounded-md  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              }  w-24 h-10`}
            />
            <Skeleton
              className={`md:w-52 md:h-10 md:rounded-sm  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10 rounded-full`}
            />
            <Skeleton
              className={`md:w-10 md:h-10 rounded-full ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10`}
            />
          </div>
        ) : (
          <div className="nav-tools text-sm flex items-center">
            <Select defaultValue="Balance">
              <SelectTrigger
                className={`${isDarkMode ? "border border-[#222]" : "border"}`}
              >
                <SelectValue className="outline-none " />
              </SelectTrigger>
              <SelectContent
                className={`outline-none focus:outline-none ${
                  isDarkMode ? `${baseColor} text-white border-0` : ""
                }`}
              >
                <SelectItem value="Balance">
                  <div className="flex items-center py-2">
                    <div className="w-5 h-5 ">
                      {" "}
                      <Image
                        alt=""
                        src="/assets/dollar.png"
                        width={1000}
                        height={10000}
                      />
                    </div>
                    <div className="text-sm font-bold mx-2">
                      <code>{details.tradingBalance.toLocaleString()}</code>
                    </div>
                  </div>
                </SelectItem>
                {deposits.map((deps, index) => (
                  <div key={deps.coinName}>
                    <SelectItem key={deps.coinName} value={deps.coinName}>
                      <div className="flex items-center py-2">
                        <div className="image">
                          <Image
                            src={deps.image}
                            alt=""
                            width={20}
                            height={15}
                          />
                        </div>
                        <div className="price text-sm mx-2 font-bold">
                          {details !== 0 && details !== null ? (
                            <code>
                              {coinPrices[deps.short.toLowerCase()]
                                ? (
                                    details.tradingBalance /
                                    coinPrices[deps.short.toLowerCase()].usd
                                  ).toFixed(5)
                                : "0.00"}
                            </code>
                          ) : (
                            <span>calculating...</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger onClick={handleReadNotif}>
                <div className="notif-cont  ml-3 relative">
                  <div
                    className={` flex font-bold ${
                      isDarkMode
                        ? `md:bg-[#0052FF10] text-[#0052FF]`
                        : "md:bg-[#0052FF10] text-[#0052FF]"
                    } rounded-full md:rounded-lg md:px-3 md:py-3`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="md:w-5 md:h-5 w-5 h-5 md:mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.076 32.903 32.903 0 01-3.256.508 3.5 3.5 0 01-6.972 0 32.91 32.91 0 01-3.256-.508.75.75 0 01-.515-1.076A11.448 11.448 0 004 8zm6 7c-.655 0-1.305-.02-1.95-.057a2 2 0 003.9 0c-.645.038-1.295.057-1.95.057zM8.75 6a.75.75 0 000 1.5h1.043L8.14 9.814A.75.75 0 008.75 11h2.5a.75.75 0 000-1.5h-1.043l1.653-2.314A.75.75 0 0011.25 6h-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={`hidden md:block  ${
                        isDarkMode ? "text-[#0052FF]" : "text-[#0052FF]"
                      }`}
                    >
                      Notifications
                    </div>
                  </div>

                  {!details.isReadNotifications && (
                    <div className="notifier-dot absolute md:-right-1 right-0  top-0">
                      <div className="dot bg-red-500 md:w-3 md:h-3 animate__rubberBand animate__animated animate__infinite rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[350px] md:w-[400px] mx-3 pb-0 pt-4 px-1 relative overflow-hidden ${
                  isDarkMode ? "bg-[#222] border-white/5 text-gray-200" : ""
                }`}
              >
                <div className="tit px-3">
                  <div className="flex w-full justify-between items-center pb-4">
                    <div
                      className={`title-name font-bold ${
                        isDarkMode ? "text-white" : "text-black/90"
                      }`}
                    >
                      Notifications
                    </div>
                    <div className="titcount fleex">
                      <div className=" ">
                        <div
                          className={`py-1 px-2 rounded-full text-xs font-bold ${
                            isDarkMode ? "bg-[#333]" : "bg-black/5"
                          }`}
                        >
                          {notifications.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`line w-1/2 mx-auto mb-2 h-0.5  rounded-full ${
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    }`}
                  ></div>
                </div>
                <div className="cont ">
                  {notifications.length === 0 && (
                    <>
                      {" "}
                      <div className="message text-center text-sm py-4">
                        No notifications yet
                      </div>
                    </>
                  )}
                  {loading && (
                    <div
                      className={`loader-overlay absolute w-full h-full ${
                        isDarkMode ? "bg-black" : "bg-white"
                      } opacity-60 left-0 top-0 blur-2xl z-50`}
                    ></div>
                  )}
                  {notifications.length !== 0 && (
                    <>
                      <div>
                        <div className=" max-h-[300px] overflow-scroll overflow-x-hidden w-full px-3 py-3">
                          {sortedNotifications.reverse().map((notif, index) => (
                            <>
                              <div
                                className={`flex justify-between w-full items-start cursor-pointer transition-all`}
                                key={crypto.randomUUID()}
                              >
                                <div className="icon flex items-center flex-col">
                                  <div
                                    className={`${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } rounded-full p-3`}
                                  >
                                    {notif.type === "trade" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "transaction" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "intro" ? (
                                      <>🤝</>
                                    ) : notif.type === "verification" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-sm"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div
                                    className={`linedwon   ${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } ${
                                      index !== notifications.length - 1
                                        ? "h-11 border border-dashed border-white/5"
                                        : ""
                                    }`}
                                    key={crypto.randomUUID()}
                                  ></div>
                                </div>
                                <div className="message w-full text-sm mx-2">
                                  <div
                                    className={`pb-1 pt-1 ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-black/90 font-bold"
                                    }`}
                                  >
                                    {" "}
                                    {notif.message}
                                  </div>
                                  <div
                                    className={`date text-xs capitalize ${
                                      isDarkMode ? "opacity-40" : "opacity-80"
                                    }`}
                                  >
                                    {notif.date}
                                  </div>
                                </div>
                                <div
                                  className="actiom pt-3 h-full /w-full"
                                  onClick={() =>
                                    handleNotificationClick(notif.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`w-4 h-4 ${
                                      isDarkMode
                                        ? "text-white/50 hover:text-white/80"
                                        : "text-black/30 hover:text-black/50"
                                    }`}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <button
              className={`theme-toggler  md:p-3  ${
                isDarkMode
                  ? "md:bg-[#0052FF20] text-[#0052FF] "
                  : "md:bg-[#0052FF10] text-[#0052FF]"
              } rounded-full mx-5 md:mx-2`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Popover>
              <PopoverTrigger>
                <div
                  className={`flex font-bold text-[#0052FF] rounded-full md:p-3 ${
                    isDarkMode ? "md:bg-[#0052FF20]" : "md:bg-[#0052FF10]"
                  } md:mr-5 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[300px] mx-3  p-1   ${
                  isDarkMode ? "bg-[#111] text-white border border-white/5" : ""
                }`}
              >
                {/* <div className="header-title py-4 px-4 font-bold">
                  <h1 className="bgname text-lg">Menus</h1>
                </div> */}
                <div className="content1 grid grid-cols-3 gap-y-4 py-3 pt-5 gap-x-3 px-3">
                  <Link href="/dashboard/account" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/profile.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Profile</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/deposits" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/wallet.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Deposit</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/withdrawals" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/withdraw.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Withdraw</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/markets" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3 relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="identifier absolute -top-1 -right-2">
                        <div className="px-2  font-normal bg-green-500 rounded-md text-white  text-[10px]">
                          Live
                        </div>
                      </div>
                      <Image
                        alt=""
                        src="/assets/increase.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Tradings</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/investments" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/money.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Subscription</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/verify" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="verification-identifier absolute -top-1 -right-2">
                        {details.isVerified ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-green-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-red-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <Image
                        alt=""
                        src="/assets/veraccount.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Verification</p>
                    </div>
                  </Link>
                </div>{" "}
                <div className="relative w-full flex items-center justify-center pt-4">
                  <div
                    className={` line h-0.5 w-1/2 mx-auto top-0 left-0 ${
                      isDarkMode ? "bg-white/5" : "bg-black/10"
                    } rounded-full`}
                  ></div>
                </div>
                <div
                  className={`logout flex items-center text-sm py-3 mb-4 mx-3 rounded-md text-red-600 mt-4 ${
                    isDarkMode
                      ? "bg-red-500/10 /border /border-red-600 font-bold"
                      : "bg-red-50"
                  } px-2 font-bold cursor-pointer`}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06 6.5 6.5 0 109.192 0 .75.75 0 111.06-1.06 8 8 0 11-11.313 0 .75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
