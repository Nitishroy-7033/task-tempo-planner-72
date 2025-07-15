import { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  color: string;
  icon: string;
  status: 'pending' | 'completed' | 'active';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Mathematics Study',
    description: 'Algebra and Calculus Review',
    startTime: '09:00',
    endTime: '11:00',
    color: 'bg-primary',
    icon: '📚',
    status: 'active'
  },
  {
    id: '2',
    title: 'Physics Lab',
    description: 'Quantum mechanics experiments',
    startTime: '14:00',
    endTime: '16:00',
    color: 'bg-secondary',
    icon: '⚛️',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Literature Essay',
    description: 'Shakespeare analysis',
    startTime: '19:00',
    endTime: '21:00',
    color: 'bg-warning',
    icon: '✍️',
    status: 'pending'
  }
];

export const UpcomingTasksPanel = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    // In a real app, this would filter tasks by date
    return isToday(date) ? mockTasks : [];
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
  };

  return (
    <Card className="bg-card border shadow-lg h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-bold text-primary flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Tasks
        </CardTitle>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-muted rounded-lg p-3 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <div className="font-semibold text-foreground">
              {format(selectedDate, 'EEEE')}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(selectedDate, 'MMM dd, yyyy')}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {tasksForSelectedDate.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No tasks scheduled
            </p>
            <p className="text-muted-foreground/70 text-sm">
              {isToday(selectedDate) ? "for today" : `for ${format(selectedDate, 'MMM dd')}`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksForSelectedDate.map((task) => (
              <Card
                key={task.id}
                className={`border-l-4 ${
                  task.status === 'active' ? 'border-l-primary bg-primary/5' :
                  task.status === 'completed' ? 'border-l-secondary bg-secondary/5' :
                  'border-l-muted-foreground'
                } transition-all duration-200 hover:shadow-md cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{task.icon}</span>
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                    </div>
                    <Badge
                      variant={
                        task.status === 'active' ? 'default' :
                        task.status === 'completed' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {task.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {task.startTime} - {task.endTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};