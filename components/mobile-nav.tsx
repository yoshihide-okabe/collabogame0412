import Link from "next/link";
import { Home, MessageSquare, PlusCircle, Mail, User } from "lucide-react";

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-lightgreen-200 shadow-lg rounded-t-3xl">
      <div className="grid grid-cols-5 items-center py-2 px-2">
        <Link
          href="/"
          className="flex flex-col items-center justify-center p-2 text-lightgreen-600 hover:text-lightgreen-800 relative"
        >
          <div className="bg-lightgreen-100 rounded-full p-2 mb-1">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">ホーム</span>
        </Link>
        <Link
          href="/troubles"
          className="flex flex-col items-center justify-center p-2 text-lightgreen-600 hover:text-lightgreen-800 relative"
        >
          <div className="bg-lightgreen-100 rounded-full p-2 mb-1">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">お困りごと</span>
        </Link>
        <Link
          href="/projects/create" // ここを "/projects/create" に変更
          className="flex flex-col items-center justify-center p-2 text-lightgreen-600 hover:text-lightgreen-800 relative"
        >
          <div className="bg-lightgreen-500 rounded-full p-3 -mt-6 shadow-md pulse-animation">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium mt-1">作成</span>
        </Link>
        <Link
          href="/messages"
          className="flex flex-col items-center justify-center p-2 text-lightgreen-600 hover:text-lightgreen-800 relative"
        >
          <div className="bg-lightgreen-100 rounded-full p-2 mb-1">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">メッセージ</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center p-2 text-lightgreen-600 hover:text-lightgreen-800 relative"
        >
          <div className="bg-lightgreen-100 rounded-full p-2 mb-1">
            <User className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">マイページ</span>
        </Link>
      </div>
    </div>
  );
}
