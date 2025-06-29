"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import Image from "next/image";

export default function QrisWithPopup({ qrContent }: { qrContent: string }) {
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = showOptions ? "hidden" : "auto";
  }, [showOptions]);

  useEffect(() => {
    if (qrContent) setIsLoading(false);
  }, [qrContent]);

  const handleDownloadFullImage = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qris-full.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* QR Box */}
      <div
        ref={qrRef}
        className={`cursor-pointer w-[300px] h-[200px] flex items-center justify-center mb-3 ${
          isLoading ? "bg-gray-200 animate-pulse rounded" : ""
        }`}
        onClick={() => !isLoading && setShowOptions(true)}
      >
        {!isLoading && (
          <QRCodeSVG
            value={qrContent?.toString() || ""}
            size={200}
            level="H"
            includeMargin={true}
          />
        )}
      </div>

      <div className="my-3">
        <p className="text-center text-xs font-semibold">
          SATU QRIS UNTUK SEMUA
        </p>
        <p className="text-center text-[10px] text-gray-500 mb-2">
          Cek aplikasi penyelenggara di: www.aspi-qris.id
        </p>
      </div>

      <div className="flex justify-between items-center w-full">
        <div
          onClick={() => {
            const goPayLink = `gopay://gopay/qr?code=${qrContent}`;
            window.location.href = goPayLink;

            // Optional: Fallback jika tidak terinstall
            setTimeout(() => {
              window.open("https://gojek.com/gopay", "_blank");
            }, 2000);
          }}
          className="flex flex-row justify-start items-start border border-cyan-400 rounded-lg p-2 hover:bg-cyan-100 hover:cursor-pointer"
        >
          <Image
            src="/logoGopay.png"
            alt="gopay"
            width={30}
            height={30}
            className="mr-2"
          />
          <div className="flex flex-col justify-start items-start text-cyan-500">
            <p className="text-xs">Buka Aplikasi</p>
            <p className="text-xs">Gopay</p>
          </div>
        </div>
        <div
          onClick={handleDownloadFullImage}
          className="flex flex-row justify-start items-start border border-cyan-400 rounded-lg p-3 hover:bg-cyan-100 hover:cursor-pointer"
        >
          <p className="text-md">Download Qris</p>
        </div>
      </div>
    </div>
  );
}
