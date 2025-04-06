'use client';

import { TaskColumn } from '@/components/TaskColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus, useTaskStore } from '@/lib/store';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'pending', title: '📌 Pending' },
  { status: 'in-progress', title: '🔄 In Progress' },
  { status: 'completed', title: '✅ Completed' },
];

export default function Home() {
  const [tasks, addTask, updateTask, deleteTask, moveTask] = useTaskStore((state) => [
    state.tasks,
    state.addTask,
    state.updateTask,
    state.deleteTask,
    state.moveTask,
  ]);

  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const newStatus = over.id as TaskStatus;
      moveTask(active.id as string, newStatus);
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };

  const handleSave = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast.success('Task updated successfully');
    } else {
      addTask({ ...taskData, status: 'pending' } as Task);
      toast.success('Task created successfully');
    }
    setEditingTask(undefined);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted successfully');
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Simple Task</h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
            <ThemeSwitcher />
          </div>
        </div>

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map(({ status, title }) => (
              <TaskColumn
                key={status}
                status={status}
                title={title}
                tasks={tasks.filter((task) => task.status === status)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DndContext>

        <TaskDialog
          open={open}
          onOpenChange={setOpen}
          onSave={handleSave}
          task={editingTask}
        />
      </div>
    </main>
  );
}