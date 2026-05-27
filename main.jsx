import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Edit2,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Save,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import './styles.css';

const initialEmployees = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Desenvolvedora Front-end',
    department: 'Tecnologia',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    skills: [
      { name: 'React', level: 5, type: 'hard' },
      { name: 'JavaScript', level: 5, type: 'hard' },
      { name: 'UI/UX', level: 3, type: 'hard' },
      { name: 'Comunicação', level: 4, type: 'soft' },
      { name: 'Liderança', level: 2, type: 'soft' },
      { name: 'Resolução de Problemas', level: 5, type: 'soft' }
    ]
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Analista de Marketing',
    department: 'Marketing',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    skills: [
      { name: 'SEO', level: 4, type: 'hard' },
      { name: 'Copywriting', level: 5, type: 'hard' },
      { name: 'Análise de Dados', level: 2, type: 'hard' },
      { name: 'Trabalho em Equipe', level: 5, type: 'soft' },
      { name: 'Gestão de Tempo', level: 3, type: 'soft' }
    ]
  },
  {
    id: 3,
    name: 'Mariana Costa',
    role: 'Gerente de Projetos',
    department: 'Operações',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
    skills: [
      { name: 'Scrum/Agile', level: 5, type: 'hard' },
      { name: 'Gestão de Orçamento', level: 4, type: 'hard' },
      { name: 'Liderança', level: 5, type: 'soft' },
      { name: 'Negociação', level: 4, type: 'soft' },
      { name: 'Inglês', level: 3, type: 'hard' },
      { name: 'Pensamento Analítico', level: 3, type: 'soft' }
    ]
  },
  {
    id: 4,
    name: 'Rafael Souza',
    role: 'Designer Gráfico',
    department: 'Marketing',
    avatar: 'https://i.pravatar.cc/150?u=rafael',
    skills: [
      { name: 'Photoshop', level: 5, type: 'hard' },
      { name: 'Figma', level: 4, type: 'hard' },
      { name: 'Criatividade', level: 5, type: 'soft' },
      { name: 'Atenção aos Detalhes', level: 2, type: 'soft' },
      { name: 'Comunicação', level: 3, type: 'soft' }
    ]
  },
  {
    id: 5,
    name: 'Bianca Rocha',
    role: 'Analista de RH',
    department: 'Pessoas',
    avatar: 'https://i.pravatar.cc/150?u=bianca',
    skills: [
      { name: 'People Analytics', level: 4, type: 'hard' },
      { name: 'Recrutamento', level: 5, type: 'hard' },
      { name: 'Comunicação', level: 5, type: 'soft' },
      { name: 'Liderança', level: 3, type: 'soft' },
      { name: 'Negociação', level: 4, type: 'soft' }
    ]
  }
];

const clampLevel = (level) => Math.min(5, Math.max(1, Number(level) || 1));

function getSkillTone(level) {
  if (level >= 4) return 'strong';
  if (level === 3) return 'medium';
  return 'weak';
}

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <img src="/assets/talenttrack-parex-logo.png" alt="" />
    </div>
  );
}

function SkillBar({ name, level }) {
  const safeLevel = clampLevel(level);
  return (
    <div className="skill-row">
      <div className="skill-row__top">
        <span>{name}</span>
        <b>{safeLevel}/5</b>
      </div>
      <div className="skill-blocks" aria-label={`${name}: nível ${safeLevel} de 5`}>
        {[1, 2, 3, 4, 5].map((item) => (
          <span key={item} className={item <= safeLevel ? getSkillTone(safeLevel) : ''} />
        ))}
      </div>
    </div>
  );
}

function EditableSkill({ skill, index, onChange, onRemove }) {
  return (
    <div className="editable-skill">
      <div className="editable-skill__header">
        <div>
          <b>{skill.name}</b>
          <span>{skill.type === 'hard' ? 'Técnica' : 'Comportamental'}</span>
        </div>
        <button className="icon-button danger" onClick={() => onRemove(index)} aria-label={`Remover ${skill.name}`}>
          <Trash2 size={16} />
        </button>
      </div>
      <div className="range-line">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={skill.level}
          onChange={(event) => onChange(index, event.target.value)}
        />
        <strong>{skill.level}/5</strong>
      </div>
    </div>
  );
}

