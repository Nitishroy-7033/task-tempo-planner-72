import { useState } from "react";
import { Header } from "@/components/Header";
import { ActiveTaskPanel } from "@/components/ActiveTaskPanel";
import { UpcomingTasksPanel } from "@/components/UpcomingTasksPanel";

const Index = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreen && <Header />}
      
      {isFullscreen ? (
        <ActiveTaskPanel 
          isFullscreen={true} 
          onToggleFullscreen={() => setIsFullscreen(false)} 
        />
      ) : (
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
            {/* Left Panel - Active Task */}
            <ActiveTaskPanel onToggleFullscreen={() => setIsFullscreen(true)} />
            
            {/* Right Panel - Upcoming Tasks */}
            <UpcomingTasksPanel />
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
