// @ts-nocheck
import  { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import NavItems from "./NavItems";

export default function MobileSlidebar() {
    let sidebar : SidebarComponent;
    const toggleSidebar =   () => {
       sidebar.toggle();
    };
    return (
    <div className="mobile-slidebar wrapper">
      <header className="flex items-center justify-between px-4 py-2  ">
  <Link to="/" className="flex items-center gap-2">
    <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
    <h1 className="text-lg font-bold">Travora</h1>
                </Link>

  <button onClick={toggleSidebar} className=" block lg:hidden hover:bg-gray-100">
    <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
                </button>
            </header>

           
           <SidebarComponent
                width={270}
                ref={(Sidebar) => sidebar = Sidebar}
                created={() => sidebar.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over">
                    <NavItems handleClick={toggleSidebar}/>
                </SidebarComponent>
    </div>
  )
}
