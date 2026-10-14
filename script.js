/**
 * Todo Pro - Professional Task Management Application
 * Pure Vanilla JavaScript (ES6+)
 */

// =============================================================================
// Sound FX via Web Audio API (Synthesizer)
// =============================================================================
class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.isAlarmRinging = false;
    this.alarmInterval = null;
    this.vibrationInterval = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    } catch (_) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.16); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now + 0.16);
      osc1.stop(now + 0.16);
      osc2.stop(now + 0.35);
    } catch (_) {}
  }

  playDelete() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.13);
    } catch (_) {}
  }

  startAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    if (this.isAlarmRinging) return;
    this.isAlarmRinging = true;

    const playBeepCycle = () => {
      if (!this.isAlarmRinging || !this.audioCtx) return;
      try {
        const now = this.audioCtx.currentTime;
        // Classic electronic alarm clock 4-beep pulse sequence
        [0, 0.12, 0.24, 0.36].forEach((delay, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(idx % 2 === 0 ? 1046.5 : 1318.5, now + delay);
          gain.gain.setValueAtTime(0.24, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.09);
        });
      } catch (_) {}
    };

    playBeepCycle();
    this.alarmInterval = setInterval(playBeepCycle, 950);
  }

  stopAlarm() {
    this.isAlarmRinging = false;
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  startVibration() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600, 300]);
        this.vibrationInterval = setInterval(() => {
          if ('vibrate' in navigator) {
            navigator.vibrate([400, 200, 400, 200, 600, 300]);
          }
        }, 2000);
      } catch (_) {}
    }
  }

  stopVibration() {
    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch (_) {}
    }
  }
}

