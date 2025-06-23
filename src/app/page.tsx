import { metadata } from "./layout";
import { Suspense } from "react";
import LandingPageClient from "./components/LandingPageClient";

metadata.description = "Pembayaran Online SKY Parking";

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPageClient />
      </Suspense>
    </>
  );
}
