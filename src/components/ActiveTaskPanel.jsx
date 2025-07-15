import { useState, useEffect } from "react";
import { Play, Pause, Square, CheckCircle2, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ActiveTaskPanel = ({ isFullscreen = false, onToggleFullscreen }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdownStyle, setCountdownStyle] = useState('digital');
  
  const totalTime = 7200; // 2 hours
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const CircularProgress = ({ value, size = 200 }) => {
    const circumference = 2 * Math.PI * (size / 2 - 10);
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted opacity-20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-1000 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCountdown = () => {
    switch (countdownStyle) {
      case 'circle':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CircularProgress value={progress} size={isFullscreen ? 300 : 200} />
            <p className="text-sm text-muted-foreground">
              Total: {formatTime(totalTime)}
            </p>
          </div>
        );
      
      case 'minimal':
        return (
          <div className="text-center space-y-4">
            <div className="text-8xl font-light text-primary tabular-nums">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-full max-w-sm">
              <Progress value={progress} className="w-full h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% of {formatTime(totalTime)}
            </p>
          </div>
        );
      
      case 'neon':
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="text-8xl font-bold text-primary tabular-nums neon-glow animate-pulse">
                {formatTime(timeRemaining)}
              </div>
              <div className="absolute inset-0 text-8xl font-bold text-primary tabular-nums opacity-30 blur-sm">
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 neon-glow"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatTime(totalTime)} session
            </p>
          </div>
        );
      
      default: // digital
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-primary mb-2 tabular-nums">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {formatTime(totalTime)}
            </p>
            <Progress value={progress} className="w-full h-3" />
          </div>
        );
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeRemaining(totalTime);
  };
  const handleComplete = () => {
    setIsCompleted(true);
    setIsRunning(false);
  };

  if (isCompleted) {
    return (
      <Card className="bg-gradient-to-br from-secondary to-secondary-light border-0 shadow-lg animate-celebration">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-24 h-24 text-secondary-foreground mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-secondary-foreground mb-2">
              🎉 Task Completed!
            </h2>
            <p className="text-secondary-foreground/80 text-lg">
              Great job! You've successfully completed your study session.
            </p>
          </div>
          <Button 
            onClick={() => {
              setIsCompleted(false);
              setTimeRemaining(totalTime);
            }}
            className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90"
          >
            Start New Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  const cardClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background border-0 shadow-2xl rounded-none" 
    : "bg-gradient-to-br from-card to-muted border-0 shadow-lg h-full";

  return (
    <Card className={cardClass}>
      <CardHeader className="text-center pb-4 relative">
        <div className="flex items-center justify-between">
          <CardTitle className={`font-bold text-primary ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
            Active Task
          </CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCountdownStyle('digital')}>
                  Digital Timer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle('circle')}>
                  Circle Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle('minimal')}>
                  Minimal Style
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle('neon')}>
                  Neon Effect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`flex flex-col items-center justify-center h-full ${isFullscreen ? 'p-12 space-y-12' : 'p-4 sm:p-6 space-y-6 sm:space-y-8'}`}>
        <div className="text-center space-y-4">
          <h3 className={`font-semibold text-foreground ${isFullscreen ? 'text-3xl' : 'text-xl'}`}>
            Mathematics Study Session
          </h3>
          <p className={`text-muted-foreground ${isFullscreen ? 'text-xl' : 'text-base'}`}>
            Algebra and Calculus Review
          </p>
        </div>

        <div className={`w-full ${isFullscreen ? 'max-w-2xl' : 'max-w-sm'} space-y-6`}>
          {renderCountdown()}
        </div>

        <div className={`flex flex-wrap gap-2 sm:gap-4 justify-center ${isFullscreen ? 'scale-125' : ''}`}>
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size={isFullscreen ? "lg" : "default"}
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 sm:px-8"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size={isFullscreen ? "lg" : "default"}
              variant="secondary"
              className="px-4 sm:px-8"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleStop}
            size={isFullscreen ? "lg" : "default"}
            variant="outline"
            className="px-4 sm:px-8"
          >
            <Square className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Stop
          </Button>
          
          <Button
            onClick={handleComplete}
            size={isFullscreen ? "lg" : "default"}
            className="bg-secondary hover:bg-secondary-light text-secondary-foreground px-4 sm:px-8"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};