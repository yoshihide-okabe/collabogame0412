import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { ProjectGrid } from "@/components/project-grid";

interface ProjectsPageProps {
  params: {
    type: string;
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const type = params.type;
  const title = type === "new" ? "新着プロジェクト" : "お気に入りプロジェクト";

  return (
    <div className="pb-20 bg-gradient-to-b from-lightgreen-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-lightgreen-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-8 w-8 text-lightgreen-600 hover:text-lightgreen-700 hover:bg-lightgreen-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-lightgreen-800">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-lightgreen-600 hover:text-lightgreen-700 hover:bg-lightgreen-100"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full overflow-hidden border-2 border-lightgreen-200 p-0"
            >
              <div className="h-8 w-8 bg-orange-500 text-white font-semibold flex items-center justify-center">
                キ
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <ProjectGrid type={type as "new" | "favorite"} />
      </main>

      <MobileNav />
    </div>
  );
}
