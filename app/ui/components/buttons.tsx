
export function NormalButton(
    {text,color,colorHover,extraClass=""}:
    {text:string,color:string,colorHover:string,extraClass:string}
){
    return (
        <button className={`${color} text-white py-2 px-4 rounded w-full md:w-auto hover:${colorHover} transition-colors ${extraClass}`}>
            {text}
        </button>
    );
}