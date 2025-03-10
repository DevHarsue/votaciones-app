import Header from "./../ui/components/header";
import Footer from './../ui/components/footer';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootMain({
    children,
}: {
    children: React.ReactNode;
}){
    const session = await auth();
    let value = false
    if (session?.user) {
        value= true
    }
    return (
        <div className="flex min-h-screen flex-col p-0">
            <Header isLoggin={value}/ >
            {children}
            <Footer />
        </div>
    );
}