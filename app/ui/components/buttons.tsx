export function NormalButton(
{ text, color, hoverClass, extraClass = "", type = "button", onClick }:
{ 
  text: string, 
  color: string, 
  hoverClass: string, 
  extraClass?: string, 
  type?: "button" | "submit" | "reset",
  onClick?: () => void; // Prop onClick opcional
}
) {
  return (
    <button
      type={type}
      className={`${color} py-2 px-4 rounded md:w-auto ${hoverClass} transition-colors ${extraClass}`}
      onClick={onClick} // onClick se pasa al botón
    >
      {text}
    </button>
  );
}