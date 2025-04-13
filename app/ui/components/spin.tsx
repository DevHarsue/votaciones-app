
export default function Spin({
    extraClass=""
}:{
    extraClass?: string, 
}){
    return (
        <div className="z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 loader_container">
            <div className={`border-blue-600 loader w-32 h-32 ${extraClass}`}></div>        
        </div>
    );
    
}