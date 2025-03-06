export function NormalButton(
{ text, color, hoverClass, extraClass = "", type = "button" }:
{ text: string, 
  color: string, 
  hoverClass: string, 
  extraClass?: string, 
  type?: "button" | "submit" | "reset" }
) {
  return (
    <button
      type={type}
      className={`${color} text-white py-2 px-4 rounded md:w-auto ${hoverClass} transition-colors ${extraClass}`}
    >
      {text}
    </button>
  );
}