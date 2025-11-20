import React, { useState, useEffect } from 'react';

// Type Definitions
interface Subject {
  id: string;
  name: string;
  color: string;
  studiedHours: number;
  targetHours: number;
  lastStudied?: Date;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number;
  date: Date;
}

type TabType = 'subjects' | 'schedule' | 'assignments' | 'analytics';

const App: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabType>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    deadline: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem('studyflow_subjects');
    const savedAssignments = localStorage.getItem('studyflow_assignments');
    const savedSessions = localStorage.getItem('studyflow_sessions');
    
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedAssignments) {
      const parsed = JSON.parse(savedAssignments);
      setAssignments(parsed.map((a: any) => ({ ...a, deadline: new Date(a.deadline) })));
    }
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setStudySessions(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studyflow_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyflow_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('studyflow_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Subject Functions
  const addSubject = () => {
    if (newSubjectName.trim()) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName,
        color: colors[Math.floor(Math.random() * colors.length)],
        studiedHours: 0,
        targetHours: 40
      };
      setSubjects([...subjects, newSubject]);
      setNewSubjectName('');
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setStudySessions(studySessions.filter(s => s.subjectId !== id));
  };

  const addStudyTime = (subjectId: string, hours: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    setSubjects(subjects.map(s => 
      s.id === subjectId 
        ? { ...s, studiedHours: s.studiedHours + hours, lastStudied: new Date() }
        : s
    ));

    const session: StudySession = {
      id: Date.now().toString(),
      subjectId,
      subjectName: subject.name,
      duration: hours,
      date: new Date()
    };
    setStudySessions([...studySessions, session]);
  };

  // Assignment Functions
  const addAssignmentHandler = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.deadline) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        title: newAssignment.title,
        subject: newAssignment.subject,
        deadline: new Date(newAssignment.deadline),
        priority: newAssignment.priority,
        completed: false
      };
      setAssignments([...assignments, assignment]);
      setNewAssignment({ title: '', subject: '', deadline: '', priority: 'Medium' });
    }
  };

  const toggleAssignmentCompletion = (id: string) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const removeAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  // Analytics & AI Functions
  const getAIRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const now = new Date();

    // Check for overdue assignments
    const overdueAssignments = assignments.filter(a => 
      !a.completed && a.deadline < now
    );
    if (overdueAssignments.length > 0) {
      recommendations.push(`⚠️ You have ${overdueAssignments.length} overdue assignment(s). Complete them urgently!`);
    }

    // Check for upcoming deadlines (within 3 days)
    const upcomingAssignments = assignments.filter(a => {
      const daysUntilDeadline = Math.ceil((a.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return !a.completed && daysUntilDeadline > 0 && daysUntilDeadline <= 3;
    });
    if (upcomingAssignments.length > 0) {
      recommendations.push(`📅 ${upcomingAssignments.length} assignment(s) due in the next 3 days.`);
    }

    // Subject-specific recommendations
    subjects.forEach(subject => {
      const progress = (subject.studiedHours / subject.targetHours) * 100;
      if (progress < 30) {
        if (subject.name.toLowerCase().includes('dsa') || subject.name.toLowerCase().includes('algorithm')) {
          recommendations.push(`💡 DSA needs attention: Practice LeetCode/CodeForces problems daily (Arrays, LinkedLists, Trees).`);
        } else if (subject.name.toLowerCase().includes('dbms') || subject.name.toLowerCase().includes('database')) {
          recommendations.push(`💡 DBMS: Focus on Normalization, SQL queries, Transactions, and Indexing for GATE.`);
        } else if (subject.name.toLowerCase().includes('os') || subject.name.toLowerCase().includes('operating')) {
          recommendations.push(`💡 OS: Cover Process Scheduling, Deadlocks, Memory Management, and Paging.`);
        } else {
          recommendations.push(`💡 ${subject.name}: You're at ${progress.toFixed(0)}% progress. Increase study time!`);
        }
      }
    });

    // GATE-specific recommendations
    if (subjects.some(s => s.name.toLowerCase().includes('gate'))) {
      recommendations.push(`🎯 GATE Prep: Solve previous year questions and take mock tests regularly.`);
    }

    if (recommendations.length === 0) {
      recommendations.push(`✅ Great work! Keep maintaining your study schedule.`);
      recommendations.push(`📚 Consider adding more subjects or increasing target hours for comprehensive preparation.`);
    }

    return recommendations;
  };

  const getTotalStudyHours = (): number => {
    return subjects.reduce((sum, s) => sum + s.studiedHours, 0);
  };

  const getWeeklyStudyHours = (): number => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return studySessions
      .filter(s => s.date >= weekAgo)
      .reduce((sum, s) => sum + s.duration, 0);
  };

  const getCompletionRate = (): number => {
    if (assignments.length === 0) return 0;
    return (assignments.filter(a => a.completed).length / assignments.length) * 100;
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center' as const,
      color: 'white',
      marginBottom: '30px'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap' as const
    },
    tab: (active: boolean) => ({
      padding: '12px 24px',
      background: active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '25px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: active ? 'bold' : 'normal',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: active ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
    }),
    contentCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    card: (color: string) => ({
      background: color,
      borderRadius: '15px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }),
    button: {
      padding: '10px 20px',
      background: '#667eea',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
    },
    input: {
      padding: '12px',
      borderRadius: '10px',
      border: '2px solid #e0e0e0',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box' as const,
      marginBottom: '10px'
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '10px',
      height: '10px',
      overflow: 'hidden',
      marginTop: '10px'
    },
    progressFill: (percent: number) => ({
      background: 'white',
      height: '100%',
      width: `${percent}%`,
      transition: 'width 0.5s ease',
      borderRadius: '10px'
    })
  };

  // Tab Content Rendering
  const renderSubjectsTab = () => (
    <div>
      <h2 style={{ color: '#667eea', marginBottom: '20px' }}>My Subjects</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Enter subject name (e.g., DSA, DBMS, OS)"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSubject()}
          style={{ ...styles.input, flex: 1, minWidth: '250px' }}
        />
        <button onClick={addSubject} style={styles.button}>
          Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <p>No subjects added yet. Start by adding your first subject!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {subjects.map(subject => {
            const progress = (subject.studiedHours / subject.targetHours) * 100;
            return (
              <div key={subject.id} style={styles.card(subject.color)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>{subject.name}</h3>
                  <button
                    onClick={() => removeSubject(subject.id)}
                    style={{ background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '5px', padding: '5px 10px', color: 'white', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
                  {subject.studiedHours.toFixed(1)} / {subject.targetHours} hours
                </p>
                
                <div style={styles.progressBar}>
                  <div style={styles.progressFill(Math.min(progress, 100))} />
                </div>
                
                <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
                  Progress: {progress.toFixed(0)}%
                </p>
                
                {subject.lastStudied && (
                  <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
                    Last studied: {new Date(subject.lastStudied).toLocaleDateString()}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '15px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => addStudyTime(subject.id, 0.5)}
                    style={{ ...styles.button, background: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: '8px 12px', flex: 1 }}
                  >
                    +30min
                  </button>
                  <button
                    onClick={() => addStudyTime(subject.id, 1)}
                    style={{ ...styles.button, background: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: '8px 12px', flex: 1 }}
                  >
                    +1hr
                  </button>
                  <button
                    onClick={() => addStudyTime(subject.id, 2)}
                    style={{ ...styles.button, background: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: '8px 12px', flex: 1 }}
                  >
                    +2hr
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderScheduleTab = () => (
    <div>
      <h2 style={{ color: '#667eea', marginBottom: '20px' }}>Study Schedule</h2>
      
      <div style={styles.grid}>
        {subjects.map(subject => {
          const progress = (subject.studiedHours / subject.targetHours) * 100;
          return (
            <div key={subject.id} style={{ background: '#f8f9fa', borderRadius: '15px', padding: '20px', border: `3px solid ${subject.color}` }}>
              <h3 style={{ color: subject.color, marginBottom: '10px' }}>{subject.name}</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                {subject.studiedHours.toFixed(1)} / {subject.targetHours} hours completed
              </p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill(Math.min(progress, 100)), background: subject.color }} />
              </div>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '10px' }}>
                {progress >= 100 ? '✅ Target Achieved!' : `${(subject.targetHours - subject.studiedHours).toFixed(1)} hours remaining`}
              </p>
            </div>
          );
        })}
      </div>

      {studySessions.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Recent Study Sessions</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {studySessions.slice(-10).reverse().map(session => (
              <div key={session.id} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#667eea' }}>{session.subjectName}</strong>
                  <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0 0' }}>
                    {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#764ba2' }}>
                  {session.duration}h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAssignmentsTab = () => {
    const pendingAssignments = assignments.filter(a => !a.completed);
    const completedAssignments = assignments.filter(a => a.completed);
    const now = new Date();

    return (
      <div>
        <h2 style={{ color: '#667eea', marginBottom: '20px' }}>Assignments & Deadlines</h2>
        
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, color: '#667eea' }}>Add New Assignment</h3>
          <input
            type="text"
            placeholder="Assignment title"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Subject"
            value={newAssignment.subject}
            onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
            style={styles.input}
          />
          <input
            type="date"
            value={newAssignment.deadline}
            onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
            style={styles.input}
          />
          <select
            value={newAssignment.priority}
            onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
            style={styles.input}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button onClick={addAssignmentHandler} style={styles.button}>
            Add Assignment
          </button>
        </div>

        <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Pending Assignments ({pendingAssignments.length})</h3>
        {pendingAssignments.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No pending assignments. Great job!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pendingAssignments.map(assignment => {
              const daysUntilDeadline = Math.ceil((assignment.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntilDeadline < 0;
              const isUrgent = daysUntilDeadline >= 0 && daysUntilDeadline <= 3;
              
              const priorityColors = { High: '#ff4757', Medium: '#ffa502', Low: '#2ed573' };
              
              return (
                <div key={assignment.id} style={{ background: isOverdue ? '#ffe6e6' : isUrgent ? '#fff4e6' : '#f8f9fa', padding: '20px', borderRadius: '15px', border: `3px solid ${priorityColors[assignment.priority]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{assignment.title}</h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>
                        Subject: <strong>{assignment.subject}</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: isOverdue ? '#ff4757' : isUrgent ? '#ffa502' : '#666' }}>
                        {isOverdue ? `⚠️ Overdue by ${Math.abs(daysUntilDeadline)} days` : isUrgent ? `🔥 Due in ${daysUntilDeadline} days` : `Due: ${assignment.deadline.toLocaleDateString()}`}
                      </p>
                    </div>
                    <span style={{ padding: '5px 12px', background: priorityColors[assignment.priority], color: 'white', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                      {assignment.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => toggleAssignmentCompletion(assignment.id)} style={{ ...styles.button, background: '#2ed573' }}>
                      ✓ Mark Complete
                    </button>
                    <button onClick={() => removeAssignment(assignment.id)} style={{ ...styles.button, background: '#ff4757' }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedAssignments.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: '#2ed573', marginBottom: '15px' }}>✓ Completed Assignments ({completedAssignments.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completedAssignments.map(assignment => (
                <div key={assignment.id} style={{ background: '#e6ffe6', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#2ed573', textDecoration: 'line-through' }}>{assignment.title}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>{assignment.subject}</p>
                  </div>
                  <button onClick={() => toggleAssignmentCompletion(assignment.id)} style={{ ...styles.button, background: '#ffa502', fontSize: '12px', padding: '8px 15px' }}>
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    const totalHours = getTotalStudyHours();
    const weeklyHours = getWeeklyStudyHours();
    const completionRate = getCompletionRate();
    const recommendations = getAIRecommendations();
    const now = new Date();
    const upcomingDeadlines = assignments
      .filter(a => !a.completed && a.deadline >= now)
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
      .slice(0, 5);

    return (
      <div>
        <h2 style={{ color: '#667eea', marginBottom: '30px' }}>Analytics & Insights</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Total Study Hours</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{totalHours.toFixed(1)}h</p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #2ed573, #17c969)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9' }}>This Week</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{weeklyHours.toFixed(1)}</p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #ffa502, #ff6348)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9' }}>Completion Rate</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }>{completionRate.toFixed(0)}%</p>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
          <h3 style={{ color: '#667eea', marginTop: 0, marginBottom: '20px' }}>🤖 AI-Powered Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '14px', lineHeight: '1.6' }}>
                {rec}
              </div>
            ))}
          </div>
        </div>

        {subjects.length > 0 && (
          <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
            <h3 style={{ color: '#667eea', marginTop: 0, marginBottom: '20px' }}>Subject-wise Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {subjects.map(subject => {
                const progress = (subject.studiedHours / subject.targetHours) * 100;
                return (
                  <div key={subject.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', border: `3px solid ${subject.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: subject.color }}>{subject.name}</h4>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: subject.color }}>
                        {subject.studiedHours.toFixed(1)}h
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill(Math.min(progress, 100)), background: subject.color }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                      {progress.toFixed(1)}% of {subject.targetHours}h target
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {upcomingDeadlines.length > 0 && (
          <div style={{ background: '#fff4e6', padding: '25px', borderRadius: '15px', border: '3px solid #ffa502' }}>
            <h3 style={{ color: '#ffa502', marginTop: 0, marginBottom: '20px' }}>📅 Upcoming Deadlines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingDeadlines.map(assignment => {
                const daysUntil = Math.ceil((assignment.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={assignment.id} style={{ background: 'white', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#333' }}>{assignment.title}</strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>{assignment.subject}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: daysUntil <= 3 ? '#ff4757' : '#ffa502' }}>
                        {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                      </p>
                      <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#888' }}>
                        {assignment.deadline.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main Return
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '48px', fontWeight: 'bold' }}>StudyFlow AI</h1>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>Smart Study Management for BTech CSE Students</p>
      </div>

      <div style={styles.tabContainer}>
        <button
          style={styles.tab(activeTab === 'subjects')}
          onClick={() => setActiveTab('subjects')}
        >
          📚 Subjects
        </button>
        <button
          style={styles.tab(activeTab === 'schedule')}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button
          style={styles.tab(activeTab === 'assignments')}
          onClick={() => setActiveTab('assignments')}
        >
          ✅ Assignments
        </button>
        <button
          style={styles.tab(activeTab === 'analytics')}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      <div style={styles.contentCard}>
        {activeTab === 'subjects' && renderSubjectsTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', color: 'white', opacity: 0.8, fontSize: '14px' }}>
        <p>🚀 Enhanced StudyFlow - Powered by AI for BTech CSE & GATE Preparation</p>
      </div>
    </div>
  );
};

export default App;
