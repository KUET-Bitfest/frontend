import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "@/app/globals.css";

export default function Layout({ children }) {
  return <div className="flex flex-col h-screen">{children}</div>;
}