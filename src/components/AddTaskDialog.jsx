import { useState } from "react";
import { X, Clock, Repeat, Palette, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colors = [
  { name: 'Blue', value: 'bg-primary', color: 'hsl(217 91% 60%)' },
  { name: 'Green', value: 'bg-secondary', color: 'hsl(142 76% 36%)' },
  { name: 'Yellow', value: 'bg-warning', color: 'hsl(38 92% 50%)' },
  { name: 'Red', value: 'bg-destructive', color: 'hsl(0 84% 60%)' },
  { name: 'Purple', value: 'bg-purple-500', color: 'hsl(271 91% 65%)' },
  { name: 'Orange', value: 'bg-orange-500', color: 'hsl(20 90% 48%)' },
];

const icons = ['📚', '⚛️', '✍️', '🧮', '🔬', '🎨', '💻', '🎵', '🏃‍♂️', '🧘‍♀️'];

const repeatOptions = [
  { label: 'No Repeat', value: 'none' },
  { label: 'Daily', value: 'daily' },
  { label: 'Every Other Day', value: 'alternate' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Custom', value: 'custom' },
];

export const AddTaskDialog = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    repeat: 'none',
    color: 'bg-primary',
    icon: '📚'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating task:', formData);
    // Here you would typically save the task
    onOpenChange(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      repeat: 'none',
      color: 'bg-primary',
      icon: '📚'
    });
  };

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours > 0 ? `${diffHours.toFixed(1)} hours` : '';
    }
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-background border-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description for your task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-input min-h-[80px]"
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">
                End Time *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                className="bg-background border-input"
              />
            </div>
          </div>

          {/* Duration Display */}
          {calculateDuration() && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm text-primary font-medium">
                Total Duration: {calculateDuration()}
              </p>
            </div>
          )}

          {/* Repeat Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Repeat className="w-4 h-4 mr-1" />
              Repeat Duration
            </Label>
            <Select
              value={formData.repeat}
              onValueChange={(value) => setFormData({ ...formData, repeat: value })}
            >
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select repeat option" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg">
                {repeatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center">
              <Palette className="w-4 h-4 mr-1" />
              Color Theme
            </Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-foreground scale-110'
                      : 'border-muted hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center">
              <Smile className="w-4 h-4 mr-1" />
              Icon
            </Label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center text-lg ${
                    formData.icon === icon
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-muted hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-8"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};