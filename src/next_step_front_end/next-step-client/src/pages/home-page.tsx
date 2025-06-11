import Header from "@/components/layout/header.tsx";
import HeroSection from "@/components/sections/hero-section.tsx";
import JobCategories from "@/components/features/category/featured-categories-section.tsx";
import HowItWorks from "@/components/sections/how-it-works.tsx";
import FeaturedCompaniesSection from "@/components/features/company/featured-companies-section.tsx";
import CTASection from "@/components/sections/cta-section.tsx";
import Footer from "@/components/layout/footer.tsx";
import FeaturedJobsSection from "@/components/features/job/featured-jobs-section.tsx";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <HeroSection />
            <JobCategories />
            <FeaturedJobsSection />
            <HowItWorks />
            <FeaturedCompaniesSection />
            <CTASection />
            <Footer />
        </div>
    );
}
