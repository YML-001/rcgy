/* ==========================================================================
   口径承载页 · 共享脚本（spec.js）  v2.0
   在 app.js 之后引入，不改动 app.js 的任何行为。与 spec.css 配套使用。

   提供页面内演示交互的公共封装：单选、下钻、异步导出、无权限说明、
   双人授权、脱敏解除、页签与 URL 参数互通。
   ========================================================================== */
(function () {
  'use strict';

  /* 当前登录人姓名：从 APP_CONFIG.roles 反查，双人授权拦截需要比对发起人 */
  function me() {
    var cfg = window.APP_CONFIG || {};
    var roles = cfg.roles || {};
    var r = (window.PMS && PMS.role) || document.body.getAttribute('data-current-role') || cfg.defaultRole;
    return (roles[r] && roles[r].user) || '当前登录人';
  }

  var SP = {
    me: me,

    /* 同组卡片 / 树节点单选 */
    pick: function (el, sel, cb) {
      var box = el.parentElement;
      while (box && !box.querySelector) box = box.parentElement;
      if (!box) return;
      box.querySelectorAll(sel).forEach(function (n) { n.classList.remove('on'); });
      el.classList.add('on');
      if (typeof cb === 'function') cb(el);
    },

    /* 指标下钻。给了 href 的真跳转，没给的以 Toast 说明下钻目标 */
    drill: function (name, desc, href) {
      if (href) {
        PMS.toast('正在打开「' + name + '」' + (desc ? ' · ' + desc : ''));
        setTimeout(function () { location.href = href; }, 260);
        return;
      }
      PMS.toast('下钻至「' + name + '」' + (desc ? ' · ' + desc : ''));
    },

    exportAsync: function (name) {
      PMS.toast('已提交导出任务：' + name + '，完成后在顶栏消息区提醒', 'success');
    },

    /* 无权限或不可用的操作：点击后说明原因，不做隐藏 */
    denied: function (why) { PMS.toast(why, 'error'); },

    /* 通用动作反馈，避免出现无反馈按钮 */
    todo: function (what) { PMS.toast(what); },

    /* 高敏操作双人授权：发起与审批必须两人 */
    dual: function (act, who, onOk) {
      if (who && who === me()) {
        PMS.toast('「' + act + '」由您本人发起，不能由本人审批。请转交同岗其他人员或上级复核', 'error');
        return;
      }
      PMS.confirm({
        title: act + ' · 双人授权确认',
        message: '确认执行「' + act + '」？',
        detail: '本操作属高敏操作：发起人与审批人必须为不同人员，操作全程留痕（含操作人、时间、IP、前后值）。',
        type: 'warning', okText: '确认执行',
        onOk: function () {
          if (typeof onOk === 'function') onOk();
          else PMS.toast('已执行「' + act + '」并写入操作留痕', 'success');
        }
      });
    },

    /* 敏感字段脱敏解除：默认掩码，申请后临时展开并留痕 */
    mask: function (el, full, why) {
      if (!el) return;
      if (el.classList.contains('open')) {
        el.classList.remove('open');
        el.innerHTML = el.getAttribute('data-mask') || el.textContent;
        PMS.toast('已收起明文显示');
        return;
      }
      PMS.confirm({
        title: '脱敏解除申请',
        message: '确认申请查看该字段明文？',
        detail: (why || '身份证号、联系电话、银行账号等字段默认脱敏。') +
          '查看明文将记录申请人、事由、时间与被查对象，可被审计追溯。',
        type: 'warning', okText: '申请并查看',
        onOk: function () {
          if (!el.getAttribute('data-mask')) el.setAttribute('data-mask', el.innerHTML);
          el.classList.add('open');
          el.innerHTML = full + ' <span class="mk" onclick="SP.mask(this.parentElement)">收起</span>';
          PMS.toast('已临时展示明文并写入查看留痕', 'success');
        }
      });
    },

    param: function (k, def) {
      var m = new RegExp('[?&]' + k + '=([^&]*)').exec(location.search);
      return m ? decodeURIComponent(m[1]) : (def === undefined ? '' : def);
    },

    /* 按名称切换页签，供 URL 参数恢复与跨页链接使用 */
    tab: function (name, scope) {
      var box = scope ? document.querySelector(scope) : document;
      var t = box && box.querySelector('.tabs .tab[data-tab="' + name + '"]');
      if (t) t.click();
    },

    /* 千分位金额，元 → 万元保留两位 */
    wan: function (yuan) {
      return (yuan / 10000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  window.SP = SP;

  /* 落地时按 URL 的 tab 参数切到指定页签 */
  document.addEventListener('DOMContentLoaded', function () {
    var t = SP.param('tab');
    if (t) SP.tab(t);
  });
})();
