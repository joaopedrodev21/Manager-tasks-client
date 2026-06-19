import { useState, useMemo } from "react";
import { Sidebar } from "../components/Sidebar";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { useTasks } from "../hooks/useTasks";
import { formatDate } from "../utils/formatDate";
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, ArrowUp, ArrowDown, Clock, CheckCircle2 } from "lucide-react";
import "../styles/dashboard-layout.css";
import "../styles/calendar.css";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function CalendarPage() {
  const { tasks } = useTasks();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate && !t.done && new Date(t.dueDate) < new Date());
  }, [tasks]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, { title: string; priority: "LOW" | "HIGH"; done: boolean; overdue: boolean }[]>();
    tasks.forEach(task => {
      if (!task.dueDate) return;
      const dateKey = task.dueDate.split("T")[0];
      const isOverdue = !task.done && new Date(task.dueDate) < new Date();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push({ title: task.title, priority: task.priority, done: task.done, overdue: isOverdue });
    });
    return map;
  }, [tasks]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const formatDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <Sidebar tasks={tasks} />

        <MobileBottomNav />

        <div className="dashboard-main">
          <main>
            {/* ── Overdue Alert ── */}
            {overdueTasks.length > 0 && (
              <div className="calendar-overdue-alert">
                <AlertTriangle size={18} />
                <div className="calendar-overdue-alert__content">
                  <span className="calendar-overdue-alert__title">
                    {overdueTasks.length} tarefa{overdueTasks.length > 1 ? "s" : ""} atrasada{overdueTasks.length > 1 ? "s" : ""}
                  </span>
                  <span className="calendar-overdue-alert__subtitle">
                    Tarefas com prazo expirado que ainda não foram concluídas
                  </span>
                </div>
              </div>
            )}

            <div className="dashboard-card" style={{ padding: "32px" }}>
              <div className="dashboard-card__top">
                <div>
                  <span className="dashboard-tag">Calendário</span>
                  <h2 className="dashboard-title">Tarefas por data</h2>
                  <p className="dashboard-description">
                    Visualize as tarefas com data de vencimento organizadas no calendário.
                  </p>
                </div>
              </div>

              {/* ── Calendar Navigation ── */}
              <div className="calendar-nav">
                <button type="button" className="calendar-nav__btn" onClick={prevMonth}>
                  <ChevronLeft size={18} />
                </button>
                <div className="calendar-nav__title">
                  <Calendar size={18} />
                  <span>{MONTHS[currentMonth]} {currentYear}</span>
                </div>
                <button type="button" className="calendar-nav__btn" onClick={nextMonth}>
                  <ChevronRight size={18} />
                </button>
                <button type="button" className="calendar-today-btn" onClick={goToToday}>
                  Hoje
                </button>
              </div>

              {/* ── Calendar Grid ── */}
              <div className="calendar-grid">
                {WEEKDAYS.map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}

                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="calendar-day calendar-day--empty" />;
                  }

                  const dateKey = formatDateKey(day);
                  const dayTasks = tasksByDate.get(dateKey) || [];
                  const hasHighPriority = dayTasks.some(t => t.priority === "HIGH" && !t.done);
                  const hasOverdue = dayTasks.some(t => t.overdue);
                  const hasTasks = dayTasks.length > 0;
                  const allDone = dayTasks.length > 0 && dayTasks.every(t => t.done);

                  return (
                    <div
                      key={dateKey}
                      className={`calendar-day ${isToday(day) ? "calendar-day--today" : ""} ${
                        hasHighPriority && !allDone ? "calendar-day--high" : ""
                      } ${allDone ? "calendar-day--done" : ""} ${
                        hasTasks && !hasHighPriority && !allDone && !hasOverdue ? "calendar-day--has-tasks" : ""
                      } ${hasOverdue ? "calendar-day--overdue" : ""}`}
                    >
                      <span className="calendar-day__number">{day}</span>
                      {hasTasks && (
                        <div className="calendar-day__tasks">
                          {dayTasks.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className={`calendar-day__task-dot ${
                                t.priority === "HIGH" ? "calendar-day__task-dot--high" : "calendar-day__task-dot--low"
                              } ${t.done ? "calendar-day__task-dot--done" : ""} ${
                                t.overdue ? "calendar-day__task-dot--overdue" : ""
                              }`}
                              title={t.title}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="calendar-day__more">+{dayTasks.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Task List for Selected Date ── */}
            <div className="dashboard-card" style={{ padding: "24px", marginTop: "24px" }}>
              <h3 className="dashboard-title" style={{ marginBottom: "16px", fontSize: "1rem" }}>
                Tarefas com data de vencimento
              </h3>
              {tasks.filter(t => t.dueDate).length === 0 ? (
                <div className="dashboard-empty">
                  Nenhuma tarefa com data de vencimento cadastrada.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tasks
                    .filter(t => t.dueDate)
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .map(task => {
                      const due = formatDate(task.dueDate!);
                      const isOverdue = !task.done && new Date(task.dueDate!) < new Date();
                      return (
                        <div
                          key={task.id}
                          className={`calendar-task-item ${isOverdue ? "calendar-task-item--overdue" : ""}`}
                          data-overdue={isOverdue}
                          data-done={task.done}
                        >
                          {isOverdue && <AlertTriangle size={14} className="calendar-task-item__warning" />}
                          <span
                            className={`calendar-task-item__badge ${
                              task.priority === "HIGH" ? "calendar-task-item__badge--high" : "calendar-task-item__badge--low"
                            }`}
                          >
                            {task.priority === "HIGH" ? <><ArrowUp size={11} /> Alta</> : <><ArrowDown size={11} /> Baixa</>}
                          </span>
                          <span style={{ flex: 1, color: task.done ? "var(--text-dim)" : isOverdue ? "var(--danger-text)" : "var(--text-secondary)", textDecoration: task.done ? "line-through" : "none", display: "flex", alignItems: "center", gap: "6px" }}>
                            {task.done && <CheckCircle2 size={14} />}
                            {task.title}
                          </span>
                          <span style={{ color: isOverdue ? "var(--danger-text-hover)" : "var(--text-dim)", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                            {isOverdue && <Clock size={13} />}
                            {' '}{due}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}