function useCompanyInsights(employees) {
  return useMemo(() => {
    const skills = new Map();
    let strong = 0;
    let medium = 0;
    let weak = 0;

    employees.forEach((employee) => {
      employee.skills.forEach((skill) => {
        const current = skills.get(skill.name) || { name: skill.name, total: 0, count: 0, type: skill.type };
        current.total += clampLevel(skill.level);
        current.count += 1;
        skills.set(skill.name, current);

        if (skill.level >= 4) strong += 1;
        else if (skill.level === 3) medium += 1;
        else weak += 1;
      });
    });

    const ranking = [...skills.values()]
      .map((skill) => ({ ...skill, average: Number((skill.total / skill.count).toFixed(1)) }))
      .sort((a, b) => b.average - a.average);

    const leaders = employees.filter((employee) =>
      employee.skills.some((skill) => skill.name === 'Liderança' && skill.level >= 4)
    ).length;

    const alerts = ranking
      .filter((skill) => skill.average < 2.8)
      .map((skill) => ({
        id: skill.name,
        type: 'danger',
        title: `Gargalo em ${skill.name}`,
        desc: `Média ${skill.average}/5. Recomenda-se uma trilha de capacitação para reduzir risco operacional.`
      }));

    if (employees.length > 0 && leaders < Math.ceil(employees.length * 0.25)) {
      alerts.push({
        id: 'lideranca',
        type: 'warning',
        title: 'Pipeline de liderança baixo',
        desc: 'Há poucos colaboradores prontos para assumir gestão. Um plano de sucessão pode evitar dependência de poucos perfis.'
      });
    }

    const total = strong + medium + weak;
    return {
      ranking,
      stats: {
        total,
        strong,
        medium,
        weak,
        strongPct: total ? Math.round((strong / total) * 100) : 0,
        mediumPct: total ? Math.round((medium / total) * 100) : 0,
        weakPct: total ? Math.round((weak / total) * 100) : 0,
        leaders
      },
      alerts
    };
  }, [employees]);
}

function DashboardView({ employees }) {
  const { ranking, stats, alerts } = useCompanyInsights(employees);
  const donut = `conic-gradient(var(--success) 0 ${stats.strongPct}%, var(--warning) ${stats.strongPct}% ${stats.strongPct + stats.mediumPct}%, var(--danger) ${stats.strongPct + stats.mediumPct}% 100%)`;

  return (
    <section className="view-stack">
      <div className="hero-panel">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> Inteligência de talentos</span>
          <h2>Mapeie competências, encontre potencial e decida melhor.</h2>
          <p>
            A TalentTrack-Parex organiza habilidades técnicas e comportamentais para indicar melhores funções,
            treinamentos necessários e oportunidades reais de crescimento.
          </p>
        </div>
        <div className="hero-score">
          <span>Saúde geral</span>
          <strong>{stats.strongPct}%</strong>
          <small>competências fortes</small>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard icon={Users} label="Colaboradores" value={employees.length} />
        <MetricCard icon={Target} label="Competências mapeadas" value={stats.total} />
        <MetricCard icon={TrendingUp} label="Altos talentos" value={stats.strong} tone="success" />
        <MetricCard icon={Award} label="Líderes prontos" value={stats.leaders} tone="brand" />
      </div>

      <div className="dashboard-grid">
        <article className="panel compact-panel">
          <div className="panel-heading">
            <div>
              <h3>Saúde das competências</h3>
              <p>Distribuição por nível de domínio</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: donut }}>
              <div>
                <strong>{stats.total}</strong>
                <span>total</span>
              </div>
            </div>
          </div>
          <Legend color="success" label="Fortalezas" value={`${stats.strongPct}%`} />
          <Legend color="warning" label="Adequadas" value={`${stats.mediumPct}%`} />
          <Legend color="danger" label="Carências" value={`${stats.weakPct}%`} />
        </article>

        <article className="panel alert-panel">
          <div className="panel-heading">
            <div>
              <h3>Alertas e recomendações</h3>
              <p>Sinais gerados a partir das notas atuais</p>
            </div>
            <Bell size={20} />
          </div>
          <div className="alert-list">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  {alert.type === 'danger' ? <AlertTriangle size={19} /> : <AlertCircle size={19} />}
                  <div>
                    <b>{alert.title}</b>
                    <span>{alert.desc}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Award size={42} />
                <b>Equipe equilibrada</b>
                <span>Nenhum gargalo crítico foi detectado no momento.</span>
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-heading">
          <div>
            <h3>Desempenho por competência</h3>
            <p>Ranking geral da TalentTrack-Parex</p>
          </div>
          <BrainCircuit size={20} />
        </div>
        <div className="ranking-grid">
          <RankingList title="Maiores fortalezas" tone="success" items={ranking.slice(0, 5)} />
          <RankingList title="Gargalos críticos" tone="danger" items={ranking.slice(-5).reverse()} />
        </div>
      </article>
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, tone = 'neutral' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Legend({ color, label, value }) {
  return (
    <div className="legend-row">
      <span><i className={color} />{label}</span>
      <b>{value}</b>
    </div>
  );
}

