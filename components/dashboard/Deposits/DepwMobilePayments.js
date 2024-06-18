"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserData } from "../../../contexts/userrContext";
import { Skeleton } from "../../ui/skeleton";
import { useTheme } from "../../../contexts/themeContext";
import Image from "next/image";

export default function DepwMobilePayments() {
  const { details } = useUserData();
  const [amountForTransfer, setAmountForTransfer] = useState("");

  const handleAmountChange = (e) => {
    setAmountForTransfer(e.target.value);
  };
  const { isDarkMode, baseColor } = useTheme();
  const [data, setData] = useState("");
  const exch = [
    {
      coinName: "Paypal",
      image: "/assets/paypal.webp",
    },
    {
      coinName: "Zelle",
      image: "/assets/zelle.png",
    },
    {
      coinName: "Cashapp",
      image: "/assets/cashapp.png",
    },
    {
      coinName: "Venmo",
      image: "/assets/venmo.png",
    },
  ];
  const handleMethodChange = (value) => {
    setData(value);
  };
  return (
    <div className="p-4">
      {details === 0 ? (
        <div className="w-full px-3">
          <Skeleton
            className={`  h-52 ${isDarkMode ? "bg-[#333]" : "bg-gray-200/80"}`}
          />
        </div>
      ) : (
        <div
          className={`deposits-cont  p-3 rounded-lg transition-all ${
            isDarkMode
              ? "border border-white/10 bg-[#111] text-white/90"
              : "shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
          }`}
        >
          {" "}
          <div
            className={`heading pb-1 flex items-center mt-3 justify-center ${
              isDarkMode ? "text-white/60" : "text-black/80"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>

            <p className="text-sm uppercase">Mobile Payments</p>
          </div>
          <div className="header-text font-bold capitalize text-lg pb-4 w-full text-center">
            Deposit using Mobile Payments
          </div>
          <Select
            className="w-full outline-none /bg-gray-50 py-4"
            onValueChange={handleMethodChange}
          >
            <SelectTrigger
              className={`w-full /bg-gray-50 py-4 ${
                isDarkMode ? "border-0 bg-[#222]" : ""
              }`}
            >
              <SelectValue
                className="font-bold"
                placeholder="Select a Deposit Asset"
              />
            </SelectTrigger>
            <SelectContent
              className={`border-0 ${isDarkMode ? "bg-[#222] text-white" : ""}`}
            >
              <SelectGroup>
                <SelectLabel>Recommended</SelectLabel>
                {exch.map((option) => (
                  <>
                    <SelectItem key={option.coinName} value={option.coinName}>
                      <div className="flex py-2">
                        {" "}
                        <div className="mr-2">
                          <Image
                            src={option.image}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        </div>
                        <div className="font-bold">{option.coinName}</div>
                      </div>
                    </SelectItem>
                  </>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="input my-3 flex  items-center">
            <div className="w-full">
              <input
                type="number"
                min="0"
                value={amountForTransfer}
                onChange={handleAmountChange}
                className={`w-full px-4 py-4 text-sm placeholder:text-muted-foreground rounded-lg /bg-gray-50 font-bold  ${
                  isDarkMode ? "bg-[#222]" : "border"
                }`}
                placeholder="Enter amount in USD"
              />
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="w-full">
              {data && amountForTransfer && amountForTransfer != 0 && (
                <div
                  className={`flex-cont ${
                    amountForTransfer && amountForTransfer != 0
                      ? "bg-[#0052FF] text-white"
                      : "bg-gray-300 text-gray-700"
                  }  py-4 cursor-pointer capitalize flex  items-center font-bold  px-3 justify-center rounded-lg fon-bold text-sm w-full`}
                >
                  <button className="capitalize">Deposit with {data}</button>
                </div>
              )}
            </DialogTrigger>
            <DialogContent
              className={`w-[90%] rounded-lg overflow-hidden ${
                isDarkMode ? `${baseColor} text-white/80 border-0` : ""
              }`}
            >
              <DialogHeader className="font-bold flex items-center">
                <p>Deposit Using {data}</p>
              </DialogHeader>
              <div className="my-2 p-2">
                <div
                  className={`message-cont /border text-sm text-neutral-500 /font-bold  rounded-lg p-2`}
                >
                  <p>
                    To deposit using ({data}), please follow these detailed
                    steps:
                    <ol className="list-decimal list-inside ml-4">
                      <li className="mt-2">
                        <strong className="font-bold text-sm">
                          Contact Live Support:
                        </strong>{" "}
                        Reach out to our live support team to obtain the
                        specific details required for ({data}). You can contact
                        them via the Live Chat help center. They will provide
                        you with the necessary information to proceed with the
                        payment.
                      </li>
                      <li className="mt-2">
                        <strong className="font-bold text-sm">
                          Make the Payment:
                        </strong>{" "}
                        Using the details provided by our support team, complete
                        the {data} payment. Ensure you follow all the
                        instructions carefully to avoid any errors.
                      </li>
                      <li className="mt-2">
                        <strong className="font-bold text-sm">
                          Obtain Proof of Payment:
                        </strong>{" "}
                        After making the payment, take a screenshot or obtain a
                        receipt as proof of the transaction. This proof should
                        clearly show the payment details, such as the amount,
                        date, and transaction ID.
                      </li>
                      <li className="mt-2">
                        <strong className="font-bold text-sm">
                          Send Payment Proof:
                        </strong>{" "}
                        Send the screenshot or receipt of your payment proof to
                        our support team for verification. You can send this via
                        the Live Chat help center. Our team will review and
                        verify your payment to complete the deposit process.
                      </li>
                    </ol>
                  </p>
                </div>
              </div>

              <DialogClose>
                {" "}
                <div
                  className={`flex-cont bg-[#0052FF] py-4 cursor-pointer capitalize flex  items-center font-bold  px-3 justify-center rounded-lg fon-bold text-sm w-full`}
                >
                  <button className="capitalize text-white">Got it!!</button>
                </div>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
