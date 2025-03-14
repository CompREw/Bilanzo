"use client";

import SalesRecordApp from "@/components/SalesRecordApp";
import { BrowserRouter as Router } from "react-router-dom";


export default function HomePage() {
  return (
    <Router> {/* ✅ Wrap inside <Router> */}
        <SalesRecordApp />
    </Router>
);
}
