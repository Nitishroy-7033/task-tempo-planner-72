import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter,
  Calendar as CalendarIcon,
  List,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockTasks = [
  {
    id: 1,
    title: "Mathematics Study Session",
    description: "Algebra and Calculus Review",
    status: "active",
    startTime: "09:00",
    endTime: "11:00",
    date: new Date(),
    color: "hsl(221, 83%, 53%)",
    icon: "📚",
    progress: 45
  },
  {
    id: 2,
    title: "Physics Assignment",
    description: "Complete chapter 5 problems",
    status: "upcoming",
    startTime: "14:00",
    endTime: "16:00",
    date: new Date(),
    color: "hsl(142, 71%, 45%)",
    icon: "⚡",
    progress: 0
  },
  {
    id: 3,
    title: "History Essay",
    description: "World War II research paper",
    status: "completed",
    startTime: "10:00",
    endTime: "12:00",
    date: new Date(Date.now() - 86400000), // Yesterday
    color: "hsl(262, 83%, 58%)",
    icon: "📝",
    progress: 100
  },
  {
    id: 4,
    title: "Chemistry Lab Report",
    description: "Organic compounds analysis",
    status: "pending",
    startTime: "16:00",
    endTime: "18:00",
    date: new Date(Date.now() + 86400000), // Tomorrow
    color: "hsl(24, 70%, 50%)",
    icon: "🧪",
    progress: 25
  }
];

export const ManageTasks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeView, setActiveView] = useState("list");
  
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-secondary text-secondary-foreground";
      case "active": return "bg-primary text-primary-foreground";
      case "upcoming": return "bg-accent text-accent-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "active": return <PlayCircle className="w-4 h-4" />;
      case "upcoming": return <Clock className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  const TaskCard = ({ task }) => (
    <Card className="hover:shadow-sm transition-shadow border-border/40">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: task.color }}
            >
              {task.icon}
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">{task.title}</h3>
              <p className="text-xs text-muted-foreground">{task.description}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(task.status)} text-xs px-2 py-1`}>
            {getStatusIcon(task.status)}
            <span className="ml-1 capitalize">{task.status}</span>
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{task.startTime} - {task.endTime}</span>
          <span>{task.progress}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-1">
          <div 
            className="h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${task.progress}%`,
              backgroundColor: task.color 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
          <Button onClick={() => setIsAddTaskOpen(true)} size="sm" className="bg-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-2 h-8">
              <TabsTrigger value="list" className="flex items-center px-3 py-1 text-sm">
                <List className="w-3 h-3 mr-1" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center px-3 py-1 text-sm">
                <CalendarIcon className="w-3 h-3 mr-1" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </div>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-6">
              {mockTasks.filter(task => task.status === 'active').length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <PlayCircle className="w-4 h-4 mr-2 text-primary" />
                    Active
                  </h3>
                  <div className="space-y-3">
                    {mockTasks.filter(task => task.status === 'active').map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {mockTasks.filter(task => task.status === 'upcoming').length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    Upcoming
                  </h3>
                  <div className="space-y-3">
                    {mockTasks.filter(task => task.status === 'upcoming').map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {mockTasks.filter(task => task.status === 'completed').length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-secondary" />
                    Completed
                  </h3>
                  <div className="space-y-3">
                    {mockTasks.filter(task => task.status === 'completed').map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {mockTasks.filter(task => task.status === 'pending').length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-warning" />
                    Pending
                  </h3>
                  <div className="space-y-3">
                    {mockTasks.filter(task => task.status === 'pending').map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    Tasks for {selectedDate?.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTasks
                    .filter(task => {
                      if (!selectedDate) return false;
                      return task.date.toDateString() === selectedDate.toDateString();
                    })
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  {mockTasks.filter(task => {
                    if (!selectedDate) return false;
                    return task.date.toDateString() === selectedDate.toDateString();
                  }).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks scheduled for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AddTaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={setIsAddTaskOpen}
      />
    </div>
  );
};

export default ManageTasks;