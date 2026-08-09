document.addEventListener('DOMContentLoaded', function() {
  // ========== 安全存储封装（移动端隐私模式 localStorage 可能抛异常） ==========
  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* 忽略存储异常 */ }
  }

  // ========== 客户端 i18n 翻译引擎 ==========
  var I18N = window.__I18N__ || {};
  var DEFAULT_LANG = window.__DEFAULT_LANG__ || 'zh-CN';

  function getLang() {
    var saved = safeGet('lang');
    if (saved && I18N[saved]) return saved;
    return DEFAULT_LANG;
  }

  var currentLang = getLang();

  function setLangActive(lang) {
    var langLinks = document.querySelectorAll('.lang-dropdown li a');
    for (var k = 0; k < langLinks.length; k++) {
      langLinks[k].classList.remove('active');
      if (langLinks[k].getAttribute('data-lang') === lang) {
        langLinks[k].classList.add('active');
      }
    }
  }

  function applyTranslations(lang) {
    if (!I18N[lang]) return;
    var dict = I18N[lang];

    // 翻译带有 data-i18n 属性的元素
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    }

    // 翻译带有 data-i18n-title 属性的元素（title 属性）
    var titleElements = document.querySelectorAll('[data-i18n-title]');
    for (var j = 0; j < titleElements.length; j++) {
      var tel = titleElements[j];
      var tkey = tel.getAttribute('data-i18n-title');
      if (dict[tkey]) {
        tel.setAttribute('title', dict[tkey]);
      }
    }

    // 更新 html[data-lang] 以切换文章内容语言容器
    document.documentElement.setAttribute('data-lang', lang);

    // 更新浏览器标签页标题
    var postTitleEl = document.querySelector('.post-title[data-i18n]');
    if (postTitleEl && postTitleEl.textContent) {
      document.title = postTitleEl.textContent;
    }

    currentLang = lang;
    setLangActive(lang);
    updateThemeToggleTitle();
  }

  function updateThemeToggleTitle() {
    var toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    var dict = I18N[currentLang] || {};
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var key = isDark ? 'theme.light' : 'theme.dark';
    if (dict[key]) {
      toggleBtn.setAttribute('title', dict[key]);
      toggleBtn.setAttribute('aria-label', dict[key]);
    }
  }

  // 页面加载时应用已保存的语言
  if (currentLang !== DEFAULT_LANG) {
    applyTranslations(currentLang);
  } else {
    if (!document.documentElement.getAttribute('data-lang')) {
      document.documentElement.setAttribute('data-lang', DEFAULT_LANG);
    }
    setLangActive(DEFAULT_LANG);
    updateThemeToggleTitle();
  }

  // ========== 暗/亮色主题切换 ==========
  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      var htmlEl = document.documentElement;
      var curTheme = htmlEl.getAttribute('data-theme');
      var newTheme = curTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      safeSet('theme', newTheme);
      updateThemeToggleTitle();
    });
  }

  // ========== 语言切换下拉菜单（收起/展开） ==========
  var langToggle = document.getElementById('lang-toggle');
  var langDropdown = document.getElementById('lang-dropdown');

  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (langDropdown.classList.contains('open')) {
        langDropdown.classList.remove('open');
      } else {
        langDropdown.classList.add('open');
      }
    });

    langDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function() {
      langDropdown.classList.remove('open');
    });
  }

  // ========== 点击语言选项 → 客户端即时切换 ==========
  var langLinks = document.querySelectorAll('.lang-dropdown li a');
  for (var i = 0; i < langLinks.length; i++) {
    langLinks[i].addEventListener('click', function() {
      var targetLang = this.getAttribute('data-lang');
      if (targetLang === currentLang) {
        if (langDropdown) langDropdown.classList.remove('open');
        return;
      }

      // 保存偏好
      safeSet('lang', targetLang);

      // 即时应用翻译（不刷新页面）
      applyTranslations(targetLang);

      if (langDropdown) langDropdown.classList.remove('open');
    });
  }
});
