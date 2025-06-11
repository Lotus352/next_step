import { JobListings } from "@/components/features/job/job-listings-seeker";
import Header from "@/components/layout/header.tsx";
import Footer from "@/components/layout/footer.tsx";

export default function JobListingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <JobListings />
      <Footer />
    </div>
  );
}
