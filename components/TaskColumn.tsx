'use client';

import { Task, TaskStatus } from '@/lib/store';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  title: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskColumn({ status, tasks, title, onEdit, onDelete }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col w-full min-w-[300px] bg-muted/50 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div ref={setNodeRef} className="flex-1">
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}