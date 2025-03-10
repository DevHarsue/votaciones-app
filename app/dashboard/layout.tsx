import Header from "./../ui/components/headerdash";
import Footer from './../ui/components/footer';

export default function RootDashboard({
  children,
}: {
  children: React.ReactNode;
}){
    return (
        <div className="flex min-h-screen flex-col p-0">
            <Header / >
            <main>{children}</main>
            <Footer />
        </div>
    );
}