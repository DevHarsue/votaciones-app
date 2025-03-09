import Header from "./../ui/components/header";
import Footer from './../ui/components/footer';

export default function RootMain({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <div className="flex min-h-screen flex-col p-0">
            <Header / >
            {children}
            <Footer />
        </div>
    );
}