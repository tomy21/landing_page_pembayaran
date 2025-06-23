"use client";
import React, { useEffect, useState } from "react";
import QrisWithPopup from "./QrisAction";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { decryptData, encryptData } from "../helper/CryptoUtils";

export default function LandingPageClient() {
  const searchParams = useSearchParams();
  const p1 = searchParams.get("p1");
  const p2 = searchParams.get("p2");

  const [qrContent, setQrContent] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [terminalId, setTerminalId] = useState<string | null>(null);
  const [tariffData, setTariffData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tambahkan ini di komponen client atau _app.js
  if (typeof window !== "undefined") {
    setTimeout(() => {
      console.log("%c⚠️ PERINGATAN!", "font-size: 40px; color: red;");
      console.log(
        "%cJANGAN KETIK APA PUN DI SINI!\nJika seseorang menyuruh Anda menyalin sesuatu ke sini,\nitu bisa mencuri akun Anda.",
        "font-size: 20px; color: orange;"
      );
    }, 1000);
  }

  useEffect(() => {
    let open = false;
    const threshold = 160;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        if (!open) {
          open = true;
          alert("DevTools terdeteksi! Akses dibatasi.");
          // Atau redirect, logout, dll
        }
      } else {
        open = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
        const tariffRes = await fetch("/api/inquiry-tariff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: encryptedPayload }),
        });

        const tariffResult = await tariffRes.json();
        const decryptedData = decryptData(tariffResult.data);

        if (!decryptedData || decryptedData.responseCode !== "211000") {
          throw new Error("Invalid response or failed to decrypt data");
        }

        const { vehicleType, tariff } = decryptedData.data;
        setTariffData(decryptedData.data);

        const mpmRes = await fetch("/api/generateMPM", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              product: vehicleType,
              amount: { value: tariff.toString(), currency: "IDR" },
              externalStoreId: "ID2020028029516",
              additionalInfo: { qrType: "03" },
            },
          }),
        });

        const mpmResult = await mpmRes.json();
        if (mpmResult.responseCode === "2004700") {
          setQrContent(mpmResult.qrContent);
          setMerchantName(mpmResult.merchantName);
          setStoreId(mpmResult.storeId);
          setTerminalId(mpmResult.terminalId);
        } else {
          throw new Error("Failed to generate QRIS");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (p1 && p2) fetchData();
  }, [p1, p2]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-sm p-6 relative">
        {/* Logo & Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-row justify-center items-center">
            <Image
              src="/qris-logo.png"
              alt="QRIS Logo"
              width={70}
              height={70}
            />
            <div className="flex flex-col justify-start items-start">
              <h1 className="text-xs font-bold">QR Code Standar </h1>
              <p className="text-xs">Pembayaran Nasional</p>
            </div>
          </div>
          <Image src="/gpn-logo.png" alt="GPN Logo" width={30} height={30} />
        </div>

        {/* Merchant Info */}
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg">{merchantName}</h2>
          <p className="text-sm">NMID: {storeId}</p>
          <p className="text-sm">{terminalId}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QrisWithPopup qrContent={qrContent?.toString() || ""} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-semibold">
          SATU QRIS UNTUK SEMUA
        </p>
        <p className="text-center text-[10px] text-gray-500 mb-2">
          Cek aplikasi penyelenggara di: www.aspi-qris.id
        </p>
        <div className="bg-blue-500/50 p-3 rounded-2xl shadow-2xl">
          <p className="text-sm text-white text-center">
            Klik pada gambar QR Code untuk melakukan action pembayaran atau scan
            menggunakan aplikasi e-wallet anda
          </p>
        </div>
      </div>
    </main>
  );
}
