import LandingLayout from "@/components/layout/landingLayout";

import "./terms.css";

interface LayoutProps {
    children: React.ReactNode;
}

export default function TermsLayout({ children }: LayoutProps) {
    return (
        <LandingLayout>
            <div className='terms'>{children}</div>
        </LandingLayout>
    );
}
