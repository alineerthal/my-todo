import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type Priority = "alta" | "media" | "baixa";
type Period = "manha" | "tarde" | "noite";
type Status = "todas" | "pendentes" | "concluidas";
type Theme = "light" | "dark" | "system";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  period: Period;
  done: boolean;
}

/* COMPONENTE SORTABLE - item arrastável */
function SortableTask({
  task,
  toggleTask,
  deleteTask,
  priorityColor,
  priorityLabel,
  periodLabel,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        flex items-start justify-between gap-3 p-4 rounded-3xl
        bg-white/50 dark:bg-black/30
        border border-white/40 dark:border-white/10
        backdrop-blur-xl shadow-lg shadow-black/10
        hover:scale-[1.01] transition-all animate-fadeSlide cursor-grab active:cursor-grabbing
      "
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTask(task.id)}
          className="
            h-4 w-4 rounded border-slate-300 dark:border-slate-600
            cursor-pointer
          "
        />

        <div>
          <p className={task.done ? "line-through opacity-50" : ""}>
            {task.title}
          </p>

          <div className="flex gap-2 text-[11px] mt-2">
            <span
              className={`px-2 py-0.5 rounded-full ${priorityColor(
                task.priority
              )}`}
            >
              {priorityLabel(task.priority)}
            </span>

            <span className="px-2 py-0.5 rounded-full bg-slate-300/60 dark:bg-slate-700/60">
              {periodLabel(task.period)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-xs text-red-500 hover:text-red-600 active:scale-95 transition"
      >
        excluir
      </button>
    </li>
  );
}

/* APP PRINCIPAL */
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("media");
  const [period, setPeriod] = useState<Period>("manha");
  const [theme, setTheme] = useState<Theme>("system");

  const [filterPriority, setFilterPriority] = useState<Priority | "todas">(
    "todas"
  );
  const [filterPeriod, setFilterPeriod] = useState<Period | "todos">("todos");
  const [filterStatus, setFilterStatus] = useState<Status>("todas");

  /* Sensores do DnD */
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved as Theme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const enableDark = () => root.classList.add("dark");
    const disableDark = () => root.classList.remove("dark");

    if (theme === "light") disableDark();
    else if (theme === "dark") enableDark();
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        enableDark();
      else disableDark();
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleAddTask() {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      period,
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setPriority("media");
    setPeriod("manha");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  /* FILTRAGEM */
  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== "todas" && task.priority !== filterPriority)
      return false;
    if (filterPeriod !== "todos" && task.period !== filterPeriod) return false;
    if (filterStatus === "pendentes" && task.done) return false;
    if (filterStatus === "concluidas" && !task.done) return false;
    return true;
  });

  /* Drag & Drop - mudança de posição */
  function onDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    // Reordenar apenas a lista total (não apenas a filtrada)
    const tasksCloned = [...tasks];
    const activeGlobalIndex = tasksCloned.findIndex((t) => t.id === active.id);
    const overGlobalIndex = tasksCloned.findIndex((t) => t.id === over.id);

    const newTasks = arrayMove(tasksCloned, activeGlobalIndex, overGlobalIndex);
    setTasks(newTasks);
  }

  function priorityLabel(p: Priority) {
    return p === "alta" ? "Alta" : p === "media" ? "Média" : "Baixa";
  }

  function periodLabel(p: Period) {
    return p === "manha" ? "Manhã" : p === "tarde" ? "Tarde" : "Noite";
  }

  function priorityColor(p: Priority) {
    if (p === "alta")
      return "bg-red-200/60 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    if (p === "media")
      return "bg-yellow-200/60 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
    return "bg-green-200/60 text-green-800 dark:bg-green-900/40 dark:text-green-200";
  }

  return (
    <div
      className="
      min-h-screen bg-[rgba(255,255,255,0.55)]
      dark:bg-[rgba(0,0,0,0.45)] backdrop-blur-xl 
      flex justify-center p-8 transition-all
    "
    >
      <div
        className="
        w-full max-w-xl bg-glassLight dark:bg-glassDark 
        backdrop-blur-xl border border-white/30 dark:border-white/10
        shadow-[0_8px_32px_rgb(0,0,0,0.2)]
        rounded-3xl p-6 transition-all animate-fadeSlide
      "
      >
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-5">
          <h1 className="text-3xl font-semibold tracking-tight">
            Minha To-Do List
          </h1>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="
              px-3 py-1.5 text-xs rounded-xl
              bg-white/60 dark:bg-black/40
              border border-white/40 dark:border-white/10
              backdrop-blur-md
            "
          >
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </header>

        {/* FORM */}
        <div className="space-y-3 mb-6">
          <input
            className="
              w-full px-4 py-2 rounded-2xl text-sm
              bg-white/70 dark:bg-black/40 backdrop-blur-sm
              border border-white/40 dark:border-white/10
              placeholder:text-slate-600 dark:placeholder:text-slate-300
              focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-500
              transition
            "
            placeholder="Nova tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <select
              className="
                flex-1 px-3 py-2 rounded-2xl text-sm
                bg-white/70 dark:bg-black/40
                border border-white/40 dark:border-white/10
                backdrop-blur-sm
              "
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <select
              className="
                flex-1 px-3 py-2 rounded-2xl text-sm
                bg-white/70 dark:bg-black/40
                border border-white/40 dark:border-white/10
                backdrop-blur-sm
              "
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>

            <button
              onClick={handleAddTask}
              className="
                px-4 py-2 rounded-2xl text-sm font-medium
                bg-gradient-to-br from-violet-500 to-violet-600
                text-white shadow-lg shadow-violet-500/30
                hover:brightness-110 active:scale-95
                transition-all
              "
      >
              Add
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-3 mb-6">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="
              flex-1 px-3 py-2 rounded-2xl text-sm
              bg-white/70 dark:bg-black/40
              border border-white/40 dark:border-white/10
              backdrop-blur-sm
            "
          >
            <option value="todas">Todas prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="
              flex-1 px-3 py-2 rounded-2xl text-sm
              bg-white/70 dark:bg-black/40
              border border-white/40 dark:border-white/10
              backdrop-blur-sm
            "
          >
            <option value="todos">Todos períodos</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status)}
            className="
              flex-1 px-3 py-2 rounded-2xl text-sm
              bg-white/70 dark:bg-black/40
              border border-white/40 dark:border-white/10
              backdrop-blur-sm
            "
          >
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="concluidas">Concluídas</option>
          </select>
        </div>

        {/* LISTA */}
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {filteredTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                    priorityColor={priorityColor}
                    priorityLabel={priorityLabel}
                    periodLabel={periodLabel}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