// =============================================================================
// Confetti Animation Controller
// =============================================================================
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;
    this.colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire() {
    if (!this.canvas || !this.ctx) return;
    this.particles = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        r: Math.random() * 5 + 3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: Math.random() * 0.08 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        gravity: 0.35,
        opacity: 1
      });
    }

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animate();
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeParticles = 0;
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.009;
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      if (p.opacity > 0 && p.y < this.canvas.height + 20) {
        activeParticles++;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.rect(p.x + p.tilt, p.y, p.r * 1.5, p.r);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    if (activeParticles > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

// =============================================================================
// Todo Pro Application Logic
// =============================================================================
class TodoApp {
  constructor() {
    this.STORAGE_KEY = 'todo_pro_tasks_v1';
    this.THEME_KEY = 'todo_pro_theme';
    this.SOUND_KEY = 'todo_pro_sound';

    this.sound = new SoundFX();
    this.confetti = new ConfettiEffect('confetti-canvas');

    // State
    this.tasks = [];
    this.currentFilter = 'all'; // 'all' | 'active' | 'completed'
    this.currentCategory = 'all'; // 'all' | category name
    this.searchQuery = '';
    this.editingTaskId = null;

    // Alarm & Notification State
    this.currentRingingTask = null;
    this.originalTitle = document.title;
    this.titleFlashInterval = null;
    this.alarmCheckerInterval = null;

    // DOM Elements Cache
    this.elements = {
      taskForm: document.getElementById('task-form'),
      taskInput: document.getElementById('task-input'),
      autoBreakdownCheckbox: document.getElementById('auto-breakdown-checkbox'),
      taskCategory: document.getElementById('task-category'),
      taskPriority: document.getElementById('task-priority'),
      taskDueDate: document.getElementById('task-due-date'),
      taskDueTime: document.getElementById('task-due-time'),
      resetTimeBtn: document.getElementById('reset-time-btn'),
      alarmModal: document.getElementById('alarm-modal'),
      alarmTaskTitle: document.getElementById('alarm-task-title'),
      alarmTaskCategory: document.getElementById('alarm-task-category'),
      alarmTaskPriority: document.getElementById('alarm-task-priority'),
      alarmTaskTime: document.getElementById('alarm-task-time'),
      alarmCompleteBtn: document.getElementById('alarm-complete-btn'),
      alarmSnoozeBtn: document.getElementById('alarm-snooze-btn'),
      alarmStopBtn: document.getElementById('alarm-stop-btn'),
      notifToggleBtn: document.getElementById('notif-toggle-btn'),
      testAlarmBtn: document.getElementById('test-alarm-btn'),
      alarmPresetButtons: document.querySelectorAll('.preset-time-btn[data-add-minutes]'),
      tasksList: document.getElementById('tasks-list'),
      emptyState: document.getElementById('empty-state'),
      emptyTitle: document.getElementById('empty-title'),
      emptySubtitle: document.getElementById('empty-subtitle'),
      searchInput: document.getElementById('search-input'),
      clearSearchBtn: document.getElementById('clear-search-btn'),
      currentDateText: document.getElementById('current-date-text'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeIconSun: document.getElementById('theme-icon-sun'),
      themeIconMoon: document.getElementById('theme-icon-moon'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      soundIconOn: document.getElementById('sound-icon-on'),
      soundIconOff: document.getElementById('sound-icon-off'),
      progressBar: document.getElementById('progress-bar'),
      statsPercent: document.getElementById('stats-percent'),
      statsStatusText: document.getElementById('stats-status-text'),
      statsSummaryText: document.getElementById('stats-summary-text'),
      countAll: document.getElementById('count-all'),
      countActive: document.getElementById('count-active'),
      countCompleted: document.getElementById('count-completed'),
      pendingTasksText: document.getElementById('pending-tasks-text'),
      toggleAllBtn: document.getElementById('toggle-all-btn'),
      clearCompletedBtn: document.getElementById('clear-completed-btn'),
      categoryChips: document.getElementById('category-chips'),
      filterTabs: document.querySelectorAll('.tab-btn'),
      toastContainer: document.getElementById('toast-container'),
    };

    this.init();
  }

  init() {
    this.initDate();
    this.initTheme();
    this.initSoundSetting();
    this.initNotificationButton();
    this.loadTasks();
    this.bindEvents();
    this.startAlarmChecker();
    this.render();
  }

  // --- Initial Setup & Preferences ---

  initDate() {
    try {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = now.toLocaleDateString('uz-UZ', options);
      // Capitalize first letter
      this.elements.currentDateText.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (_) {
      this.elements.currentDateText.textContent = "Bugun - Yangi marralar sari";
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    if (theme === 'dark') {
      this.elements.themeIconSun.style.display = 'none';
      this.elements.themeIconMoon.style.display = 'block';
    } else {
      this.elements.themeIconSun.style.display = 'block';
      this.elements.themeIconMoon.style.display = 'none';
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    this.showToast(nextTheme === 'dark' ? "Tungi rejim yoqildi" : "Kunduzgi rejim yoqildi", 'info');
  }

  initSoundSetting() {
    const soundPref = localStorage.getItem(this.SOUND_KEY);
    const isSoundOn = soundPref !== 'false';
    this.setSound(isSoundOn);
  }

  setSound(enabled) {
    this.sound.enabled = enabled;
    localStorage.setItem(this.SOUND_KEY, enabled.toString());
    if (enabled) {
      this.elements.soundIconOn.style.display = 'block';
      this.elements.soundIconOff.style.display = 'none';
      this.elements.soundToggleBtn.classList.add('active');
    } else {
      this.elements.soundIconOn.style.display = 'none';
      this.elements.soundIconOff.style.display = 'block';
      this.elements.soundToggleBtn.classList.remove('active');
    }
  }

  toggleSound() {
    const newState = !this.sound.enabled;
    this.setSound(newState);
    this.showToast(newState ? "Ovoz effektlari yoqildi 🔔" : "Ovoz effektlari o'chirildi 🔕", 'info');
  }

  // --- Storage & Tasks State ---

  loadTasks() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        this.tasks = [];
      }
    } else {
      // Seed initial high quality sample tasks if first time
      const today = new Date().toISOString().split('T')[0];
      this.tasks = [
        {
          id: 'task-demo-1',
          text: "JavaScript darslarini takrorlash (DOM va Hodisalar)",
          category: "O'qish",
          priority: "high",
          dueDate: today,
          completed: false,
          createdAt: Date.now() - 3600000
        },
        {
          id: 'task-demo-2',
          text: "11-dars amaliy loyihasini tayyorlash",
          category: "Ish",
          priority: "high",
          dueDate: today,
          completed: false,
          createdAt: Date.now() - 7200000
        },
        {
          id: 'task-demo-3',
          text: "Kuniga 20 sahifa kitob o'qish (Clean Code)",
          category: "Shaxsiy",
          priority: "medium",
          dueDate: '',
          completed: true,
          createdAt: Date.now() - 10800000
        },
        {
          id: 'task-demo-4',
          text: "Ertalabki yugurish va mashqlar",
          category: "Sport",
          priority: "low",
          dueDate: '',
          completed: false,
          createdAt: Date.now() - 14400000
        }
      ];
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  // --- Event Bindings ---

  bindEvents() {
    // New task form submission
    this.elements.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTask();
    });

    // Theme toggle
    this.elements.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // Sound toggle
    this.elements.soundToggleBtn.addEventListener('click', () => this.toggleSound());

    // Search input
    this.elements.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.elements.clearSearchBtn.classList.toggle('visible', this.searchQuery.length > 0);
      this.render();
    });

    // Clear search
    this.elements.clearSearchBtn.addEventListener('click', () => {
      this.elements.searchInput.value = '';
      this.searchQuery = '';
      this.elements.clearSearchBtn.classList.remove('visible');
      this.elements.searchInput.focus();
      this.render();
    });

    // Filter status tabs
    this.elements.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.elements.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.getAttribute('data-filter');
        this.render();
      });
    });

    // Category chips
    this.elements.categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      this.elements.categoryChips.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      this.currentCategory = chip.getAttribute('data-category');
      this.render();
    });

    // Toggle All button
    this.elements.toggleAllBtn.addEventListener('click', () => this.handleToggleAll());

    // Clear Completed button
    this.elements.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());

    // Notification Permission button
    if (this.elements.notifToggleBtn) {
      this.elements.notifToggleBtn.addEventListener('click', () => this.requestNotificationPermission());
    }

    // Test Alarm button
    if (this.elements.testAlarmBtn) {
      this.elements.testAlarmBtn.addEventListener('click', () => this.testAlarm());
    }

    // Reset Time button
    if (this.elements.resetTimeBtn) {
      this.elements.resetTimeBtn.addEventListener('click', () => {
        if (this.elements.taskDueTime) this.elements.taskDueTime.value = '';
        if (this.elements.taskDueDate) this.elements.taskDueDate.value = '';
        this.showToast("Budilnik vaqti tozalandi", 'info');
      });
    }

    // Preset Time buttons (+1, +5, +15, +30, +60 min)
    this.elements.alarmPresetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mins = parseInt(btn.getAttribute('data-add-minutes'), 10);
        if (!isNaN(mins)) {
          this.setPresetTime(mins);
        }
      });
    });

    // Alarm Modal Actions
    if (this.elements.alarmCompleteBtn) {
      this.elements.alarmCompleteBtn.addEventListener('click', () => this.handleAlarmComplete());
    }
    if (this.elements.alarmSnoozeBtn) {
      this.elements.alarmSnoozeBtn.addEventListener('click', () => this.handleAlarmSnooze());
    }
    if (this.elements.alarmStopBtn) {
      this.elements.alarmStopBtn.addEventListener('click', () => this.handleAlarmStop());
    }

    // Delegated click events on Task List (Toggle, Edit, Delete, Save Edit, Cancel Edit)
    this.elements.tasksList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      const taskId = taskItem.dataset.id;

      // Checkbox toggle
      if (e.target.closest('.checkbox-btn')) {
        this.toggleTaskStatus(taskId);
        return;
      }

      // Toggle Subtask
      const subtaskCheckBtn = e.target.closest('[data-action="toggle-subtask"]');
      if (subtaskCheckBtn) {
        const subtaskId = subtaskCheckBtn.dataset.subtaskId;
        this.toggleSubtask(taskId, subtaskId);
        return;
      }

      // Delete Subtask
      const subtaskDelBtn = e.target.closest('[data-action="delete-subtask"]');
      if (subtaskDelBtn) {
        const subtaskId = subtaskDelBtn.dataset.subtaskId;
        this.deleteSubtask(taskId, subtaskId);
        return;
      }

      // Add Subtask button
      const subtaskAddBtn = e.target.closest('[data-action="add-subtask"]');
      if (subtaskAddBtn) {
        const container = taskItem.querySelector('.subtasks-container');
        const input = container ? container.querySelector('.subtask-add-input') : null;
        if (input && input.value.trim()) {
          this.addSubtask(taskId, input.value.trim());
        }
        return;
      }

      // Decompose button (break down task into steps)
      if (e.target.closest('[data-action="decompose"]')) {
        this.decomposeTask(taskId);
        return;
      }

      // Toggle Subtasks collapse / expand
      if (e.target.closest('[data-toggle-subtasks]')) {
        this.toggleSubtasksCollapse(taskId);
        return;
      }

      // Delete button
      if (e.target.closest('.delete-btn')) {
        this.deleteTask(taskId);
        return;
      }

      // Edit button
      if (e.target.closest('.edit-btn')) {
        this.startEditTask(taskId);
        return;
      }

      // Save Edit button
      if (e.target.closest('.edit-save-btn')) {
        this.saveEditTask(taskId);
        return;
      }

      // Cancel Edit button
      if (e.target.closest('.edit-cancel-btn')) {
        this.cancelEditTask();
        return;
      }
    });

    // Keydown handling for inline edit inputs and subtask input
    this.elements.tasksList.addEventListener('keydown', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      const taskId = taskItem.dataset.id;

      if (e.target.classList.contains('task-edit-input')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveEditTask(taskId);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.cancelEditTask();
        }
      } else if (e.target.classList.contains('subtask-add-input')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addSubtask(taskId, e.target.value.trim());
        }
      }
    });
  }

  // --- CRUD Operations ---

  handleAddTask() {
    const text = this.elements.taskInput.value.trim();
    if (!text) return;

    let dueDate = this.elements.taskDueDate.value || '';
    const dueTime = (this.elements.taskDueTime && this.elements.taskDueTime.value) || '';

    // If time is set but date is empty, intelligently select today or tomorrow
    if (dueTime && !dueDate) {
      const now = new Date();
      const [h, m] = dueTime.split(':').map(Number);
      const targetToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);

      if (targetToday.getTime() > now.getTime()) {
        const yr = now.getFullYear();
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const dy = String(now.getDate()).padStart(2, '0');
        dueDate = `${yr}-${mo}-${dy}`;
      } else {
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const yr = tomorrow.getFullYear();
        const mo = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dy = String(tomorrow.getDate()).padStart(2, '0');
        dueDate = `${yr}-${mo}-${dy}`;
      }
      this.elements.taskDueDate.value = dueDate;
    }

    // Smart Auto-Breakdown into subtasks if enabled
    let subtasks = [];
    const shouldAutoDecompose = this.elements.autoBreakdownCheckbox ? this.elements.autoBreakdownCheckbox.checked : true;
    if (shouldAutoDecompose && this.shouldDecompose(text)) {
      subtasks = this.decomposeTaskIntoSteps(text, this.elements.taskCategory.value);
    }

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      text: text,
      category: this.elements.taskCategory.value,
      priority: this.elements.taskPriority.value,
      dueDate: dueDate,
      dueTime: dueTime,
      alarmTriggered: false,
      completed: false,
      subtasks: subtasks,
      subtasksCollapsed: false,
      createdAt: Date.now()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();

    // Reset input fields
    this.elements.taskInput.value = '';
    this.elements.taskDueDate.value = '';
    if (this.elements.taskDueTime) this.elements.taskDueTime.value = '';
    this.elements.taskInput.focus();

    this.sound.playPop();

    if (subtasks.length > 0) {
      this.showToast(`Vazifa ${subtasks.length} ta ketma-ket kichik qadamlarga bo'lindi! 🪄`, 'success');
    } else if (dueTime) {
      this.showToast(`Vazifa va budilnik (${dueTime}) o'rnatildi! ⏰`, 'success');
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(() => this.initNotificationButton());
      }
    } else {
      this.showToast("Yangi vazifa muvaffaqiyatli qo'shildi! ✨", 'success');
    }

    this.render();
  }

  toggleTaskStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;

    // Synchronize all subtasks with parent status
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach(s => s.completed = task.completed);
    }

    this.saveTasks();

    if (task.completed) {
      this.sound.playSuccess();
      // Check if all tasks are now completed
      const allDone = this.tasks.length > 0 && this.tasks.every(t => t.completed);
      if (allDone) {
        this.confetti.fire();
        this.showToast("Barcha vazifalar yakunlandi! Qoyilmaqom natija! 🎉", 'success');
      }
    } else {
      this.sound.playPop();
    }

    this.render();
  }

  // --- Smart Task Decomposition (Kichik Qadamlarga Bo'lish) ---

  shouldDecompose(text) {
    if (!text) return false;
    const clean = text.trim();
    // Multi-line, delimiter or phrases
    if (clean.includes('\n') || clean.includes(';') || clean.toLowerCase().includes(' keyin ') || clean.toLowerCase().includes(" so'ng ")) {
      return true;
    }
    // Any task with 2+ words or 10+ characters
    const words = clean.split(/\s+/).filter(Boolean);
    return words.length >= 2 || clean.length >= 10;
  }

  decomposeTaskIntoSteps(text, category = '') {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    // 1. Check if user typed explicit multi-line steps
    if (raw.includes('\n')) {
      const lines = raw.split('\n').map(s => s.replace(/^[-*•\d.)\s]+/, '').trim()).filter(Boolean);
      if (lines.length >= 2) {
        return lines.map((step, i) => ({
          id: 'step-' + Date.now() + '-' + i,
          text: `${i + 1}-qadam: ${step}`,
          completed: false
        }));
      }
    }

    // 2. Check if user separated tasks with delimiters
    if (raw.includes(';') || lower.includes(' keyin ') || lower.includes(" so'ng ") || lower.includes(' va keyin ')) {
      const delimiterRegex = /;| keyin | so'ng | va keyin /i;
      const parts = raw.split(delimiterRegex).map(s => s.replace(/^[-*•\d.)\s]+/, '').trim()).filter(Boolean);
      if (parts.length >= 2) {
        return parts.map((part, i) => ({
          id: 'step-' + Date.now() + '-' + i,
          text: `${i + 1}-qadam: ${part.charAt(0).toUpperCase() + part.slice(1)}`,
          completed: false
        }));
      }
    }

    // 3. Knowledge-based Uzbek semantic rules
    const rules = [
      {
        keywords: ['sayt', 'veb', 'web', 'frontend', 'backend', 'dasturlash', 'kod', 'dastur', 'app', 'loyiha', 'react', 'javascript', 'html', 'css'],
        steps: [
          "Loyiha g'oyasi, talablari va dizaynini rejalashtirish (Figma)",
          "HTML strukturasini va zamonaviy CSS stillarini tuzish",
          "JavaScript orqali asosiy mantiq va hodisalarni ulash",
          "Barcha tugma va funksiyalarni test qilib, xatolarni to'g'rilash",
          "Loyihani GitHub yoki jonli serverga yuklash (Deploy)"
        ]
      },
      {
        keywords: ['imtihon', 'sessiya', 'test', 'nazorat', 'oraliq', 'yakuniy', 'baho'],
        steps: [
          "Barcha savollar va imtihon mavzulari ro'yxatini shakllantirish",
          "Darsliklar va ma'ruza konspektlarini sinchiklab takrorlash",
          "Namunaviy testlar va amaliy topshiriqlarni mustaqil yechish",
          "Tushunarsiz qolgan qiyin mavzularni o'rganib chiqish",
          "Yakuniy umumlashtirish va imtihonga to'liq tayyor bo'lish"
        ]
      },
      {
        keywords: ['kitob', 'mutolaa', 'o\'qish', 'oqish', 'roman', 'asar'],
        steps: [
          "Kitob mundarijasi va kirish qismi bilan tanishish",
          "Kunlik sahifalar me'yorini belgilash va mutolaani boshlash",
          "Asosiy boblarni diqqat bilan o'qib, muhim fikrlarni belgilash",
          "Muhim iqtibos va tushunchalarni qayd qilish (konspekt)",
          "Kitob bo'yicha o'z xulosasi va fikrlarini umumlashtirish"
        ]
      },
      {
        keywords: ['tozalash', 'tozalik', 'yig\'ishtirish', 'yigishtirish', 'uborka', 'tartib'],
        steps: [
          "Keraksiz buyumlarni ajratish va xonani tartibga keltirish",
          "Mebel, tokcha va yuzalardagi changlarni nam mato bilan artish",
          "Polni supurish yoki changyutkich bilan tozalash",
          "Polni yuvish, oynalarni tozalash va xonani shamollatish"
        ]
      },
      {
        keywords: ['ingliz', 'english', 'til', 'nemis', 'rus', 'koreys', 'ielts', 'til o\'rganish'],
        steps: [
          "20 ta yangi lug'at so'zlarini yodlash va talaffuzini mashq qilish",
          "Grammatik qoidani tushunib, mashqlar bajarish",
          "15 daqiqa inglizcha audio eshitish (Listening)",
          "Matn o'qib, yangi birikmalarni tahlil qilish (Reading)",
          "10 daqiqa mavzu bo'yicha mustaqil gapirish (Speaking)"
        ]
      },
      {
        keywords: ['kurs ishi', 'diplom', 'referat', 'maqola', 'esse', 'prezentatsiya', 'taqdimot'],
        steps: [
          "Mavzuni tasdiqlash va reja tuzish",
          "Kerakli adabiyotlar, maqolalar va ma'lumotlarni to'plash",
          "Kirish va asosiy amaliy qismlarni bosqichma-bosqich yozish",
          "Xulosalar chiqarish va foydalanilgan adabiyotlar ro'yxatini kiritish",
          "Imlo va formatlashni tekshirib, yakuniy taqdimotga tayyorlash"
        ]
      },
      {
        keywords: ['sayohat', 'dam olish', 'sayr', 'ta\'til', 'tatil', 'bilet', 'safar'],
        steps: [
          "Sayohat yo'nalishi va boriladigan qiziqarli joylarni tanlash",
          "Yo'l chiptalari va mehmonxona/turar joyni band qilish",
          "Kerakli hujjatlar, xarajatlar smetasi va yo'l budjetini tayyorlash",
          "Chamadon va barcha zarur shaxsiy buyumlarni yig'ish",
          "Reja asosida vaqtida yo'lga chiqish"
        ]
      },
      {
        keywords: ['mashina', 'telefon', 'noutbuk', 'xarid', 'sotib olish', 'kompyuter olish'],
        steps: [
          "Mavjud byudjet va talab qilinadigan parametrlarni belgilash",
          "Bozordagi modellar va xaridorlar sharhlarini (reviews) taqqoslash",
          "Tanlangan 2-3 ta variantni jonli ko'rish va texnik tekshiruvdan o'tkazish",
          "Kafolat va narx bo'yicha kelishib, xaridni rasmiylashtirish"
        ]
      },
      {
        keywords: ['ovqat', 'taom', 'kechki ovqat', 'tushlik', 'pishirish', 'osh', 'somsa', 'tort'],
        steps: [
          "Retseptni aniqlash va kerakli masalliqlarni tekshirish",
          "Yetishmayotgan mahsulotlarni do'kondan xarid qilish",
          "Masalliqlarni yuvish, tozalash va to'g'rab tayyorlash",
          "Pishirish bosqichlarini ketma-ketlikda bajarish",
          "Dasturxonga chiroyli qilib tortish va bezatish"
        ]
      },
      {
        keywords: ['sport', 'mashq', 'trenirovka', 'zal', 'yugurish', 'fitnes'],
        steps: [
          "5-10 daqiqalik qizdiruvchi mashqlar (Razminka)",
          "Asosiy guruh mashqlari (kuch va kardio)",
          "Qorin mushaklari (press) va mashqlar yakuni",
          "Mushaklarni cho'zish (Stretching) va suv balansini tiklash"
        ]
      },
      {
        keywords: ['rezyume', 'cv', 'ishga kirish', 'suhbat', 'portfolio', 'vakansiya'],
        steps: [
          "Rezyumeni yangi ko'nikmalar va tajribalar bilan yangilash",
          "Eng kuchli 2-3 ta loyihani portfolio sahifasiga joylash",
          "Mos keluvchi vakansiyalarni qidirish va saralash",
          "Kompaniyalarga rezyume va qisqa xat (Cover Letter) yuborish",
          "Suhbatga (Interview) tayyorgarlik ko'rish va savollarni mashq qilish"
        ]
      },
      {
        keywords: ['kompyuter', 'windows', 'format', 'drayver', 'fayllar'],
        steps: [
          "Muhim shaxsiy ma'lumotlarni tashqi xotiraga (Flashka) zaxiralash",
          "O'rnatuvchi yuklash fayli (Bootable USB) tayyorlash",
          "Tizimni toza o'rnatishni amalga oshirish",
          "Kerakli barcha drayverlar va asosiy dasturlarni o'rnatish"
        ]
      }
    ];

    for (const rule of rules) {
      if (rule.keywords.some(k => lower.includes(k))) {
        return rule.steps.map((step, i) => ({
          id: 'step-' + Date.now() + '-' + i,
          text: `${i + 1}-qadam: ${step}`,
          completed: false
        }));
      }
    }

    // 4. Universal smart progressive fallback
    const cleanTitle = raw.charAt(0).toUpperCase() + raw.slice(1);
    return [
      {
        id: 'step-' + Date.now() + '-0',
        text: `1-qadam: "${cleanTitle}" bo'yicha aniq reja va materiallarni tayyorlash`,
        completed: false
      },
      {
        id: 'step-' + Date.now() + '-1',
        text: `2-qadam: Asosiy vazifani bajarishga kirishish va dastlabki natijaga erishish`,
        completed: false
      },
      {
        id: 'step-' + Date.now() + '-2',
        text: `3-qadam: Bajarilgan ishlarni tekshirish va kamchiliklarni to'g'rilash`,
        completed: false
      },
      {
        id: 'step-' + Date.now() + '-3',
        text: `4-qadam: Yakuniy natijani tasdiqlash va ishni to'liq yakunlash`,
        completed: false
      }
    ];
  }

  decomposeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.subtasks = this.decomposeTaskIntoSteps(task.text, task.category);
    task.subtasksCollapsed = false;
    this.saveTasks();
    this.sound.playPop();
    this.showToast(`Vazifa ${task.subtasks.length} ta kichik qadamlarga bo'lindi! 🪄`, 'success');
    this.render();
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const sub = task.subtasks.find(s => s.id === subtaskId);
    if (!sub) return;

    sub.completed = !sub.completed;

    // Check if all subtasks are completed
    const allDone = task.subtasks.every(s => s.completed);
    if (allDone && !task.completed) {
      task.completed = true;
      this.sound.playSuccess();
      this.confetti.fire();
      this.showToast("Barcha qadamlar bajarildi! Vazifa yakunlandi! 🎉", 'success');
    } else if (!allDone && task.completed) {
      task.completed = false;
      this.sound.playPop();
    } else {
      this.sound.playPop();
    }

    this.saveTasks();
    this.render();
  }

  deleteSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
    this.saveTasks();
    this.showToast("Qadam o'chirildi", 'info');
    this.render();
  }

  addSubtask(taskId, text) {
    const clean = (text || '').trim();
    if (!clean) return;

    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.subtasks) task.subtasks = [];
    const stepNum = task.subtasks.length + 1;
    task.subtasks.push({
      id: 'step-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      text: `${stepNum}-qadam: ${clean}`,
      completed: false
    });

    if (task.completed) task.completed = false;
    this.saveTasks();
    this.sound.playPop();
    this.showToast("Yangi qadam qo'shildi! ➕", 'success');
    this.render();
  }

  toggleSubtasksCollapse(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.subtasksCollapsed = !task.subtasksCollapsed;
    this.saveTasks();
    this.render();
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    this.tasks.splice(index, 1);
    this.saveTasks();

    this.sound.playDelete();
    this.showToast("Vazifa o'chirildi", 'danger');
    this.render();
  }

  startEditTask(id) {
    this.editingTaskId = id;
    this.render();
    const editInput = this.elements.tasksList.querySelector(`[data-id="${id}"] .task-edit-input`);
    if (editInput) {
      editInput.focus();
      editInput.select();
    }
  }

  saveEditTask(id) {
    const taskItem = this.elements.tasksList.querySelector(`[data-id="${id}"]`);
    if (!taskItem) return;

    const input = taskItem.querySelector('.task-edit-input');
    if (!input) return;

    const newText = input.value.trim();
    if (newText) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.text = newText;
        this.saveTasks();
        this.showToast("Vazifa yangilandi", 'info');
      }
    }

    this.editingTaskId = null;
    this.render();
  }

  cancelEditTask() {
    this.editingTaskId = null;
    this.render();
  }

  handleToggleAll() {
    if (this.tasks.length === 0) return;
    const hasUncompleted = this.tasks.some(t => !t.completed);
    this.tasks.forEach(t => t.completed = hasUncompleted);
    this.saveTasks();

    if (hasUncompleted) {
      this.sound.playSuccess();
      this.confetti.fire();
      this.showToast("Barcha vazifalar bajarildi deb belgilandi! 🎉", 'success');
    } else {
      this.sound.playPop();
      this.showToast("Barcha vazifalar faol holatga qaytarildi", 'info');
    }

    this.render();
  }

  handleClearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      this.showToast("Bajarilgan vazifalar yo'q", 'info');
      return;
    }

    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveTasks();
    this.sound.playDelete();
    this.showToast(`${completedCount} ta bajarilgan vazifa tozalandi`, 'danger');
    this.render();
  }

  // --- Alarm System (Budilnik Mexanizmi) ---

  startAlarmChecker() {
    if (this.alarmCheckerInterval) clearInterval(this.alarmCheckerInterval);
    this.alarmCheckerInterval = setInterval(() => {
      this.checkAlarms();
    }, 1000);
  }

  checkAlarms() {
    if (this.currentRingingTask) return; // Already showing an alarm modal

    const now = new Date();
    const currentTimestamp = now.getTime();

    for (const task of this.tasks) {
      if (task.completed || task.alarmTriggered || !task.dueDate || !task.dueTime) {
        continue;
      }

      const [yr, mo, dy] = task.dueDate.split('-').map(Number);
      const [hr, mn] = task.dueTime.split(':').map(Number);
      const taskAlarmDate = new Date(yr, mo - 1, dy, hr, mn, 0, 0);
      const taskTimestamp = taskAlarmDate.getTime();

      // Check if task alarm time is reached (within a 24-hour window)
      if (currentTimestamp >= taskTimestamp && (currentTimestamp - taskTimestamp) < 24 * 60 * 60 * 1000) {
        this.triggerAlarm(task);
        break; // Trigger one alarm at a time
      }
    }
  }

  triggerAlarm(task) {
    this.currentRingingTask = task;
    task.alarmTriggered = true;
    this.saveTasks();

    // 1. Play continuous alarm sound
    this.sound.startAlarm();

    // 2. Start phone vibration
    this.sound.startVibration();

    // 3. Show System Notification (Desktop & Phone)
    this.sendNotification(task);

    // 4. Flash page title to catch attention
    this.startTitleFlashing(task.text);

    // 5. Populate and show Alarm Modal
    if (this.elements.alarmTaskTitle) this.elements.alarmTaskTitle.textContent = task.text;
    if (this.elements.alarmTaskCategory) this.elements.alarmTaskCategory.textContent = task.category || "Vazifa";
    if (this.elements.alarmTaskPriority) {
      const priorityMap = { high: '🔴 Yuqori', low: '🟢 Past', medium: "🟡 O'rta" };
      this.elements.alarmTaskPriority.textContent = priorityMap[task.priority] || "🟡 O'rta";
    }
    if (this.elements.alarmTaskTime) this.elements.alarmTaskTime.textContent = `⏰ ${task.dueTime}`;

    if (this.elements.alarmModal) {
      this.elements.alarmModal.style.display = 'flex';
    }

    this.render();
  }

  stopAlarmRinging() {
    this.sound.stopAlarm();
    this.sound.stopVibration();
    this.stopTitleFlashing();
    if (this.elements.alarmModal) {
      this.elements.alarmModal.style.display = 'none';
    }
    this.currentRingingTask = null;
  }

  handleAlarmComplete() {
    if (this.currentRingingTask) {
      const taskId = this.currentRingingTask.id;
      this.stopAlarmRinging();
      this.toggleTaskStatus(taskId);
      this.confetti.fire();
      this.showToast("Barakalla! Vazifa bajarildi deb belgilandi! 🎉", "success");
    } else {
      this.stopAlarmRinging();
    }
  }

  handleAlarmSnooze() {
    if (!this.currentRingingTask) {
      this.stopAlarmRinging();
      return;
    }

    const task = this.currentRingingTask;
    this.stopAlarmRinging();

    // Add 5 minutes to current time
    const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
    const yr = snoozeDate.getFullYear();
    const mo = String(snoozeDate.getMonth() + 1).padStart(2, '0');
    const dy = String(snoozeDate.getDate()).padStart(2, '0');
    const hr = String(snoozeDate.getHours()).padStart(2, '0');
    const mn = String(snoozeDate.getMinutes()).padStart(2, '0');

    task.dueDate = `${yr}-${mo}-${dy}`;
    task.dueTime = `${hr}:${mn}`;
    task.alarmTriggered = false; // Allow to ring again in 5 min
    this.saveTasks();

    this.showToast(`Budilnik 5 daqiqaga surildi (${task.dueTime}) ⏱️`, 'info');
    this.render();
  }

  handleAlarmStop() {
    this.stopAlarmRinging();
    this.showToast("Budilnik to'xtatildi 🛑", 'info');
  }

  testAlarm() {
    this.showToast("Budilnik sinovi boshlandi (4 soniya) ⏰", "info");
    this.sound.startAlarm();
    this.sound.startVibration();

    setTimeout(() => {
      this.sound.stopAlarm();
      this.sound.stopVibration();
      this.showToast("Budilnik sinovi yakunlandi ✅", "success");
    }, 4000);
  }

  startTitleFlashing(taskTitle) {
    this.stopTitleFlashing();
    let toggle = false;
    this.titleFlashInterval = setInterval(() => {
      document.title = toggle ? `⏰ BUDILNIK! - ${taskTitle}` : `🔔 DIQQAT! - Vazifa vaqti bo'ldi`;
      toggle = !toggle;
    }, 800);
  }

  stopTitleFlashing() {
    if (this.titleFlashInterval) {
      clearInterval(this.titleFlashInterval);
      this.titleFlashInterval = null;
    }
    document.title = this.originalTitle || "Todo Pro - Professional Vazifalar Boshqaruvi";
  }

  // --- Notification System ---

  initNotificationButton() {
    if (!this.elements.notifToggleBtn) return;

    if (!('Notification' in window)) {
      this.elements.notifToggleBtn.title = "Brauzeringiz bildirishnomani qo'llab-quvvatlamaydi";
      this.elements.notifToggleBtn.style.opacity = '0.5';
      return;
    }

    if (Notification.permission === 'granted') {
      this.elements.notifToggleBtn.classList.add('active');
      this.elements.notifToggleBtn.title = "Budilnik bildirishnomalari faol 🔔";
    } else {
      this.elements.notifToggleBtn.classList.remove('active');
      this.elements.notifToggleBtn.title = "Budilnik bildirishnomalariga ruxsat berish 🔕";
    }
  }

  requestNotificationPermission() {
    if (!('Notification' in window)) {
      this.showToast("Brauzeringiz bildirishnomalarni qo'llab-quvvatlamaydi", "warning");
      return;
    }

    if (Notification.permission === 'granted') {
      this.showToast("Bildirishnomalar allaqachon yoqilgan 🔔", "info");
      return;
    }

    Notification.requestPermission().then(permission => {
      this.initNotificationButton();
      if (permission === 'granted') {
        this.showToast("Bildirishnomalar muvaffaqiyatli yoqildi! 🔔", "success");
        try {
          new Notification("Todo Pro Budilnik ⏰", {
            body: "Bildirishnomalar muvaffaqiyatli yoqildi! Vazifa vaqti kelganda xabar beramiz.",
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>'
          });
        } catch (_) {}
      } else {
        this.showToast("Bildirishnomalarga ruxsat berilmadi 🔕", "warning");
      }
    });
  }

  sendNotification(task) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(`⏰ Budilnik: ${task.text}`, {
          body: `Kategoriya: ${task.category || 'Vazifa'} | Vaqti keldi! Bajarishga kirishing.`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
          tag: `alarm-${task.id}`,
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (_) {}
    }
  }

  // --- Preset Time Buttons Helper ---

  setPresetTime(minutesToAdd) {
    const target = new Date(Date.now() + minutesToAdd * 60 * 1000);
    const yr = target.getFullYear();
    const mo = String(target.getMonth() + 1).padStart(2, '0');
    const dy = String(target.getDate()).padStart(2, '0');
    const hr = String(target.getHours()).padStart(2, '0');
    const mn = String(target.getMinutes()).padStart(2, '0');

    if (this.elements.taskDueDate) this.elements.taskDueDate.value = `${yr}-${mo}-${dy}`;
    if (this.elements.taskDueTime) this.elements.taskDueTime.value = `${hr}:${mn}`;

    const label = minutesToAdd >= 60 ? `${minutesToAdd / 60} soat` : `${minutesToAdd} daqiqa`;
    this.showToast(`Budilnik vaqti o'rnatildi: ${hr}:${mn} (+${label}) ⏰`, 'info');
  }

  // --- Filtering & Sorting ---

  getFilteredTasks() {
    return this.tasks.filter(task => {
      // 1. Status filter
      if (this.currentFilter === 'active' && task.completed) return false;
      if (this.currentFilter === 'completed' && !task.completed) return false;

      // 2. Category filter
      if (this.currentCategory !== 'all' && task.category !== this.currentCategory) return false;

      // 3. Search query
      if (this.searchQuery && !task.text.toLowerCase().includes(this.searchQuery)) return false;

      return true;
    });
  }

  // --- Rendering UI ---

  render() {
    this.updateStats();
    this.renderTaskList();
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update Counter Badges in tabs
    this.elements.countAll.textContent = total;
    this.elements.countActive.textContent = active;
    this.elements.countCompleted.textContent = completed;
    this.elements.pendingTasksText.textContent = `${active} ta vazifa bajarilishi kerak`;

    // Update Progress Bar
    this.elements.progressBar.style.width = `${percent}%`;
    this.elements.statsPercent.textContent = `${percent}%`;

    // Update Motivation Status Text
    if (total === 0) {
      this.elements.statsStatusText.textContent = "Kunlik Rejalar";
      this.elements.statsSummaryText.textContent = "Rejalaringizni qo'shing va maqsadlaringiz sari harakat qiling!";
    } else if (percent === 100) {
      this.elements.statsStatusText.textContent = "Barakalla! Barchasi bajarildi 🎉";
      this.elements.statsSummaryText.textContent = `Barcha ${total} ta vazifa to'liq yakunlandi. Bugun ajoyib kun bo'ldi!`;
    } else if (percent >= 50) {
      this.elements.statsStatusText.textContent = "Juda yaxshi natija! 🔥";
      this.elements.statsSummaryText.textContent = `${total} ta vazifadan ${completed} tasi bajarildi. Davom eting!`;
    } else {
      this.elements.statsStatusText.textContent = "Ishga kirishamiz! 🚀";
      this.elements.statsSummaryText.textContent = `${active} ta vazifa kutmoqda. Birma-bir bajaramiz!`;
    }
  }

  renderTaskList() {
    const filteredTasks = this.getFilteredTasks();
    this.elements.tasksList.innerHTML = '';

    if (filteredTasks.length === 0) {
      this.elements.emptyState.style.display = 'flex';

      if (this.searchQuery) {
        this.elements.emptyTitle.textContent = "Qidiruv bo'yicha hech narsa topilmadi";
        this.elements.emptySubtitle.textContent = `"${this.searchQuery}" so'zi bo'yicha vazifa mavjud emas.`;
      } else if (this.currentFilter === 'completed') {
        this.elements.emptyTitle.textContent = "Bajarilgan vazifalar mavjud emas";
        this.elements.emptySubtitle.textContent = "Vazifalarni bajarganingizdan so'ng ular shu yerda ko'rinadi.";
      } else if (this.currentFilter === 'active') {
        this.elements.emptyTitle.textContent = "Faol vazifalar qolmadi";
        this.elements.emptySubtitle.textContent = "Yangi vazifa qo'shing yoki dam oling!";
      } else {
        this.elements.emptyTitle.textContent = "Hozircha vazifalar mavjud emas";
        this.elements.emptySubtitle.textContent = "Yuqoridagi maydonga yozib, birinchi vazifangizni rejalashtiring.";
      }
      return;
    }

    this.elements.emptyState.style.display = 'none';

    // Render items
    const todayStr = new Date().toISOString().split('T')[0];

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      // Priority color indicator
      const priorityClass = `priority-${task.priority || 'medium'}`;

      // Date status
      let dateBadgeHtml = '';
      if (task.dueDate) {
        const isOverdue = !task.completed && task.dueDate < todayStr;
        const isToday = task.dueDate === todayStr;
        const badgeClass = isOverdue ? 'badge-date overdue' : 'badge-date';
        const label = isOverdue ? `⚠️ Muddati o'tgan (${task.dueDate})` : (isToday ? `📅 Bugun` : `📅 ${task.dueDate}`);
        dateBadgeHtml = `<span class="badge ${badgeClass}">${label}</span>`;
      }

      // Priority badge
      const priorityLabels = {
        low: 'Past',
        medium: "O'rta",
        high: 'Muhim'
      };
      const priorityBadgeHtml = `<span class="badge badge-priority-${task.priority}">${priorityLabels[task.priority] || "O'rta"}</span>`;

      // Category badge
      const categoryBadgeHtml = `<span class="badge badge-category">${this.escapeHtml(task.category || 'Umumiy')}</span>`;

      // Alarm / Due Time badge
      let alarmBadgeHtml = '';
      if (task.dueTime) {
        let isUpcoming = false;
        let isDueNow = false;

        if (task.dueDate && !task.completed) {
          const [yr, mo, dy] = task.dueDate.split('-').map(Number);
          const [hr, mn] = task.dueTime.split(':').map(Number);
          const taskTime = new Date(yr, mo - 1, dy, hr, mn, 0).getTime();
          const nowTime = Date.now();
          const diffMinutes = Math.floor((taskTime - nowTime) / (60 * 1000));

          if (diffMinutes < 0 || task.alarmTriggered) {
            isDueNow = true;
          } else if (diffMinutes <= 30) {
            isUpcoming = true;
          }
        }

        let alarmClass = 'badge-alarm';
        let alarmText = `⏰ ${task.dueTime}`;

        if (task.completed) {
          alarmClass = 'badge-alarm';
          alarmText = `⏰ ${task.dueTime}`;
        } else if (isDueNow) {
          alarmClass = 'badge-alarm due';
          alarmText = `⏰ Vaqti bo'ldi (${task.dueTime})`;
        } else if (isUpcoming) {
          alarmClass = 'badge-alarm upcoming';
          alarmText = `⏰ ${task.dueTime} (Tez orada)`;
        }

        alarmBadgeHtml = `<span class="badge ${alarmClass}" title="Budilnik o'rnatilgan vaqt">${alarmText}</span>`;
      }

      // Subtasks Checklist HTML
      let subtasksHtml = '';
      const hasSubtasks = Array.isArray(task.subtasks) && task.subtasks.length > 0;

      if (hasSubtasks) {
        const totalSub = task.subtasks.length;
        const completedSub = task.subtasks.filter(s => s.completed).length;
        const percent = Math.round((completedSub / totalSub) * 100);
        const isCollapsed = Boolean(task.subtasksCollapsed);

        subtasksHtml = `
          <div class="subtasks-container">
            <div class="subtasks-header" data-toggle-subtasks="${task.id}" title="Qadamlarni ochish yoki yopish">
              <div class="subtasks-header-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span class="subtasks-title">Kichik qadamlar (${completedSub}/${totalSub})</span>
                <div class="subtask-mini-progress">
                  <div class="subtask-mini-fill" style="width: ${percent}%;"></div>
                </div>
                <span class="subtask-mini-percent">${percent}%</span>
              </div>
              <button type="button" class="subtask-toggle-btn" aria-label="Ochish yoki yopish">
                <svg class="chevron-icon ${isCollapsed ? 'collapsed' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <div class="subtasks-body ${isCollapsed ? 'collapsed' : ''}">
              <ul class="subtasks-list">
                ${task.subtasks.map(sub => `
                  <li class="subtask-item ${sub.completed ? 'completed' : ''}" data-subtask-id="${sub.id}">
                    <button type="button" class="subtask-check-btn" data-action="toggle-subtask" data-subtask-id="${sub.id}" aria-label="Qadamni belgilash">
                      <svg class="subtask-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <span class="subtask-text">${this.escapeHtml(sub.text)}</span>
                    <button type="button" class="subtask-delete-btn" data-action="delete-subtask" data-subtask-id="${sub.id}" title="Qadamni o'chirish">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                `).join('')}
              </ul>

              <div class="subtask-add-row">
                <input type="text" class="subtask-add-input" placeholder="+ Yangi qadam qo'shish..." maxlength="100">
                <button type="button" class="subtask-add-btn" data-action="add-subtask">Qo'shish</button>
              </div>
            </div>
          </div>
        `;
      }

      // Inline decompose button if task does not have subtasks and is not completed
      let decomposeBtnHtml = '';
      if (!hasSubtasks && !task.completed) {
        decomposeBtnHtml = `<button type="button" class="decompose-inline-btn" data-action="decompose" title="Vazifani kichik qadamlarga bo'lish"><span>🪄 Qadamlarga bo'lish</span></button>`;
      }

      // Check if this task is being edited
      if (this.editingTaskId === task.id) {
        li.innerHTML = `
          <div class="task-priority-indicator ${priorityClass}"></div>
          <div class="task-edit-form">
            <input type="text" class="task-edit-input" value="${this.escapeHtml(task.text)}" maxlength="140" />
            <button type="button" class="edit-save-btn">Saqlash</button>
            <button type="button" class="edit-cancel-btn">Bekor qilish</button>
          </div>
        `;
      } else {
        li.innerHTML = `
          <div class="task-priority-indicator ${priorityClass}"></div>
          <button type="button" class="checkbox-btn" aria-label="${task.completed ? "Bajarilmagan deb belgilash" : "Bajarilgan deb belgilash"}">
            <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          
          <div class="task-content-area">
            <span class="task-title">${this.escapeHtml(task.text)}</span>
            <div class="task-meta">
              ${categoryBadgeHtml}
              ${priorityBadgeHtml}
              ${dateBadgeHtml}
              ${alarmBadgeHtml}
              ${decomposeBtnHtml}
            </div>
            ${subtasksHtml}
          </div>

          <div class="task-actions">
            <button type="button" class="action-btn edit-btn" title="Tahrirlash" aria-label="Tahrirlash">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button type="button" class="action-btn delete-btn" title="O'chirish" aria-label="O'chirish">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `;
      }

      this.elements.tasksList.appendChild(li);
    });
  }

  // --- Helper Utilities ---

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.todoApp = new TodoApp();
});
