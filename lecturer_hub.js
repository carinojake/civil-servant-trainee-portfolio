/**
 * Lecturer Hub Web Application Logic
 * Single Source of Truth consumer, Search & Filter Engine, Accessibility Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if data is loaded
  if (typeof LECTURER_HUB_DATA === 'undefined') {
    console.error('LECTURER_HUB_DATA not found. Please ensure 01_data/lecturers_hub_data.js is loaded.');
    return;
  }

  const data = LECTURER_HUB_DATA;

  // State Management
  const state = {
    searchQuery: '',
    selectedTrack: 'all', // 'all', 'foundation', 'advanced', 'joint'
    selectedCategory: 'all', // 'all', 'ai_digital', etc.
    fontSizeLevel: 0, // 0: 100%, 1: 115%, 2: 130%
    isHighContrast: false,
    isDyslexicSpacing: false,
    activeLecturerModal: null
  };

  // DOM Elements
  const searchInput = document.getElementById('search-input');
  const trackButtons = document.querySelectorAll('.track-tab-btn');
  const categoryFiltersContainer = document.getElementById('category-filters');
  const lecturerGrid = document.getElementById('lecturer-grid');
  const learningTimeline = document.getElementById('learning-timeline');
  const sourceDocsGrid = document.getElementById('source-docs-grid');
  const resultStats = document.getElementById('result-stats');
  const modalBackdrop = document.getElementById('lecturer-modal');
  const modalContent = document.getElementById('modal-content-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Accessibility Buttons
  const fontDecreaseBtn = document.getElementById('font-decrease-btn');
  const fontResetBtn = document.getElementById('font-reset-btn');
  const fontIncreaseBtn = document.getElementById('font-increase-btn');
  const contrastToggleBtn = document.getElementById('contrast-toggle-btn');
  const spacingToggleBtn = document.getElementById('spacing-toggle-btn');
  const a11yLiveRegion = document.getElementById('a11y-live-region');

  // Helper for Screen Reader Announcements
  function announceForScreenReader(message) {
    if (a11yLiveRegion) {
      a11yLiveRegion.textContent = message;
    }
  }

  // --------------------------------------------------------------------------
  // 1. Accessibility Controller
  // --------------------------------------------------------------------------
  function applyAccessibilitySettings() {
    const root = document.documentElement;
    const scales = [1.0, 1.15, 1.30];
    root.style.setProperty('--font-scale', scales[state.fontSizeLevel]);

    // High Contrast
    if (state.isHighContrast) {
      document.body.classList.add('theme-high-contrast');
      contrastToggleBtn.classList.add('active');
    } else {
      document.body.classList.remove('theme-high-contrast');
      contrastToggleBtn.classList.remove('active');
    }

    // Spacing
    if (state.isDyslexicSpacing) {
      document.body.classList.add('font-dyslexic-spacing');
      spacingToggleBtn.classList.add('active');
    } else {
      document.body.classList.remove('font-dyslexic-spacing');
      spacingToggleBtn.classList.remove('active');
    }
  }

  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => {
      if (state.fontSizeLevel < 2) {
        state.fontSizeLevel++;
        applyAccessibilitySettings();
        announceForScreenReader(`ขยายขนาดตัวอักษรเป็นระดับ ${state.fontSizeLevel + 1}`);
      }
    });
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => {
      if (state.fontSizeLevel > 0) {
        state.fontSizeLevel--;
        applyAccessibilitySettings();
        announceForScreenReader(`ลดขนาดตัวอักษรเป็นระดับ ${state.fontSizeLevel + 1}`);
      }
    });
  }

  if (fontResetBtn) {
    fontResetBtn.addEventListener('click', () => {
      state.fontSizeLevel = 0;
      applyAccessibilitySettings();
      announceForScreenReader('รีเซ็ตขนาดตัวอักษรเป็นมาตรฐาน');
    });
  }

  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', () => {
      state.isHighContrast = !state.isHighContrast;
      applyAccessibilitySettings();
      announceForScreenReader(state.isHighContrast ? 'เปิดโหมดความคมชัดสูง' : 'ปิดโหมดความคมชัดสูง');
    });
  }

  if (spacingToggleBtn) {
    spacingToggleBtn.addEventListener('click', () => {
      state.isDyslexicSpacing = !state.isDyslexicSpacing;
      applyAccessibilitySettings();
      announceForScreenReader(state.isDyslexicSpacing ? 'เปิดโหมดเพิ่มระยะบรรทัดอ่านง่าย' : 'ปิดโหมดเพิ่มระยะบรรทัด');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Render Categories Filter Pills
  // --------------------------------------------------------------------------
  function renderCategoryFilters() {
    if (!categoryFiltersContainer) return;
    
    let html = `
      <button type="button" class="cat-filter-btn active" data-cat="all">
        ทั้งหมด (${data.statistics.total_lecturers})
      </button>
    `;

    data.categories.forEach(cat => {
      html += `
        <button type="button" class="cat-filter-btn" data-cat="${cat.id}">
          ${cat.name} (${cat.count})
        </button>
      `;
    });

    categoryFiltersContainer.innerHTML = html;

    // Attach listeners
    categoryFiltersContainer.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFiltersContainer.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedCategory = btn.dataset.cat;
        applyFilters();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Search & Filter Matching Logic
  // --------------------------------------------------------------------------
  function matchesSearch(text, query) {
    if (!query) return true;
    if (!text) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  }

  function filterLecturers() {
    const q = state.searchQuery.trim().toLowerCase();
    return data.lecturers.filter(lecturer => {
      // Category match
      if (state.selectedCategory !== 'all' && !lecturer.category_ids.includes(state.selectedCategory)) {
        return false;
      }

      // Query match
      if (!q) return true;

      const inName = matchesSearch(lecturer.name, q);
      const inPos = matchesSearch(lecturer.position, q);
      const inOrg = matchesSearch(lecturer.organization, q);
      const inExp = matchesSearch(lecturer.one_line_expertise, q);
      const inCourses = lecturer.courses_taught.some(c => matchesSearch(c, q));
      const inCategories = lecturer.category_labels.some(c => matchesSearch(c, q));

      return inName || inPos || inOrg || inExp || inCourses || inCategories;
    });
  }

  function filterLearningMap() {
    const q = state.searchQuery.trim().toLowerCase();
    return data.learning_map.filter(session => {
      // Track match
      if (state.selectedTrack !== 'all') {
        if (state.selectedTrack === 'joint') {
          if (session.track !== 'joint') return false;
        } else {
          // If track is foundation or advanced, show matching or joint
          if (session.track !== state.selectedTrack && session.track !== 'joint') {
            return false;
          }
        }
      }

      // Query match
      if (!q) return true;

      const inSubject = matchesSearch(session.subject, q);
      const inDate = matchesSearch(session.date, q);
      const inRoom = matchesSearch(session.room, q);
      const inLecturers = session.lecturers.some(l => matchesSearch(l, q));
      const inSubtopics = session.subtopics.some(st => matchesSearch(st, q));
      const inFiles = matchesSearch(session.file_name, q);

      return inSubject || inDate || inRoom || inLecturers || inSubtopics || inFiles;
    });
  }

  // --------------------------------------------------------------------------
  // 4. Render Lecturers Grid
  // --------------------------------------------------------------------------
  function renderLecturers(filteredLecturers) {
    if (!lecturerGrid) return;

    if (filteredLecturers.length === 0) {
      lecturerGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: var(--space-xl); text-align: center; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <p style="font-size: 1.1rem; color: var(--text-muted);">ไม่พบรายชื่อวิทยากรที่ตรงกับคำค้นหาหรือตัวกรองนี้</p>
          <button type="button" class="btn-secondary" id="reset-filter-btn" style="margin-top: var(--space-md);">ล้างตัวกรองทั้งหมด</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
      }
      return;
    }

    let html = '';
    filteredLecturers.forEach(l => {
      // Get initials
      const initials = l.name.replace(/^(ดร\.|ผศ\.ดร\.|รศ\.ดร\.|อาจารย์|นางสาว|นาย|คุณ|ผศ\.|รศ\.)\s*/, '').substring(0, 2);

      const categoryTags = l.category_labels.map(cl => `<span class="cat-tag">${cl}</span>`).join('');
      const coursesTaughtSummary = l.courses_taught.length > 0 
        ? `<div style="font-size: 0.8125rem; color: var(--color-navy); font-weight: 600; margin-bottom: var(--space-xs);">สอนวิชา: ${l.courses_taught[0]} ${l.courses_taught.length > 1 ? `(+อีก ${l.courses_taught.length - 1} วิชา)` : ''}</div>`
        : '';

      html += `
        <article class="lecturer-card" data-lecturer-id="${l.id}">
          <div>
            <div class="lecturer-card-header">
              <div class="lecturer-avatar" aria-hidden="true">${initials}</div>
              <div class="lecturer-meta">
                <h3 class="lecturer-name">${l.name}</h3>
                <div class="lecturer-position">${l.position}</div>
                <div class="lecturer-org">${l.organization}</div>
              </div>
            </div>

            <div class="lecturer-expertise">
              <strong>ความเชี่ยวชาญ:</strong> ${l.one_line_expertise}
            </div>

            ${coursesTaughtSummary}

            <div class="lecturer-categories" aria-label="กลุ่มความเชี่ยวชาญ">
              ${categoryTags}
            </div>
          </div>

          <div class="lecturer-card-footer">
            <button type="button" class="btn-sm btn-secondary view-profile-btn" data-lecturer-id="${l.id}" aria-label="ดูประวัติและรายวิชาที่สอนของ ${l.name}">
              ดูประวัติ & รายวิชา
            </button>
            <a href="${data.app_info.google_drive_folder}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-accent" aria-label="เปิดคลังไฟล์ Google Drive">
              เปิดไฟล์ Drive
            </a>
          </div>
        </article>
      `;
    });

    lecturerGrid.innerHTML = html;

    // Attach profile modal openers
    lecturerGrid.querySelectorAll('.view-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.lecturerId;
        openLecturerModal(id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Render Learning Map (Day-Subject-Lecturer-File)
  // --------------------------------------------------------------------------
  function renderLearningMap(filteredSessions) {
    if (!learningTimeline) return;

    if (filteredSessions.length === 0) {
      learningTimeline.innerHTML = `
        <div style="padding: var(--space-xl); text-align: center; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <p style="font-size: 1.1rem; color: var(--text-muted);">ไม่พบรายการแผนการเรียนรู้ตามตัวกรองที่เลือก</p>
        </div>
      `;
      return;
    }

    // Group sessions by Date
    const grouped = {};
    filteredSessions.forEach(session => {
      if (!grouped[session.date]) {
        grouped[session.date] = [];
      }
      grouped[session.date].push(session);
    });

    let html = '';
    Object.keys(grouped).forEach(dateStr => {
      const sessions = grouped[dateStr];
      const isDual = sessions.length > 1;

      html += `
        <div class="timeline-day-group">
          <div class="day-group-header">
            <div class="day-title-wrap">
              <span class="day-badge">กำหนดการ</span>
              <h3 class="day-date-text">${dateStr}</h3>
            </div>
            <span style="font-size: 0.8125rem; color: var(--text-secondary); font-weight: 600;">
              ${sessions.length} ช่วงการเรียนรู้
            </span>
          </div>

          <div class="sessions-grid ${isDual ? 'dual-track' : ''}">
      `;

      sessions.forEach(s => {
        const isVerified = s.status === 'verified';
        const statusBadgeClass = isVerified ? 'verified' : 'pending';
        const statusIcon = isVerified ? '✓' : '⏳';
        const trackClass = s.track; // 'foundation', 'advanced', 'joint'

        const subtopicsList = s.subtopics.map(st => `<li>${st}</li>`).join('');

        const lecturersDisplay = s.lecturers.length > 0
          ? s.lecturers.join(', ')
          : '<span style="color: var(--status-pending-text); font-weight: normal;">ยังไม่พบชื่อผู้สอนในไฟล์ที่อ่านได้ (รอตรวจสอบ)</span>';

        html += `
          <div class="session-card ${trackClass}">
            <div>
              <div class="session-top-meta">
                <span class="track-badge ${trackClass}">
                  ${s.track_label}
                </span>
                <span class="period-badge">${s.period}</span>
                <span class="room-badge">${s.room}</span>
              </div>

              <h4 class="session-subject">${s.subject}</h4>

              <ul class="session-subtopics">
                ${subtopicsList}
              </ul>

              <div class="session-lecturers-box">
                <div class="session-lecturers-label">อาจารย์ผู้สอน / วิทยากร</div>
                <div class="session-lecturers-list">${lecturersDisplay}</div>
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-xs); flex-wrap: wrap; gap: 4px;">
                <span class="status-badge ${statusBadgeClass}">
                  <span aria-hidden="true">${statusIcon}</span> ${s.status_label}
                </span>
                ${s.notes ? `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">${s.notes.substring(0, 45)}...</span>` : ''}
              </div>

              <div class="session-file-box">
                <div class="file-info" title="${s.file_name}">
                  📄 <strong>ไฟล์:</strong> ${s.file_name}
                </div>
                <a href="${s.file_url}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-accent" style="flex-shrink: 0;" aria-label="เปิดไฟล์ ${s.file_name} บน Google Drive">
                  เปิดไฟล์ Drive
                </a>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    learningTimeline.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 6. Render Source Documents Grid
  // --------------------------------------------------------------------------
  function renderSourceDocuments() {
    if (!sourceDocsGrid) return;

    let html = '';
    data.source_documents.forEach(doc => {
      html += `
        <div class="source-card">
          <div>
            <span class="source-badge">${doc.badge}</span>
            <h3 class="source-title">${doc.title}</h3>
            <p class="source-desc">${doc.description}</p>
          </div>
          <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="width: 100%; text-align: center;">
            เปิดดูเอกสารต้นทาง
          </a>
        </div>
      `;
    });

    sourceDocsGrid.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 7. Modal Profile Viewer
  // --------------------------------------------------------------------------
  function openLecturerModal(lecturerId) {
    const lecturer = data.lecturers.find(l => l.id === lecturerId);
    if (!lecturer || !modalBackdrop || !modalContent) return;

    const initials = lecturer.name.replace(/^(ดร\.|ผศ\.ดร\.|รศ\.ดร\.|อาจารย์|นางสาว|นาย|คุณ|ผศ\.|รศ\.)\s*/, '').substring(0, 2);

    const categoriesList = lecturer.category_labels.map(c => `<span class="cat-tag">${c}</span>`).join(' ');
    
    const coursesList = lecturer.courses_taught.length > 0
      ? lecturer.courses_taught.map(c => `<li style="margin-bottom: 4px;">• ${c}</li>`).join('')
      : '<li>ยังไม่มีข้อมูลรายวิชาที่ยืนยัน</li>';

    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
        <div class="lecturer-avatar" style="width: 64px; height: 64px; font-size: 1.5rem;" aria-hidden="true">${initials}</div>
        <div>
          <h2 style="font-size: 1.35rem; color: var(--color-navy-dark);">${lecturer.name}</h2>
          <div style="color: var(--text-secondary); font-size: 0.9rem;">${lecturer.position}</div>
          <div style="color: var(--color-teal); font-weight: 600; font-size: 0.9rem;">${lecturer.organization}</div>
        </div>
      </div>

      <div style="margin-bottom: var(--space-md);">
        <div class="modal-section-title">ความเชี่ยวชาญหลัก</div>
        <p style="font-size: 0.9375rem; line-height: 1.5; color: var(--text-primary); margin-top: 4px;">${lecturer.one_line_expertise}</p>
        <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">${categoriesList}</div>
      </div>

      <div style="margin-bottom: var(--space-md);">
        <div class="modal-section-title">ประวัติย่อและผลงานเด่น</div>
        <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-top: 4px;">${lecturer.bio_highlights}</p>
      </div>

      <div style="margin-bottom: var(--space-md);">
        <div class="modal-section-title">รายวิชาที่รับผิดชอบในการอบรม</div>
        <ul style="list-style: none; font-size: 0.9rem; color: var(--color-navy); margin-top: 6px;">
          ${coursesList}
        </ul>
      </div>

      <div style="display: flex; align-items: center; justify-content: flex-end; gap: var(--space-sm); margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-md);">
        <a href="${data.app_info.google_drive_folder}" target="_blank" rel="noopener noreferrer" class="btn-accent">
          เปิดค้นหาไฟล์ใน Google Drive
        </a>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    announceForScreenReader(`เปิดหน้าต่างประวัติของ ${lecturer.name}`);
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      announceForScreenReader('ปิดหน้าต่างประวัติวิทยากร');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 8. Overall Filter Applier
  // --------------------------------------------------------------------------
  function applyFilters() {
    const filteredLecturers = filterLecturers();
    const filteredSessions = filterLearningMap();

    renderLecturers(filteredLecturers);
    renderLearningMap(filteredSessions);

    if (resultStats) {
      resultStats.textContent = `พบวิทยากร ${filteredLecturers.length} ท่าน | พบเซสชันเรียนรู้ ${filteredSessions.length} รายการ`;
    }
  }

  function resetAllFilters() {
    state.searchQuery = '';
    state.selectedTrack = 'all';
    state.selectedCategory = 'all';

    if (searchInput) searchInput.value = '';

    trackButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.track === 'all');
    });

    if (categoryFiltersContainer) {
      categoryFiltersContainer.querySelectorAll('.cat-filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === 'all');
      });
    }

    applyFilters();
    announceForScreenReader('ล้างตัวกรองทั้งหมดแล้ว');
  }

  // --------------------------------------------------------------------------
  // 9. Attach Event Listeners
  // --------------------------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  trackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedTrack = btn.dataset.track;
      applyFilters();
      announceForScreenReader(`เลือกแสดง ${btn.textContent.trim()}`);
    });
  });

  // Quick Jump Scroll Buttons in Hero
  const jumpLecturersBtn = document.getElementById('jump-lecturers-btn');
  const jumpCurriculumBtn = document.getElementById('jump-curriculum-btn');
  const jumpMapBtn = document.getElementById('jump-map-btn');

  if (jumpLecturersBtn) {
    jumpLecturersBtn.addEventListener('click', () => {
      document.getElementById('lecturers-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (jumpCurriculumBtn) {
    jumpCurriculumBtn.addEventListener('click', () => {
      document.getElementById('learning-map-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (jumpMapBtn) {
    jumpMapBtn.addEventListener('click', () => {
      document.getElementById('learning-map-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Initial Boot
  // --------------------------------------------------------------------------
  renderCategoryFilters();
  renderSourceDocuments();
  applyFilters();
  applyAccessibilitySettings();
  console.log('Lecturer Hub Web Application initialized successfully.');
});
