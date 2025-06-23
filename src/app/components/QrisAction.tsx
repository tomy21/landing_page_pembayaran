"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
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
        className={`cursor-pointer w-[300px] h-[300px] flex items-center justify-center ${
          isLoading ? "bg-gray-200 animate-pulse rounded" : ""
        }`}
        onClick={() => !isLoading && setShowOptions(true)}
      >
        {!isLoading && (
          <QRCodeSVG
            value={qrContent?.toString() || ""}
            size={300}
            level="H"
            includeMargin={true}
          />
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white text-black rounded-t-xl shadow-lg w-full max-w-md p-6"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">
                  Pilih Metode Pembayaran
                </h3>
              </div>

              <button
                onClick={handleDownloadFullImage}
                className="w-full py-2 border border-blue-600 text-black rounded mb-2 hover:bg-blue-700"
              >
                🖼️ Download QRIS
              </button>

              <button
                onClick={() => {
                  const goPayLink = `gojek://gopay/qr?code=${qrContent}`;
                  window.location.href = goPayLink;

                  // Optional: Fallback jika tidak terinstall
                  setTimeout(() => {
                    window.open("https://gojek.com/gopay", "_blank");
                  }, 2000);
                }}
                className="w-full py-2 border border-green-400 text-white rounded mb-2 hover:bg-green-100 flex flex-row justify-center items-center space-x-6 text-sm"
              >
                <Image
                  src="/logo_gopay.png"
                  alt="GoPay"
                  width={80}
                  height={80}
                />
              </button>

              <button
                onClick={() => window.open("https://nobu.bank", "_blank")}
                className="w-full py-2 border border-green-400 text-white rounded hover:bg-green-100 flex flex-row justify-center items-center space-x-6 text-sm"
              >
                <Image
                  src="/nobu_logo.png"
                  alt="GoPay"
                  width={70}
                  height={70}
                />
              </button>

              <button
                onClick={() => setShowOptions(false)}
                className="w-full mt-3 text-gray-600 hover:underline border border-gray-500 py-2 rounded-sm"
              >
                Batal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
