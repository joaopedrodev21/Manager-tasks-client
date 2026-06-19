import { CheckCircle2, ClipboardList, Clock, Rocket } from "lucide-react";
import type { Task } from '../types';
import '../styles/dashboard-header.css';

interface DashboardHeaderProps {
  user: { name: string } | null;
  tasks: Task[];
}

export function DashboardHeader({ user, tasks }: DashboardHeaderProps) {
  const completedTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.length - completedTasks;
  const productivity = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const stats = [
    {
      icon: ClipboardList,
      value: tasks.length,
      label: 'Total de tarefas',
      description: 'Todas as tarefas cadastradas',
    },
    {
      icon: CheckCircle2,
      value: completedTasks,
      label: 'Concluídas',
      description: 'Finalizadas com sucesso',
    },
    {
      icon: Clock,
      value: pendingTasks,
      label: 'Pendentes',
      description: 'Aguardando conclusão',
    },
    {
      icon: Rocket,
      value: `${productivity}%`,
      label: 'Produtividade',
      description: 'Percentual de conclusão',
      highlight: true,
    },
  ];

  return (
    <section className="dashboard-header">
      <div className="dashboard-header__top">
        <div className="dashboard-header__main">
          <span className="dashboard-header__badge">Painel principal</span>
          <h1 className="dashboard-header__title">Bem-vindo(a), {user?.name}!</h1>
          <p className="dashboard-header__description">Organize e acompanhe suas tarefas com mais foco usando um painel limpo e intuitivo.</p>
        </div>
      </div>

      <div className="dashboard-header__stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`dashboard-header__stat ${stat.highlight ? 'dashboard-header__stat--highlight' : ''}`}
            >
              <span className="dashboard-header__icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div className="dashboard-header__value">{stat.value}</div>
              <div className="dashboard-header__label">{stat.label}</div>
              <p className="dashboard-header__text">{stat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
