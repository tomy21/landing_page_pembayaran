"use client";

import { Suspense } from "react";
import LandingPageClient from "../components/LandingPageClient";

export default function QRISLandingPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPageClient />
      </Suspense>
    </>
  );
}