function RankingList({ title, tone, items }) {
  return (
    <div>
      <h4 className={tone}>{title}</h4>
      <div className="ranking-list">
        {items.map((skill) => (
          <div key={skill.name} className="ranking-item">
            <div>
              <span>{skill.name}</span>
              <b>{skill.average.toFixed(1)}</b>
            </div>
            <div className="progress-track">
              <span className={tone} style={{ width: `${(skill.average / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeListView({ employees, onSelectEmployee, onAddEmployee }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', department: '' });

  const filtered = employees.filter((employee) => {
    const term = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term)
    );
  });

  function handleSubmit(event) {
    event.preventDefault();
    onAddEmployee({ ...newEmployee, skills: [] });
    setNewEmployee({ name: '', role: '', department: '' });
    setShowAddForm(false);
  }

  return (
    <section className="view-stack">
      <div className="toolbar">
        <div>
          <h2>Diretório de colaboradores</h2>
          <p>Consulte perfis, competências e oportunidades de desenvolvimento.</p>
        </div>
        <div className="toolbar-actions">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por nome, cargo ou área"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <button className={showAddForm ? 'button secondary' : 'button primary'} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? 'Cancelar' : 'Adicionar'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <TextInput label="Nome completo" value={newEmployee.name} onChange={(name) => setNewEmployee({ ...newEmployee, name })} />
          <TextInput label="Cargo" value={newEmployee.role} onChange={(role) => setNewEmployee({ ...newEmployee, role })} />
          <TextInput label="Departamento" value={newEmployee.department} onChange={(department) => setNewEmployee({ ...newEmployee, department })} />
          <button className="button success" type="submit"><Save size={17} /> Salvar</button>
        </form>
      )}

      <div className="employee-grid">
        {filtered.map((employee) => {
          const avg = employee.skills.length
            ? employee.skills.reduce((sum, skill) => sum + clampLevel(skill.level), 0) / employee.skills.length
            : 0;

          return (
            <article key={employee.id} className="employee-card">
              <div className="employee-card__top">
                <img src={employee.avatar} alt={employee.name} />
                <div>
                  <h3>{employee.name}</h3>
                  <p>{employee.role}</p>
                  <span><Briefcase size={14} /> {employee.department}</span>
                </div>
              </div>
              <div className="employee-card__stats">
                <span>{employee.skills.length} competências</span>
                <b>{avg ? avg.toFixed(1) : '0.0'} média</b>
              </div>
              <button className="profile-link" onClick={() => onSelectEmployee(employee)}>
                Gerenciar perfil <ChevronRight size={17} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function EmployeeProfileView({ employee, onBack, onUpdateEmployee }) {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(employee.skills);
  const [profile, setProfile] = useState({
    name: employee.name,
    role: employee.role,
    department: employee.department,
    avatar: employee.avatar
  });
  const [newSkill, setNewSkill] = useState({ name: '', type: 'hard', level: 3 });

  const analysis = useMemo(() => {
    const strengths = skills.filter((skill) => skill.level >= 4);
    const weaknesses = skills.filter((skill) => skill.level <= 2);
    const hardSkills = skills.filter((skill) => skill.type === 'hard');
    const softSkills = skills.filter((skill) => skill.type === 'soft');
    const suggestions = [];
    const trainings = weaknesses.map((skill) => `Curso de nivelamento em ${skill.name}`);

    const techHigh = hardSkills.filter((skill) => skill.level >= 4).length >= 2;
    const leadershipHigh = softSkills.some((skill) => skill.name === 'Liderança' && skill.level >= 4);
    const communicationHigh = softSkills.some((skill) => skill.name === 'Comunicação' && skill.level >= 4);

    if (techHigh && leadershipHigh) {
      suggestions.push('Perfil indicado para Tech Lead, coordenação ou mentoria de equipe.');
    } else if (techHigh) {
      suggestions.push('Perfil forte para projetos técnicos de alta complexidade e atuação especialista.');
    } else if (leadershipHigh || communicationHigh) {
      suggestions.push('Bom potencial para interface com áreas, treinamento interno e liderança situacional.');
    } else {
      suggestions.push('Priorizar desenvolvimento das competências atuais antes de uma movimentação de função.');
    }

    if (weaknesses.some((skill) => skill.type === 'soft')) {
      trainings.push('Trilha comportamental com feedback, comunicação e gestão de conflitos');
    }

    return { strengths, weaknesses, hardSkills, softSkills, suggestions, trainings };
  }, [skills]);

  function handleSkillChange(index, level) {
    setSkills((current) => current.map((skill, skillIndex) => (
      skillIndex === index ? { ...skill, level: clampLevel(level) } : skill
    )));
  }

  function handleRemoveSkill(index) {
    setSkills((current) => current.filter((_, skillIndex) => skillIndex !== index));
  }

  function handleAddSkill() {
    if (!newSkill.name.trim()) return;
    setSkills((current) => [...current, { ...newSkill, name: newSkill.name.trim(), level: clampLevel(newSkill.level) }]);
    setNewSkill({ name: '', type: 'hard', level: 3 });
  }

  function handleSave() {
    onUpdateEmployee(employee.id, { ...profile, skills });
    setIsEditing(false);
  }

  function handleCancel() {
    setSkills(employee.skills);
    setProfile({ name: employee.name, role: employee.role, department: employee.department, avatar: employee.avatar });
    setNewSkill({ name: '', type: 'hard', level: 3 });
    setIsEditing(false);
  }

  return (
    <section className="view-stack profile-view">
      <button className="back-button" onClick={onBack}><ChevronLeft size={18} /> Voltar para colaboradores</button>

      <article className="profile-header">
        <img src={profile.avatar} alt={profile.name} />
        <div className="profile-title">
          {isEditing ? (
            <>
              <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
              <input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} />
              <input value={profile.department} onChange={(event) => setProfile({ ...profile, department: event.target.value })} />
            </>
          ) : (
            <>
              <h2>{profile.name}</h2>
              <p>{profile.role}</p>
              <span><Briefcase size={14} /> {profile.department}</span>
            </>
          )}
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="button secondary" onClick={handleCancel}><X size={17} /> Cancelar</button>
              <button className="button success" onClick={handleSave}><Save size={17} /> Salvar</button>
            </>
          ) : (
            <button className="button primary" onClick={() => setIsEditing(true)}><Edit2 size={17} /> Editar perfil</button>
          )}
        </div>
      </article>

      <div className="profile-grid">
        <div className="view-stack">
          <SkillPanel title="Hard skills" icon={BrainCircuit} skills={skills} type="hard" isEditing={isEditing} onChange={handleSkillChange} onRemove={handleRemoveSkill} />
          <SkillPanel title="Soft skills" icon={Users} skills={skills} type="soft" isEditing={isEditing} onChange={handleSkillChange} onRemove={handleRemoveSkill} />

          {isEditing && (
            <article className="panel add-skill-panel">
              <div className="panel-heading">
                <div>
                  <h3>Adicionar competência</h3>
                  <p>Inclua habilidades técnicas ou comportamentais.</p>
                </div>
                <Plus size={20} />
              </div>
              <div className="add-skill-form">
                <label className="field">
                  <span>Habilidade</span>
                  <input value={newSkill.name} placeholder="Ex: Python" onChange={(event) => setNewSkill({ ...newSkill, name: event.target.value })} />
                </label>
                <label className="field">
                  <span>Tipo</span>
                  <select value={newSkill.type} onChange={(event) => setNewSkill({ ...newSkill, type: event.target.value })}>
                    <option value="hard">Técnica</option>
                    <option value="soft">Comportamental</option>
                  </select>
                </label>
                <label className="field">
                  <span>Nível</span>
                  <input type="number" min="1" max="5" value={newSkill.level} onChange={(event) => setNewSkill({ ...newSkill, level: clampLevel(event.target.value) })} />
                </label>
                <button className="button primary" onClick={handleAddSkill}><Plus size={17} /> Adicionar</button>
              </div>
            </article>
          )}
        </div>

        <aside className="analysis-column">
          <AnalysisPanel icon={Sparkles} title="Sugestão inteligente" tone="brand" items={analysis.suggestions} />
          <AnalysisPanel icon={GraduationCap} title="Trilhas recomendadas" tone="success" items={analysis.trainings.length ? analysis.trainings : ['Nenhum treinamento urgente detectado.']} />
          <TagPanel title="Maiores forças" icon={Award} tone="warning" items={analysis.strengths.map((skill) => skill.name)} empty="Nenhum ponto forte identificado." />
          <TagPanel title="Pontos de atenção" icon={AlertCircle} tone="danger" items={analysis.weaknesses.map((skill) => skill.name)} empty="Sem pontos críticos." />
        </aside>
      </div>
    </section>
  );
}

function SkillPanel({ title, icon: Icon, skills, type, isEditing, onChange, onRemove }) {
  const typedSkills = skills
    .map((skill, index) => ({ ...skill, originalIndex: index }))
    .filter((skill) => skill.type === type);

  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{type === 'hard' ? 'Competências técnicas do cargo' : 'Comportamentos e colaboração'}</p>
        </div>
        <Icon size={20} />
      </div>
      {typedSkills.length ? (
        <div className="skills-list">
          {typedSkills.map((skill) => (
            isEditing ? (
              <EditableSkill key={`${skill.name}-${skill.originalIndex}`} skill={skill} index={skill.originalIndex} onChange={onChange} onRemove={onRemove} />
            ) : (
              <SkillBar key={`${skill.name}-${skill.originalIndex}`} name={skill.name} level={skill.level} />
            )
          ))}
        </div>
      ) : (
        <p className="muted">Nenhuma competência cadastrada.</p>
      )}
    </article>
  );
}

function AnalysisPanel({ icon: Icon, title, tone, items }) {
  return (
    <article className={`panel analysis-panel ${tone}`}>
      <div className="panel-heading">
        <div><h3>{title}</h3></div>
        <Icon size={20} />
      </div>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

function TagPanel({ icon: Icon, title, tone, items, empty }) {
  return (
    <article className="panel tag-panel">
      <div className="panel-heading">
        <div><h3>{title}</h3></div>
        <Icon size={20} />
      </div>
      <div className="tag-list">
        {items.length ? items.map((item) => <span key={item} className={tone}>{item}</span>) : <p className="muted">{empty}</p>}
      </div>
    </article>
  );
}

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  function navigateTo(view) {
    setCurrentView(view);
    setSelectedEmployee(null);
  }

  function handleAddEmployee(newEmployee) {
    setEmployees((current) => [
      ...current,
      {
        ...newEmployee,
        id: Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmployee.name)}&background=0f766e&color=fff`
      }
    ]);
  }

  function handleUpdateEmployee(id, updatedData) {
    setEmployees((current) => {
      const updated = current.map((employee) => (employee.id === id ? { ...employee, ...updatedData } : employee));
      setSelectedEmployee(updated.find((employee) => employee.id === id));
      return updated;
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <LogoMark />
          <div>
            <h1>TalentTrack-Parex</h1>
            <span>Gestão de talentos</span>
          </div>
        </div>
        <nav className="nav-list">
          <button className={currentView === 'dashboard' && !selectedEmployee ? 'active' : ''} onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={currentView === 'employees' || selectedEmployee ? 'active' : ''} onClick={() => navigateTo('employees')}>
            <Users size={20} /> Colaboradores
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div>
            <b>Admin Parex</b>
            <span>Mapa de competências</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {selectedEmployee ? (
          <EmployeeProfileView employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} onUpdateEmployee={handleUpdateEmployee} />
        ) : currentView === 'dashboard' ? (
          <DashboardView employees={employees} />
        ) : (
          <EmployeeListView employees={employees} onSelectEmployee={setSelectedEmployee} onAddEmployee={handleAddEmployee} />
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
