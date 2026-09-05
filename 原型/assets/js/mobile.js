/* ==========================================================================
   移动端原型运行时（mobile.js）  v1.0
   株洲市人才公寓管理平台 · 湘易办小程序 / APP 端

   与 app.js 的分工：
     app.js    负责 PC 管理端的顶栏 / 侧栏 / 列表增强 / 分页；
     mobile.js 负责移动端的状态栏 / 导航栏 / 底部页签 / 口径说明面板，
               以及半屏弹层、Toast、开关、选项卡等移动交互。
   移动端页面的 <body> 上不写 data-role，因此 app.js 的 injectLayout() 会自动跳过，
   两个运行时不会互相干扰。

   ES5 语法，file:// 协议下可直接双击运行。

   body 上的声明式属性：
     data-mtitle    导航栏标题
     data-mmod      所属功能模块（如「M5 人才公寓资格申请」）
     data-mcode     功能点编号（如「M5-03」）
     data-mdesc     本页承载的业务口径说明
     data-mback     返回目标文件名（同目录），留空则返回上一页
     data-mnav      填 "0" 则不显示导航栏（沉浸式首页用）
     data-mchan     渠道标识（如「湘易办」「株洲人才」）
     data-mtabset   底部页签组：public（公众端）/ gov（政务端），留空不显示
     data-mtab      当前激活的页签 key
     data-mact      导航栏右侧操作图标（Font Awesome 类名，可选）
     data-mtint     填 "1" 则启用蓝色沉浸式状态栏
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     一、配置区 —— 底部页签与端信息
     ========================================================================== */
  var TABSETS = {
    public: {
      name: '移动端 · 公众端',
      nav: 'nav.html',
      items: [
        { key: 'home', label: '首页', icon: 'fa-house', href: 'home.html' },
        { key: 'house', label: '房源', icon: 'fa-building', href: 'house-list.html' },
        { key: 'apply', label: '办理', icon: 'fa-file-pen', href: 'apply-type.html' },
        { key: 'msg', label: '消息', icon: 'fa-comment-dots', href: 'msg-center.html', dot: '3' },
        { key: 'me', label: '我的', icon: 'fa-user', href: 'me.html' }
      ]
    },
    gov: {
      name: '移动端 · 政务端',
      nav: 'nav.html',
      items: [
        { key: 'home', label: '待办', icon: 'fa-list-check', href: 'home.html', dot: '9' },
        { key: 'check', label: '核查', icon: 'fa-location-dot', href: 'check-list.html' },
        { key: 'wo', label: '工单', icon: 'fa-screwdriver-wrench', href: 'wo-list.html' },
        { key: 'me', label: '我的', icon: 'fa-user', href: 'me.html' }
      ]
    }
  };

  /* ==========================================================================
     二、运行时
     ========================================================================== */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function attr(name, dft) {
    var v = document.body.getAttribute(name);
    return v == null || v === '' ? (dft == null ? '' : dft) : v;
  }
  function screenEl() { return document.querySelector('.m-screen'); }

  /* ------- 状态栏 ------- */
  function statusHTML() {
    return '<div class="m-status">' +
        '<span class="m-time">9:41</span>' +
        '<span class="m-sig">' +
          '<i class="fa-solid fa-signal"></i>' +
          '<i class="fa-solid fa-wifi"></i>' +
          '<i class="fa-solid fa-battery-three-quarters"></i>' +
        '</span>' +
      '</div>';
  }

  /* ------- 导航栏 ------- */
  function navHTML() {
    var title = attr('data-mtitle', '株洲人才安居');
    var chan = attr('data-mchan');
    var act = attr('data-mact');
    return '<div class="m-nav">' +
        '<button class="m-nav-back" type="button" title="返回"><i class="fa-solid fa-angle-left"></i></button>' +
        '<div class="m-nav-title">' + esc(title) + '</div>' +
        (chan ? '<span class="m-chan">' + esc(chan) + '</span>' : '') +
        (act ? '<button class="m-nav-act" type="button" title="更多"><i class="fa-solid ' + esc(act) + '"></i></button>'
             : '<span style="width:32px"></span>') +
      '</div>';
  }

  /* ------- 底部页签 ------- */
  function tabbarHTML(set, cur) {
    var ts = TABSETS[set];
    if (!ts) return '';
    var html = '<div class="m-tabbar">';
    for (var i = 0; i < ts.items.length; i++) {
      var it = ts.items[i];
      var on = it.key === cur;
      html += '<a href="' + esc(it.href) + '" class="' + (on ? 'on' : '') + '">' +
        '<i class="fa-solid ' + it.icon + '"></i><span>' + esc(it.label) + '</span>' +
        (it.dot && !on ? '<span class="m-tab-dot">' + esc(it.dot) + '</span>' : '') +
      '</a>';
    }
    return html + '</div>';
  }

  /* ------- 注入手机外框内的固定结构 ------- */
  function injectChrome() {
    var sc = screenEl();
    if (!sc) return;
    if (attr('data-mtint') === '1') sc.classList.add('tint');

    var head = statusHTML() + (attr('data-mnav') === '0' ? '' : navHTML());
    var first = sc.firstChild;
    var wrap = document.createElement('div');
    wrap.innerHTML = head;
    while (wrap.firstChild) { sc.insertBefore(wrap.firstChild, first); }

    /* 底部页签与 Home 指示条：追加到屏幕末尾（在 .m-actbar 之后） */
    var tail = tabbarHTML(attr('data-mtabset'), attr('data-mtab')) + '<div class="m-hi"></div>';
    var w2 = document.createElement('div');
    w2.innerHTML = tail;
    while (w2.firstChild) { sc.appendChild(w2.firstChild); }

    /* 返回键 */
    var back = sc.querySelector('.m-nav-back');
    if (back) {
      back.addEventListener('click', function () {
        var t = attr('data-mback');
        if (t) { location.href = t; return; }
        if (history.length > 1) { history.back(); return; }
        MB.toast('已在首页，无上一级页面');
      });
    }
    var act = sc.querySelector('.m-nav-act');
    if (act) {
      act.addEventListener('click', function () { MB.toast('原型演示：更多操作'); });
    }
  }

  /* 说明：演示需要「像一个系统」，已移除页面右侧的原型口径 / 跳转 / 导航面板。
     手机外框由 .m-stage 居中展示；页面内的业务跳转仍由页面自身链接与底部页签承载。 */

  /* ------- 交互增强 ------- */
  function enhance() {
    var sc = screenEl();
    if (!sc) return;

    /* 半屏弹层：data-sheet="弹层id" */
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-sheet]') : null;
      if (t) { e.preventDefault(); MB.sheet(t.getAttribute('data-sheet')); return; }

      var x = e.target.closest ? e.target.closest('.m-sh-x, [data-sheet-close]') : null;
      if (x) { e.preventDefault(); MB.closeSheet(); return; }

      if (e.target.classList && e.target.classList.contains('m-mask')) { MB.closeSheet(); return; }

      /* 纯提示型元素：data-toast="文案" */
      var tp = e.target.closest ? e.target.closest('[data-toast]') : null;
      if (tp) { e.preventDefault(); MB.toast(tp.getAttribute('data-toast')); return; }

      /* 开关 */
      var sw = e.target.closest ? e.target.closest('.m-sw') : null;
      if (sw) {
        sw.classList.toggle('on');
        MB.toast(sw.classList.contains('on') ? '已开启' : '已关闭');
        return;
      }

      /* 选项卡片：同组单选，.m-opts.multi 内多选 */
      var op = e.target.closest ? e.target.closest('.m-opt') : null;
      if (op && !op.classList.contains('is-off')) {
        var box = op.parentElement;
        if (box && box.classList.contains('multi')) {
          op.classList.toggle('on');
        } else if (box) {
          var sib = box.querySelectorAll('.m-opt');
          for (var i = 0; i < sib.length; i++) { sib[i].classList.remove('on'); }
          op.classList.add('on');
        }
        return;
      }

      /* 分段控件 / 筛选胶囊：按钮型就地切换 */
      var sg = e.target.closest ? e.target.closest('.m-seg button, .m-pills button') : null;
      if (sg) {
        var g = sg.parentElement.querySelectorAll('button');
        for (var j = 0; j < g.length; j++) { g[j].classList.remove('on'); }
        sg.classList.add('on');
        MB.toast('已切换为「' + sg.textContent.trim() + '」');
      }
    });

    /* 无权限 / 置灰元素点击说明原因 */
    var offs = sc.querySelectorAll('.is-off[data-why]');
    for (var k = 0; k < offs.length; k++) {
      offs[k].addEventListener('click', function () { MB.toast(this.getAttribute('data-why')); });
    }
  }

  /* ==========================================================================
     三、全局 API
     ========================================================================== */
  var MB = {
    toast: function (msg, ms) {
      var sc = screenEl();
      if (!sc) return;
      var old = sc.querySelector('.m-toast');
      if (old) old.parentNode.removeChild(old);
      var d = document.createElement('div');
      d.className = 'm-toast';
      d.innerHTML = esc(msg || '原型演示');
      sc.appendChild(d);
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, ms || 1800);
    },

    sheet: function (id) {
      var sc = screenEl();
      var el = document.getElementById(id);
      if (!sc || !el) { MB.toast('原型演示'); return; }
      MB.closeSheet();
      var mask = sc.querySelector('.m-mask');
      if (!mask) {
        mask = document.createElement('div');
        mask.className = 'm-mask';
        sc.appendChild(mask);
      }
      mask.classList.add('on');
      el.classList.add('on');
    },

    closeSheet: function () {
      var sc = screenEl();
      if (!sc) return;
      var mask = sc.querySelector('.m-mask');
      if (mask) mask.classList.remove('on');
      var list = sc.querySelectorAll('.m-sheet.on');
      for (var i = 0; i < list.length; i++) { list[i].classList.remove('on'); }
    },

    /* 二次确认：重操作前必须走这里 */
    confirm: function (msg, okText, cb) {
      var sc = screenEl();
      if (!sc) return;
      var id = 'mbConfirm';
      var old = document.getElementById(id);
      if (old) old.parentNode.removeChild(old);
      var el = document.createElement('div');
      el.className = 'm-sheet';
      el.id = id;
      el.innerHTML =
        '<div class="m-sh-h"><i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i>请确认' +
          '<button class="m-sh-x" type="button"><i class="fa-solid fa-xmark"></i></button></div>' +
        '<div class="m-sh-b"><div class="m-note warn"><i class="fa-solid fa-circle-info"></i><div>' + msg + '</div></div></div>' +
        '<div class="m-sh-f">' +
          '<button class="m-btn" type="button" data-sheet-close>取消</button>' +
          '<button class="m-btn primary" type="button" id="mbConfirmOk">' + esc(okText || '确认') + '</button>' +
        '</div>';
      sc.appendChild(el);
      MB.sheet(id);
      document.getElementById('mbConfirmOk').addEventListener('click', function () {
        MB.closeSheet();
        if (typeof cb === 'function') cb();
      });
    },

    /* 表单必填校验：校验 .m-form 内所有 .req 标记的输入 */
    validate: function (scope) {
      var box = typeof scope === 'string' ? document.querySelector(scope) : (scope || document);
      var items = box.querySelectorAll('.m-fi');
      for (var i = 0; i < items.length; i++) {
        var lb = items[i].querySelector('label .req');
        if (!lb) continue;
        var inp = items[i].querySelector('input, select, textarea');
        if (inp && !String(inp.value || '').trim()) {
          var name = (items[i].querySelector('label').textContent || '').replace('*', '').trim();
          MB.toast(name + ' 为必填项');
          inp.focus();
          return false;
        }
      }
      return true;
    },

    /* 提交：校验 + 二次确认 + 跳转 */
    submit: function (scope, msg, okText, href) {
      if (!MB.validate(scope)) return;
      MB.confirm(msg, okText, function () {
        if (href) { location.href = href; } else { MB.toast('已提交，请在「我的申请」查看办理进度'); }
      });
    },

    go: function (href) { location.href = href; }
  };

  window.MB = MB;

  /* ------- 引导 ------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.body.classList.contains('m-body')) return;
    injectChrome();
    enhance();
  });
})();
