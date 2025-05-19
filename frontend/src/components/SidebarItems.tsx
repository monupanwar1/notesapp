import type { ReactElement } from "react";

interface SidebarProps{
  text:string,
  icon:ReactElement
}

export default function SidebarItems({text,icon}:SidebarProps) {
  return (
    <div className="flex text-gray-700 py-2 cursor-pointer hover:bg-gray-300 rounded max-w-48 pl-4 transition-all duration-150">
      <div className="pr-2">
        {icon}
      </div>
      {text}
    </div>


  );
}