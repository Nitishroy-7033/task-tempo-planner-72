import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  User,
  Award,
  CheckCircle2,
  BarChart3,
  Timer
} from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";

export const Progress = () => {
  const { user } = useAuth();
  const { getUserStats, getWeeklyTopPerformers, getMonthlyTopPerformers, getTimeSpentOnSimilarTasks } = useTodo();
  
  const [userStats, setUserStats] = useState(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats
        const stats = await apiClient.getUserStats(user?.id);
        setUserStats(stats);
        
        // Fetch leaderboards
        const weeklyData = await apiClient.getLeaderboard('weekly');
        const monthlyData = await apiClient.getLeaderboard('monthly');
        
        setWeeklyLeaderboard(weeklyData);
        setMonthlyLeaderboard(monthlyData);
        
        // Fetch category stats
        const categories = ['Math', 'Physics', 'History', 'Chemistry', 'Biology'];
        const categoryData = await Promise.all(
          categories.map(async (category) => {
            const timeSpent = await apiClient.getTimeSpentOnSimilarTasks(category);
            const tasks = await apiClient.getTasksByCategory(category);
            const completedTasks = tasks.filter(task => task.status === 'completed');
            
            return {
              category,
              timeSpent,
              totalTasks: tasks.length,
              completedTasks: completedTasks.length,
              completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0
            };
          })
        );
        
        setCategoryStats(categoryData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "primary", description }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold text-${color}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  const LeaderboardCard = ({ user, rank, timeSpent, tasksCompleted, completionRate }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <span className="text-sm font-bold text-primary">#{rank}</span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {tasksCompleted} tasks
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatTime(timeSpent)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate.toFixed(1)}% completion
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CategoryCard = ({ category, timeSpent, completedTasks, totalTasks, completionRate }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{category}</h3>
            <Badge variant="outline" className="text-xs">
              {formatTime(timeSpent)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <ProgressBar value={completionRate} className="h-2" />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Completion Rate</span>
            <span>{completionRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading progress data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Progress Dashboard</h1>
          <p className="text-muted-foreground">
            Track your productivity and see how you compare with others
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal Stats</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Tasks"
                value={userStats?.totalTasks || 0}
                icon={Target}
                color="primary"
              />
              <StatCard
                title="Completed"
                value={userStats?.completedTasks || 0}
                icon={CheckCircle2}
                color="secondary"
              />
              <StatCard
                title="Time Spent"
                value={formatTime(userStats?.totalTimeSpent || 0)}
                icon={Timer}
                color="accent"
              />
              <StatCard
                title="Completion Rate"
                value={`${userStats?.completionRate?.toFixed(1) || 0}%`}
                icon={TrendingUp}
                color="primary"
              />
            </div>

            {/* Weekly vs Monthly */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <span className="text-2xl font-bold text-primary">
                        {userStats?.weeklyStats?.tasksCompleted || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time Spent</span>
                      <span className="text-lg font-semibold text-accent">
                        {formatTime(userStats?.weeklyStats?.timeSpent || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <span className="text-2xl font-bold text-primary">
                        {userStats?.monthlyStats?.tasksCompleted || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time Spent</span>
                      <span className="text-lg font-semibold text-accent">
                        {formatTime(userStats?.monthlyStats?.timeSpent || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Total Tasks</span>
                      <span className="text-lg font-semibold">{userStats?.totalTasks || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Completed Tasks</span>
                      <span className="text-lg font-semibold text-secondary">{userStats?.completedTasks || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Total Time Spent</span>
                      <span className="text-lg font-semibold text-accent">{formatTime(userStats?.totalTimeSpent || 0)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Completion Rate</span>
                      <span className="text-lg font-semibold text-primary">{userStats?.completionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Weekly Tasks</span>
                      <span className="text-lg font-semibold">{userStats?.weeklyStats?.tasksCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Monthly Tasks</span>
                      <span className="text-lg font-semibold">{userStats?.monthlyStats?.tasksCompleted || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Weekly Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weeklyLeaderboard.slice(0, 5).map((user, index) => (
                    <LeaderboardCard
                      key={user.id}
                      user={user}
                      rank={index + 1}
                      timeSpent={user.timeSpent}
                      tasksCompleted={user.tasksCompleted}
                      completionRate={user.completionRate}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-500" />
                    Monthly Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {monthlyLeaderboard.slice(0, 5).map((user, index) => (
                    <LeaderboardCard
                      key={user.id}
                      user={user}
                      rank={index + 1}
                      timeSpent={user.timeSpent}
                      tasksCompleted={user.tasksCompleted}
                      completionRate={user.completionRate}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Time Spent on Similar Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((category) => (
                    <CategoryCard
                      key={category.category}
                      category={category.category}
                      timeSpent={category.timeSpent}
                      completedTasks={category.completedTasks}
                      totalTasks={category.totalTasks}
                      completionRate={category.completionRate}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;