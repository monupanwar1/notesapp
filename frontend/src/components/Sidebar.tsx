import { Logo } from "@/icons/Logo"
import { TwitterIcon } from "@/icons/TwitterIcon";
import { YoutubeIcon } from "@/icons/YoutubeIcon";
import SidebarItems from "./SidebarItems";

function Sidebar() {
  return (
    <div className="h-screen bg-white border-r w-72 fixed top-0 left-0 pl-16">
      <div className="flex text-2xl items-center pt-8">
        <div className="pr-2 text-purple-600">
          <Logo />
        </div>
        SecondBrain
      </div>
      <div className="pt-8 pl-4">
        <SidebarItems text="Twitter" icon={<TwitterIcon />} />
        <SidebarItems text="Youtube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
}
export default Sidebar