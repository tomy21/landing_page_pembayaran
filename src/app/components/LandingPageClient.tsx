"use client";
import React, { useEffect, useRef, useState } from "react";
import QrisWithPopup from "./QrisAction";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { decryptData, encryptData } from "../helper/CryptoUtils";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { GoCheckCircle, GoChecklist } from "react-icons/go";

export default function LandingPageClient() {
  const searchParams = useSearchParams();
  const p1 = searchParams.get("p1");
  const p2 = searchParams.get("p2");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [qrContent, setQrContent] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [terminalId, setTerminalId] = useState<string | null>(null);
  const [tariffData, setTariffData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [qrExpired, setQrExpired] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);

  // Countdown handler
  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setQrExpired(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const generateQris = async (
    vehicleType: string,
    tariff: number,
    expire: number
  ) => {
    setLoading(true);
    const mpmRes = await fetch("/api/generateMPM", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          NMID: p1 || "",
          transactionNo: p2 || "",
          ProductName: vehicleType,
          amount: tariff || 0,
          expiry: expire.toString(),
        },
      }),
    });

    const mpmResult = await mpmRes.json();
    if (mpmResult.responseCode === "2004700") {
      setQrContent(mpmResult.qrContent);
      setMerchantName(mpmResult.merchantName);
      setStoreId(mpmResult.storeId);
      setTerminalId(mpmResult.terminalId);
      setQrExpired(false);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error("Gagal membuat QRIS baru");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        login: "SKY_TOMY-SOEHARTO",
        password: process.env.NEXT_PUBLIC_PASSWORD?.toString() || "",
        storeID: p1 || "",
        transactionNo: p2 || "",
      };

      const encryptedPayload = encryptData(payload);

      console.log(encryptedPayload);
      const tariffRes = await fetch("/api/inquiry-tariff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: encryptedPayload,
      });

      const tariffResult = await tariffRes.json();
      const decryptedData = decryptData(tariffResult.data);

      if (!decryptedData || decryptedData.responseCode !== "211000") {
        throw new Error("Invalid response");
      }

      const { vehicleType, tariff, inTime } = decryptedData.data;

      if (decryptedData.data.paymentStatus !== "PAID") {
        setIsPayment(false);
      }

      setTariffData(decryptedData.data);

      // Hitung selisih waktu
      const now = new Date(); // Waktu sekarang
      const inTimeDate = new Date(inTime); // Misalnya dari server atau API
      const minutesNow = inTimeDate.getMinutes().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const totalSelisih = Number(minutesNow) - Number(minutes);
      console.log(totalSelisih);
      // Atur countdown berdasarkan selisih menit saja
      let displayMinute;
      if (totalSelisih <= 1) {
        displayMinute = 0.5; // 30 detik
      } else if (totalSelisih < 5) {
        displayMinute = totalSelisih;
      } else if (totalSelisih <= 0) {
        displayMinute = 5;
      } else {
        displayMinute = 5; // selalu default ke 3 menit
      }

      setCountdown(displayMinute * 60);

      await generateQris(vehicleType, tariff, displayMinute * 60);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTariff = async () => {
    if (!tariffData) return;
    await fetchData();

    // Mulai polling 5 detik
    intervalRef.current = setInterval(fetchData, 5000);

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  };

  useEffect(() => {
    if (p1 && p2) fetchData();
  }, [p1, p2]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6 relative border border-gray-200">
        {tariffData && (
          <div className="flex flex-col justify-center items-center gap-y-2 bg-yellow-50 py-4 px-6 rounded-xl mb-4 border border-yellow-300">
            <div className="flex justify-between items-start w-full">
              <h1 className="text-sm font-bold">Location</h1>
              <h1 className="text-sm text-slate-500">
                {tariffData?.location || "-"}
              </h1>
            </div>
            <div className="flex justify-between items-start w-full">
              <h1 className="text-sm font-bold">In Time</h1>
              <h1 className="text-sm text-slate-500">
                {tariffData?.inTime
                  ? format(new Date(tariffData.inTime), "dd-MMM-yyyy HH:mm", {
                      locale: id,
                    })
                  : "-"}
              </h1>
            </div>
            <div className="flex justify-between items-start w-full">
              <h1 className="text-sm font-bold">Tariff</h1>
              <h1 className="text-sm text-slate-500">
                Rp {tariffData?.tariff?.toLocaleString("id-ID") || "-"}
              </h1>
            </div>
            <div className="flex justify-between items-start w-full">
              <h1 className="text-sm font-bold">Status Payment</h1>
              <h1
                className={`text-sm ${
                  tariffData?.paymentStatus === "PAID"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {tariffData?.paymentStatus || "-"}
              </h1>
            </div>
          </div>
        )}

        {!isPayment ? (
          <>
            {tariffData?.paymentStatus !== "PAID" && countdown > 0 && (
              <div className="text-center">
                <p className="text-lg font-semibold text-orange-600 animate-pulse">
                  {formatTime(countdown)}
                </p>
              </div>
            )}

            {qrExpired && (
              <div className="flex justify-center">
                <button
                  onClick={handleRefreshTariff}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Perbarui Tarif
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/qris-logo.png"
                  alt="QRIS Logo"
                  width={70}
                  height={70}
                />
                <div>
                  <h1 className="text-xs font-bold">QR Code Standar</h1>
                  <p className="text-xs">Pembayaran Nasional</p>
                </div>
              </div>
              <Image
                src="/gpn-logo.png"
                alt="GPN Logo"
                width={30}
                height={30}
              />
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              {tariffData?.paymentStatus === "PAID" ? (
                <div className="flex flex-col items-center text-center text-green-500 font-semibold text-sm">
                  <GoCheckCircle size={100} className="text-green-600 mb-2" />
                  <p>Pembayaran Berhasil</p>
                </div>
              ) : !qrExpired ? (
                <div className="flex flex-col items-center space-y-2">
                  <QrisWithPopup
                    qrContent={qrContent?.toString() || ""}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-red-500 font-semibold text-sm">
                  <p>QRIS sudah expired,</p>
                  <p>silahkan perbarui tarif.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center w-full mt-5">
              <h1 className="text-2xl font-semibold text-slate-600">
                Pembayaran Berhasil
              </h1>
              <GoChecklist size={200} className="text-4xl text-green-500" />
            </div>

            <div className="bg-red-500/60 p-3 rounded-lg shadow-2xl">
              <p className="text-sm text-white text-center">
                Silahkan lakukan scan di pintu keluar sebelum
              </p>
              {countdown > 0 && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-orange-100 animate-pulse">
                    {formatTime(countdown)}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
