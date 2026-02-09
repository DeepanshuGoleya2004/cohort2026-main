// Smart Education Platform - Advanced JavaScript Implementation
class SmartEducationApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        this.notifications = [];
        this.courses = [];
        this.schedule = [];
        this.assignments = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.hideLoadingScreen();
        this.initializeCalendar();
        this.setupNotifications();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Authentication
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const authModal = document.getElementById('authModal');
        const closeAuth = document.getElementById('closeAuth');
        const authForm = document.getElementById('authForm');
        const authSwitchLink = document.getElementById('authSwitchLink');

        if (loginBtn) loginBtn.addEventListener('click', () => this.openAuthModal('login'));
        if (signupBtn) signupBtn.addEventListener('click', () => this.openAuthModal('signup'));
        if (closeAuth) closeAuth.addEventListener('click', () => this.closeAuthModal());
        if (authForm) authForm.addEventListener('submit', (e) => this.handleAuth(e));
        if (authSwitchLink) authSwitchLink.addEventListener('click', (e) => this.switchAuthMode(e));

        // Close modal on backdrop click
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.closeAuthModal();
                }
            });
        }

        // AI Scheduler
        const optimizeBtn = document.getElementById('optimizeSchedule');
        if (optimizeBtn) optimizeBtn.addEventListener('click', () => this.optimizeSchedule());

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const prevWeek = document.getElementById('prevWeek');
        const nextWeek = document.getElementById('nextWeek');

        if (prevMonth) prevMonth.addEventListener('click', () => this.changeMonth(-1));
        if (nextMonth) nextMonth.addEventListener('click', () => this.changeMonth(1));
        if (prevWeek) prevWeek.addEventListener('click', () => this.changeWeek(-1));
        if (nextWeek) nextWeek.addEventListener('click', () => this.changeWeek(1));

        // FAB menu
        const fab = document.getElementById('fab');
        if (fab) {
            fab.addEventListener('click', () => {
                fab.classList.toggle('active');
            });
        }

        // Search functionality
        const courseSearch = document.getElementById('courseSearch');
        const resourceSearch = document.getElementById('resourceSearch');
        
        if (courseSearch) {
            courseSearch.addEventListener('input', (e) => this.filterCourses(e.target.value));
        }
        
        if (resourceSearch) {
            resourceSearch.addEventListener('input', (e) => this.filterResources(e.target.value));
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterItems(filter, e.target);
            });
        });

        // Notification bell
        const notificationBell = document.getElementById('notificationBell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => this.showNotifications());
        }

        // User profile dropdown
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.addEventListener('mouseenter', () => {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) dropdown.style.display = 'block';
            });
            
            userProfile.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    const dropdown = document.getElementById('userDropdown');
                    if (dropdown && !dropdown.matches(':hover')) {
                        dropdown.style.display = 'none';
                    }
                }, 300);
            });
        }

        // Toast close button
        const toastClose = document.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }

        // Form validation
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Page visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    navigateToSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
            
            // Trigger section-specific initialization
            this.initializeSection(section);
        }

        // Close mobile menu if open
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    initializeSection(section) {
        switch (section) {
            case 'dashboard':
                this.updateDashboardCharts();
                break;
            case 'ai-scheduler':
                this.updateScheduleView();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'courses':
                this.loadCourses();
                break;
            case 'resources':
                this.loadResources();
                break;
            case 'reports':
                this.generateReports();
                break;
        }
    }

    loadInitialData() {
        // Simulate loading user data
        this.currentUser = {
            id: '1',
            name: 'Alex Johnson',
            email: 'alex.johnson@smarted.com',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            role: 'student'
        };

        // Mock courses data
        this.courses = [
            {
                id: '1',
                title: 'Data Structures & Algorithms',
                instructor: 'Dr. Sarah Johnson',
                progress: 78,
                totalModules: 15,
                completedModules: 12,
                color: '#10b981',
                icon: 'code',
                grade: 'A-',
                category: 'Computer Science'
            },
            {
                id: '2',
                title: 'Machine Learning',
                instructor: 'Prof. Michael Smith',
                progress: 65,
                totalModules: 12,
                completedModules: 8,
                color: '#8b5cf6',
                icon: 'brain',
                grade: 'B+',
                category: 'AI/ML'
            },
            {
                id: '3',
                title: 'Database Systems',
                instructor: 'Dr. Emily Wilson',
                progress: 92,
                totalModules: 12,
                completedModules: 11,
                color: '#3b82f6',
                icon: 'database',
                grade: 'A',
                category: 'Database'
            },
            {
                id: '4',
                title: 'Software Engineering',
                instructor: 'Dr. James Brown',
                progress: 45,
                totalModules: 11,
                completedModules: 5,
                color: '#f59e0b',
                icon: 'cogs',
                grade: 'B',
                category: 'Software Development'
            }
        ];

        // Mock assignments
        this.assignments = [
            {
                id: '1',
                title: 'Algorithm Analysis Report',
                course: 'Data Structures',
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                priority: 'high',
                status: 'pending'
            },
            {
                id: '2',
                title: 'ML Project Phase 2',
                course: 'Machine Learning',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                priority: 'medium',
                status: 'pending'
            },
            {
                id: '3',
                title: 'Database Design',
                course: 'Database Systems',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                priority: 'low',
                status: 'pending'
            }
        ];

        this.isAuthenticated = true;
        this.updateAuthenticationUI();
    }

    updateAuthenticationUI() {
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');

        if (this.isAuthenticated && this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                const avatar = userProfile.querySelector('.user-avatar');
                if (avatar) avatar.src = this.currentUser.avatar;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    openAuthModal(mode) {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const submitBtn = document.getElementById('authSubmit');
        const nameGroup = document.getElementById('nameGroup');
        const switchText = document.getElementById('authSwitchText');
        const switchLink = document.getElementById('authSwitchLink');

        if (mode === 'login') {
            title.textContent = 'Welcome Back';
            submitBtn.textContent = 'Sign In';
            nameGroup.style.display = 'none';
            switchText.textContent = "Don't have an account?";
            switchLink.textContent = 'Sign up';
            switchLink.dataset.mode = 'signup';
        } else {
            title.textContent = 'Create Account';
            submitBtn.textContent = 'Sign Up';
            nameGroup.style.display = 'block';
            switchText.textContent = 'Already have an account?';
            switchLink.textContent = 'Sign in';
            switchLink.dataset.mode = 'login';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchAuthMode(e) {
        e.preventDefault();
        const mode = e.target.dataset.mode;
        this.openAuthModal(mode);
    }

    handleAuth(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const submitBtn = document.getElementById('authSubmit');
        const isSignup = submitBtn.textContent === 'Sign Up';

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            if (this.validateAuthForm(email, password, name, isSignup)) {
                this.isAuthenticated = true;
                this.currentUser = {
                    id: '1',
                    name: name || 'Alex Johnson',
                    email: email,
                    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                    role: 'student'
                };
                
                this.closeAuthModal();
                this.updateAuthenticationUI();
                this.showToast(
                    isSignup ? 'Account created successfully!' : 'Welcome back!',
                    'success'
                );
            } else {
                this.showToast('Authentication failed. Please try again.', 'error');
            }
            
            // Reset button
            submitBtn.innerHTML = isSignup ? 'Sign Up' : 'Sign In';
            submitBtn.disabled = false;
        }, 1500);
    }

    validateAuthForm(email, password, name, isSignup) {
        if (!email || !this.isValidEmail(email)) return false;
        if (!password || password.length < 6) return false;
        if (isSignup && (!name || name.trim().length < 2)) return false;
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;
        
        field.classList.remove('error', 'success');
        
        switch (fieldName) {
            case 'email':
                if (!value) {
                    this.showFieldError(field, 'Email is required');
                } else if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email');
                } else {
                    this.showFieldSuccess(field);
                }
                break;
                
            case 'password':
                if (!value) {
                    this.showFieldError(field, 'Password is required');
                } else if (value.length < 6) {
                    this.showFieldError(field, 'Password must be at least 6 characters');
                } else {
                    this.showFieldSuccess(field);
                }
                break;
                
            case 'name':
                if (!value) {
                    this.showFieldError(field, 'Name is required');
                } else if (value.length < 2) {
                    this.showFieldError(field, 'Name must be at least 2 characters');
                } else {
                    this.showFieldSuccess(field);
                }
                break;
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        this.removeFieldMessage(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        this.removeFieldMessage(field);
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        this.removeFieldMessage(field);
    }

    removeFieldMessage(field) {
        const existingMessage = field.parentNode.querySelector('.field-error, .field-success');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    initializeCharts() {
        // Initialize progress chart
        const progressCtx = document.getElementById('progressChart');
        if (progressCtx) {
            this.progressChart = this.createProgressChart(progressCtx);
        }

        // Initialize grade chart
        const gradeCtx = document.getElementById('gradeChart');
        if (gradeCtx) {
            this.gradeChart = this.createGradeChart(gradeCtx);
        }

        // Initialize report charts
        this.initializeReportCharts();
    }

    createProgressChart(ctx) {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [4, 6, 3, 8, 5, 7, 4],
                    borderColor: '#10b981',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    createGradeChart(ctx) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['A', 'B+', 'B', 'C+', 'C'],
                datasets: [{
                    data: [4, 2, 1, 0, 0],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    initializeReportCharts() {
        // Grade Distribution Chart
        const gradeDistCtx = document.getElementById('gradeDistributionChart');
        if (gradeDistCtx) {
            new Chart(gradeDistCtx, {
                type: 'bar',
                data: {
                    labels: ['A', 'B+', 'B', 'C+', 'C'],
                    datasets: [{
                        data: [4, 2, 1, 0, 0],
                        backgroundColor: [
                            '#10b981',
                            '#3b82f6',
                            '#8b5cf6',
                            '#f59e0b',
                            '#ef4444'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: '#94a3b8' } },
                        y: { ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }

        // Attendance Chart
        const attendanceCtx = document.getElementById('attendanceChart');
        if (attendanceCtx) {
            new Chart(attendanceCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [{
                        label: 'Attendance %',
                        data: [95, 92, 98, 90, 94, 96],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Study Time Chart
        const studyTimeCtx = document.getElementById('studyTimeChart');
        if (studyTimeCtx) {
            new Chart(studyTimeCtx, {
                type: 'radar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Hours',
                        data: [4, 6, 3, 8, 5, 7, 4],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Assignment Chart
        const assignmentCtx = document.getElementById('assignmentChart');
        if (assignmentCtx) {
            new Chart(assignmentCtx, {
                type: 'pie',
                data: {
                    labels: ['On Time', 'Late', 'Missing'],
                    datasets: [{
                        data: [23, 2, 0],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    updateDashboardCharts() {
        if (this.progressChart) {
            // Update with real-time data
            const newData = [3, 7, 4, 6, 8, 5, 6];
            this.progressChart.data.datasets[0].data = newData;
            this.progressChart.update('none');
        }
    }

    optimizeSchedule() {
        const button = document.getElementById('optimizeSchedule');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';
        button.disabled = true;

        // Simulate AI optimization
        setTimeout(() => {
            this.showToast('Schedule optimized successfully! 🎯', 'success');
            this.updateScheduleView();
            
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    updateScheduleView() {
        // Add visual indicators for optimized schedule
        const scheduleBlocks = document.querySelectorAll('.schedule-block');
        scheduleBlocks.forEach(block => {
            block.style.opacity = '0.8';
            setTimeout(() => {
                block.style.opacity = '1';
                block.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    block.style.transform = 'scale(1)';
                }, 200);
            }, Math.random() * 1000);
        });
    }

    initializeCalendar() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    renderCalendar() {
        const calendarDates = document.getElementById('calendarDates');
        const currentMonth = document.getElementById('currentMonth');
        
        if (!calendarDates || !currentMonth) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        calendarDates.innerHTML = '';

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.textContent = date.getDate();

            if (date.getMonth() !== month) {
                dateElement.classList.add('other-month');
            }

            if (this.isToday(date)) {
                dateElement.classList.add('today');
            }

            if (this.hasEvents(date)) {
                dateElement.classList.add('has-event');
            }

            dateElement.addEventListener('click', () => {
                this.selectDate(date);
            });

            calendarDates.appendChild(dateElement);
        }
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    hasEvents(date) {
        // Check if date has any events/assignments
        return Math.random() > 0.7; // Mock event detection
    }

    selectDate(date) {
        document.querySelectorAll('.calendar-date').forEach(el => {
            el.classList.remove('selected');
        });
        
        event.target.classList.add('selected');
        
        // Show events for selected date
        this.showEventsForDate(date);
    }

    showEventsForDate(date) {
        // Implementation for showing events
        const events = this.getEventsForDate(date);
        this.showToast(`${events.length} events on ${date.toLocaleDateString()}`, 'info');
    }

    getEventsForDate(date) {
        // Mock events for the date
        return this.assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            return dueDate.toDateString() === date.toDateString();
        });
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    changeWeek(direction) {
        const currentWeek = document.getElementById('currentWeek');
        if (currentWeek) {
            // Update week display
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() + (direction * 7));
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            currentWeek.textContent = `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
        }
    }

    filterCourses(searchTerm) {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || 
                instructor.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterResources(searchTerm) {
        const resourceCards = document.querySelectorAll('.resource-card');
        
        resourceCards.forEach(card => {
            const title = card.querySelector('.resource-title').textContent.toLowerCase();
            const meta = card.querySelector('.resource-meta').textContent.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || 
                meta.includes(searchTerm.toLowerCase())) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterItems(filter, button) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Apply filter based on current section
        switch (this.currentSection) {
            case 'courses':
                this.filterCoursesByCategory(filter);
                break;
            default:
                break;
        }
    }

    filterCoursesByCategory(category) {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const courseCategory = card.dataset.category;
                card.style.display = courseCategory === category ? 'block' : 'none';
            }
        });
    }

    loadCourses() {
        // Simulate loading courses with animation
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    loadResources() {
        // Simulate loading resources
        this.showToast('Loading resources...', 'info');
        
        setTimeout(() => {
            this.showToast('Resources loaded successfully!', 'success');
        }, 1000);
    }

    generateReports() {
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            const originalText = generateBtn.innerHTML;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            generateBtn.disabled = true;

            setTimeout(() => {
                this.showToast('Report generated successfully!', 'success');
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
            }, 2000);
        }
    }

    showNotifications() {
        const notifications = [
            {
                title: 'Assignment Due Soon',
                message: 'Algorithm Analysis Report is due tomorrow',
                type: 'warning',
                time: '5 minutes ago'
            },
            {
                title: 'New Course Material',
                message: 'Dr. Johnson uploaded new lecture notes',
                type: 'info',
                time: '1 hour ago'
            },
            {
                title: 'Grade Posted',
                message: 'Your Database project grade is available',
                type: 'success',
                time: '2 hours ago'
            }
        ];

        // Create notification popup
        this.createNotificationPopup(notifications);
    }

    createNotificationPopup(notifications) {
        // Remove existing popup
        const existingPopup = document.querySelector('.notification-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="close-notifications"><i class="fas fa-times"></i></button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item ${notif.type}">
                        <div class="notification-icon">
                            <i class="fas fa-${this.getNotificationIcon(notif.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notification-time">${notif.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(popup);

        // Add close functionality
        popup.querySelector('.close-notifications').addEventListener('click', () => {
            popup.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 10000);
    }

    getNotificationIcon(type) {
        const icons = {
            warning: 'exclamation-triangle',
            info: 'info-circle',
            success: 'check-circle',
            error: 'times-circle'
        };
        return icons[type] || 'bell';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Update toast content
        toast.className = `toast ${type}`;
        toastMessage.textContent = message;
        
        // Set appropriate icon
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.innerHTML = `<i class="${icons[type] || icons.info}"></i>`;
        
        // Show toast
        toast.classList.add('show');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
    }

    startRealTimeUpdates() {
        // Update time every minute
        setInterval(() => {
            this.updateCurrentTime();
        }, 60000);

        // Update live class status
        setInterval(() => {
            this.updateLiveClassStatus();
        }, 30000);

        // Check for new notifications
        setInterval(() => {
            this.checkForNewNotifications();
        }, 120000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(element => {
            element.textContent = now.toLocaleTimeString();
        });
    }

    updateLiveClassStatus() {
        // Simulate live class status updates
        const liveElements = document.querySelectorAll('.live-indicator');
        liveElements.forEach(element => {
            if (Math.random() > 0.8) {
                element.style.animation = 'pulse 2s infinite';
            }
        });
    }

    checkForNewNotifications() {
        // Simulate checking for new notifications
        if (Math.random() > 0.7) {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const count = parseInt(badge.textContent) + 1;
                badge.textContent = count;
                badge.style.animation = 'pulse 2s infinite';
            }
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.focus();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                this.closeAuthModal();
            }
            
            const notificationPopup = document.querySelector('.notification-popup');
            if (notificationPopup) {
                notificationPopup.remove();
            }
        }

        // Number keys for navigation
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            const sections = ['dashboard', 'ai-scheduler', 'courses', 'calendar', 'resources', 'reports'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.navigateToSection(sections[sectionIndex]);
            }
        }
    }

    handleResize() {
        // Recalculate chart dimensions
        if (this.progressChart) {
            this.progressChart.resize();
        }
        if (this.gradeChart) {
            this.gradeChart.resize();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is now hidden
            this.pauseRealTimeUpdates();
        } else {
            // Page is now visible
            this.resumeRealTimeUpdates();
        }
    }

    pauseRealTimeUpdates() {
        // Pause unnecessary updates when page is not visible
        clearInterval(this.updateInterval);
    }

    resumeRealTimeUpdates() {
        // Resume updates when page becomes visible
        this.startRealTimeUpdates();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    setupNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    sendBrowserNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }
}

// Chart.js simple implementation for basic charts
class Chart {
    constructor(ctx, config) {
        this.ctx = ctx.getContext('2d');
        this.config = config;
        this.canvas = ctx;
        this.render();
    }

    render() {
        const { type, data, options } = this.config;
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple line chart implementation
        if (type === 'line') {
            this.renderLineChart(data, options);
        } else if (type === 'doughnut' || type === 'pie') {
            this.renderPieChart(data, options);
        } else if (type === 'bar') {
            this.renderBarChart(data, options);
        }
    }

    renderLineChart(data, options) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        
        const dataset = data.datasets[0];
        const points = dataset.data;
        const max = Math.max(...points);
        const min = Math.min(...points);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = dataset.borderWidth || 2;
        ctx.beginPath();
        
        points.forEach((point, index) => {
            const x = padding + (width / (points.length - 1)) * index;
            const y = padding + height - ((point - min) / (max - min)) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = dataset.pointBackgroundColor || dataset.borderColor;
        points.forEach((point, index) => {
            const x = padding + (width / (points.length - 1)) * index;
            const y = padding + height - ((point - min) / (max - min)) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, dataset.pointRadius || 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    renderPieChart(data, options) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;
        
        data.datasets[0].data.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }

    renderBarChart(data, options) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;
        
        const values = data.datasets[0].data;
        const max = Math.max(...values);
        const barWidth = width / values.length * 0.8;
        const barSpacing = width / values.length * 0.2;
        
        values.forEach((value, index) => {
            const barHeight = (value / max) * height;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + height - barHeight;
            
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    update(animation) {
        this.render();
    }

    resize() {
        this.render();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartEdApp = new SmartEducationApp();
});

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}