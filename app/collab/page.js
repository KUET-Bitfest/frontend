import Hero from "@/components/utils/Hero";
import { Editor } from "./Editor";
import { Room } from "./Room";

export default function Page() {
  return (
    <main className='bg-main-bg dark:bg-menu-secondary h-full w-full' >
        <nav className='sticky bg-main-bg dark:bg-menu-secondary z-50 h-20'>
        <Hero landing = {true} />
        </nav>
        <div className="container w-full flex items-center justify-center m-auto mt-24 h-[600px]">
        <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
            <Room>
            <Editor />
            </Room>
        </div>
    </div>
    </main>
  );
}