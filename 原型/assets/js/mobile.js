/* ==========================================================================
   移动端原型运行时（mobile.js）  v1.0
   株洲市人才住房保障管理平台 · 湘易办小程序 / APP 端

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
  /* 四类移动端角色的底部菜单（依 2026-09-07 决议）：
       public   个人用户 M1 —— 首页、房源、消息、我的（已删除原「办理」入口）
       agency   运营机构 M2 —— 核查、工单、我的
       employer 用人单位 M3 —— 业务申报、单位信息
       gov      主管单位 M4 —— 待办、我的 */
  var TABSETS = {
    public: {
      name: '个人用户', base: 'mobile/public/',
      items: [
        { key: 'home', label: '首页', icon: 'fa-house', href: 'home.html' },
        { key: 'house', label: '房源', icon: 'fa-building', href: 'house-list.html' },
        { key: 'msg', label: '消息', icon: 'fa-comment-dots', href: 'msg-center.html', dot: '3' },
        { key: 'me', label: '我的', icon: 'fa-user', href: 'me.html' }
      ]
    },
    agency: {
      name: '运营机构', base: 'mobile/gov/',
      items: [
        { key: 'check', label: '核查', icon: 'fa-location-dot', href: 'check-list.html' },
        { key: 'wo', label: '工单', icon: 'fa-screwdriver-wrench', href: 'wo-list.html', dot: '5' },
        { key: 'me', label: '我的', icon: 'fa-user', href: 'me.html' }
      ]
    },
    employer: {
      name: '用人单位', base: 'mobile/employer/',
      items: [
        { key: 'declare', label: '业务申报', icon: 'fa-file-import', href: 'home.html', dot: '2' },
        { key: 'org', label: '单位信息', icon: 'fa-building-user', href: 'org-info.html' }
      ]
    },
    gov: {
      name: '主管单位', base: 'mobile/gov/',
      items: [
        { key: 'home', label: '待办', icon: 'fa-list-check', href: 'home.html', dot: '9' },
        { key: 'me', label: '我的', icon: 'fa-user', href: 'me.html' }
      ]
    }
  };

  /* 角色切换：同一账号具备多重身份时在端内切换，切换后底部菜单随之变化 */
  var ROLE_SWITCH = [
    { key: 'public', name: '个人用户', user: '王梓涵', org: '青年人才', icon: 'fa-user',
      href: 'mobile/public/home.html' },
    { key: 'agency', name: '运营机构', user: '黄卫兵', org: '株洲城发高科人才安居服务有限公司', icon: 'fa-screwdriver-wrench',
      href: 'mobile/gov/check-list.html' },
    { key: 'employer', name: '用人单位', user: '邹敏', org: '中车株洲电力机车研究所', icon: 'fa-building-user',
      href: 'mobile/employer/home.html' },
    { key: 'gov', name: '主管单位', user: '刘志刚', org: '市保障性住房服务中心', icon: 'fa-user-shield',
      href: 'mobile/gov/home.html' }
  ];

  /* 移动端页面只引 mobile.js，取不到 app.js 的 APP_CONFIG.dict，
     故在此内置移动端表单实际用到的字典，取值须与 app.js 的 dict 保持一致。 */
  var DICT = {
    yesNo: [['1', '是'], ['0', '否']],
    district: [
      ['01', '天元区'], ['02', '荷塘区'], ['03', '芦淞区'], ['04', '石峰区'],
      ['05', '经开区'], ['06', '渌口区']
    ],
    applyType: [['1', '创业青年人才'], ['2', '就业青年人才'], ['3', '特殊人才（免毕业年限）']],
    education: [
      ['1', '全日制大专'], ['2', '全日制本科'], ['3', '硕士研究生'], ['4', '博士研究生'],
      ['5', '国（境）外学历']
    ],
    marriage: [['1', '未婚'], ['2', '已婚'], ['3', '离异'], ['4', '丧偶']],
    roomType: [['1', '单间配套'], ['2', '一室一厅'], ['3', '二室一厅'], ['4', '三室一厅']],
    woType: [
      ['1', '水暖管道'], ['2', '电路照明'], ['3', '家电维修'], ['4', '门窗锁具'],
      ['5', '墙面地面'], ['6', '其他']
    ],
    quitReason: [
      ['1', '保障期届满'], ['2', '购买住房'], ['3', '离职离株'], ['4', '主动退租'],
      ['5', '违规清退'], ['6', '其他']
    ],
    evalObject: [['1', '物业服务'], ['2', '运营单位服务']],
    evalCycle: [['1', '按月'], ['2', '按季']],
    bookStatus: [
      ['1', '预约中'], ['2', '已确认'], ['3', '已改约'], ['4', '已取消'],
      ['5', '已转申请'], ['6', '已配租']
    ]
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

  /* ------- 项目根前缀：由 mobile.js 自身的 src 反推，供角色切换跨目录跳转 ------- */
  function rootBase() {
    var sc = document.currentScript;
    if (!sc) {
      var list = document.getElementsByTagName('script');
      for (var i = list.length - 1; i >= 0; i--) {
        if ((list[i].src || '').indexOf('mobile.js') >= 0) { sc = list[i]; break; }
      }
    }
    var src = sc ? sc.getAttribute('src') || '' : '';
    return src.replace(/assets\/js\/mobile\.js.*$/, '');
  }

  /* ------- 导航栏 ------- */
  function navHTML() {
    var title = attr('data-mtitle', '建宁安居');
    var chan = attr('data-mchan');
    var act = attr('data-mact');
    var noRole = attr('data-mrole') === '0';
    return '<div class="m-nav">' +
        '<button class="m-nav-back" type="button" title="返回"><i class="fa-solid fa-angle-left"></i></button>' +
        '<div class="m-nav-title">' + esc(title) + '</div>' +
        (chan ? '<span class="m-chan">' + esc(chan) + '</span>' : '') +
        (noRole ? '' : '<button class="m-nav-role" type="button" title="切换角色"><i class="fa-solid fa-repeat"></i></button>') +
        (act ? '<button class="m-nav-act" type="button" title="更多"><i class="fa-solid ' + esc(act) + '"></i></button>'
             : '<span style="width:32px"></span>') +
      '</div>';
  }

  /* ------- 角色切换半屏弹层（B01）------- */
  function roleSheetHTML(cur) {
    var base = rootBase();
    var html = '<div class="m-sheet" id="mbRoleSheet">' +
      '<div class="m-sh-h"><i class="fa-solid fa-repeat"></i>切换角色' +
        '<button class="m-sh-x" type="button"><i class="fa-solid fa-xmark"></i></button></div>' +
      '<div class="m-sh-b">' +
        '<div class="m-note"><i class="fa-solid fa-circle-info"></i><div>同一账号具备多重身份的可在端内切换，' +
        '<b>切换后底部菜单随之变化</b>。</div></div><div class="m-cells">';
    for (var i = 0; i < ROLE_SWITCH.length; i++) {
      var r = ROLE_SWITCH[i], on = r.key === cur;
      html += '<a class="m-cell" href="' + esc(base + r.href) + '">' +
        '<span class="m-ci' + (on ? '' : ' cyan') + '"><i class="fa-solid ' + r.icon + '"></i></span>' +
        '<span class="m-cl"><b>' + esc(r.name) + '</b><span class="m-cs">' + esc(r.user) + '　·　' + esc(r.org) + '</span></span>' +
        (on ? '<span class="m-cv"><span class="m-tag green">当前</span></span>' : '<span class="m-cv">切换</span>') +
        '<i class="m-ca fa-solid fa-angle-right"></i></a>';
    }
    return html + '</div></div></div>';
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
    /* 角色切换：沉浸式页面（data-mnav="0"）没有导航栏，改挂一个浮动按钮 */
    if (attr('data-mnav') === '0' && attr('data-mrole') !== '0') {
      var fab = document.createElement('button');
      fab.type = 'button';
      fab.className = 'm-role-fab';
      fab.title = '切换角色';
      fab.innerHTML = '<i class="fa-solid fa-repeat"></i>';
      sc.appendChild(fab);
    }
    var rb = sc.querySelector('.m-nav-role') || sc.querySelector('.m-role-fab');
    if (rb) {
      var rw = document.createElement('div');
      rw.innerHTML = roleSheetHTML(attr('data-mtabset'));
      while (rw.firstChild) { sc.appendChild(rw.firstChild); }
      rb.addEventListener('click', function () { MB.sheet('mbRoleSheet'); });
    }

    var act = sc.querySelector('.m-nav-act');
    if (act) {
      act.addEventListener('click', function () { MB.toast('原型演示：更多操作'); });
    }
  }

  /* 说明：演示需要「像一个系统」，已移除页面右侧的原型口径 / 跳转 / 导航面板。
     手机外框由 .m-stage 居中展示；页面内的业务跳转仍由页面自身链接与底部页签承载。 */

  /* ------- 字典下拉自动填充：<select data-dict="xxx">，data-ph 指定占位项 ------- */
  function populateDicts() {
    var list = document.querySelectorAll('select[data-dict]');
    for (var i = 0; i < list.length; i++) {
      var sel = list[i];
      if (sel.getAttribute('data-dict-done') === '1') continue;
      var rows = DICT[sel.getAttribute('data-dict')];
      if (!rows) continue;
      var sub = sel.getAttribute('data-selected');
      /* 未指定选中项时默认落在第一项，保证 MB.validate 不会把演示数据判成空值 */
      var ph = sel.hasAttribute('data-ph') ? sel.getAttribute('data-ph') : '';
      var html = ph ? '<option value="">' + esc(ph) + '</option>' : '';
      for (var j = 0; j < rows.length; j++) {
        var on = sub ? (rows[j][0] === sub) : (!ph && j === 0);
        html += '<option value="' + esc(rows[j][0]) + '"' + (on ? ' selected' : '') + '>' + esc(rows[j][1]) + '</option>';
      }
      sel.innerHTML = html;
      sel.setAttribute('data-dict-done', '1');
    }
  }

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
    populateDicts();
    enhance();
  });
})();
