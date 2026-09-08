/* ==========================================================================
   政务蓝基线 · 原型布局与组件引擎 (app.js)  v2.0

   分两部分：
     一、配置区 —— 每个新系统只改这里（系统名、角色、菜单、字典、首页数据）
     二、运行时 —— 无需修改

   路径约定（重要）：
     菜单 href 一律从「项目根」起算书写，例如 "modules/contract/list.html"。
     运行时按 app.js 自身的 src 反推出当前页面到项目根的相对前缀，自动补齐，
     因此同一份配置在根目录的 shell.html 与 modules/xx/ 下的业务页都能正确跳转。
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     一、配置区
     ========================================================================== */
  var APP_CONFIG = {
    /* ---------- 基本信息 ---------- */
    sysName: '株洲市人才住房保障管理平台',
    /* 品牌图标：留空显示图标方块；填相对项目根的图片路径则显示图片 */
    logo: '',
    logoIcon: 'fa-building-user',
    /* 顶栏右侧「返回门户 / 退出」目标，相对项目根 */
    portalHref: 'index.html',
    defaultRole: 'reviewer',

    /* ---------- 角色 ----------
       依 2026-09-07 汇报讨论会决议，PC 端共 13 个角色（R1—R13）。
       role 格式固定为「单位 · 岗位」，顶栏与角色切换器按最后一个 ' · ' 拆分 */
    roles: {
      reviewer:  { tag: 'PC 管理端', user: '刘志刚', role: '市保障性住房服务中心资格审核科 · 受理初审员' },
      auditor:   { tag: 'PC 管理端', user: '周慧',   role: '市保障性住房服务中心资格审核科 · 审核员' },
      housing:   { tag: 'PC 管理端', user: '唐凯',   role: '市保障性住房服务中心房源管理科 · 单位房源管理员' },
      orgadmin:  { tag: 'PC 管理端', user: '徐立',   role: '市保障性住房服务中心运营监管科 · 企业机构管理员' },
      allocator: { tag: 'PC 管理端', user: '陈晓琳', role: '市保障性住房服务中心配租管理科 · 配租经办员' },
      keeper:    { tag: 'PC 管理端', user: '罗湘',   role: '市保障性住房服务中心财务科 · 租金核算员' },
      admin:     { tag: 'PC 管理端', user: '龙志宏', role: '市保障性住房服务中心信息科 · 权限配置管理员' },
      agency:    { tag: 'PC 管理端', user: '彭建华', role: '株洲城发高科人才安居服务有限公司 · 运营机构经办' },
      employer:  { tag: 'PC 管理端', user: '邹敏',   role: '中车株洲电力机车研究所人事部 · 用人单位经办' },
      window:    { tag: 'PC 管理端', user: '谭建军', role: '市政务服务中心人才住房窗口 · 窗口受理员' },
      publisher: { tag: 'PC 管理端', user: '何静',   role: '市保障性住房服务中心综合科 · 信息公开经办' },
      manager:   { tag: 'PC 管理端', user: '李慧敏', role: '市住建局住房保障科 · 业务管理员' },
      leader:    { tag: 'PC 管理端', user: '张卫东', role: '市住建局 · 分管领导' }
    },

    /* ---------- 外部角色（跳转其他应用，不在本外壳内呈现）----------
       人才侧办事入口固定为湘易办小程序与 APP，用独立的移动端原型承载 */
    extRoles: [
      { key: 'talent-app', name: '个人用户', user: '王梓涵', org: '湘易办移动端 · 个人用户',
        icon: 'fa-mobile-screen-button', href: 'mobile/public/home.html' },
      { key: 'emp-app', name: '用人单位', user: '邹敏', org: '湘易办移动端 · 用人单位',
        icon: 'fa-building-user', href: 'mobile/employer/home.html' },
      { key: 'agency-app', name: '运营机构', user: '黄卫兵', org: '湘易办移动端 · 运营机构',
        icon: 'fa-screwdriver-wrench', href: 'mobile/gov/check-list.html' },
      { key: 'gov-app', name: '主管单位', user: '刘志刚', org: '湘易办移动端 · 主管单位',
        icon: 'fa-user-shield', href: 'mobile/gov/home.html' }
    ],

    /* ---------- 角色可见菜单白名单 ----------
       null 或不配置 = 全部可见。菜单 key 必须写成「子系统码-两位序号」，
       运行时按它反推该页面所属子系统。
       数据范围口径见《各角色功能清单》第六部分：房源归属决定业务数据归属。 */
    roleMenu: {
      /* R1 受理初审角色：资格申请的受理与初审，两级办理的第一级 */
      reviewer: ['home', 'wb-01', 'wb-02', 'wb-04',
        'apply-06', 'apply-22', 'apply-09', 'apply-08',
        'apply-07', 'apply-10', 'apply-11', 'apply-21', 'apply-26', 'apply-27',
        'apply-01', 'apply-02', 'apply-03', 'apply-04', 'apply-05',
        'apply-13', 'apply-14', 'apply-15', 'apply-16', 'apply-17', 'apply-18', 'apply-19', 'apply-20',
        'rent-09', 'rent-10', 'rent-13', 'rent-14', 'rent-15',
        'stat-12', 'stat-13', 'stat-14'
        ],
      /* R2 审核角色：复审并出具最终结论，两级办理的第二级 */
      auditor: ['home', 'wb-01', 'wb-02', 'wb-04',
        'apply-06', 'apply-22', 'apply-07', 'apply-12', 'apply-21', 'apply-26',
        'apply-08', 'apply-13', 'apply-14', 'apply-15', 'apply-16', 'apply-17', 'apply-18', 'apply-19',
        'rent-11', 'rent-12',
        'stat-13'
        ],
      /* R3 单位房源管理员：全市房源查看与监管、审核发布、标准与字典，不介入日常维护 */
      housing: ['home', 'wb-01', 'wb-04',
        'house-01', 'house-04', 'house-05', 'house-06',
        'house-07', 'house-08', 'house-09', 'house-10', 'house-11', 'house-12', 'house-13',
        'house-14', 'house-15', 'house-16', 'house-17', 'house-18', 'house-19', 'house-20',
        'house-21', 'house-22', 'house-23', 'house-26', 'house-27',
        'house-28', 'house-29', 'house-30', 'house-31', 'house-32', 'house-33', 'house-34', 'house-35',
        'house-36', 'house-37',
        'stat-05', 'stat-06', 'stat-07', 'stat-09'
        ],
      /* R4 企业机构管理角色：运营机构与用人单位两类外部主体、考核与评价 */
      orgadmin: ['home', 'wb-01', 'wb-04',
        'ops-01', 'agency-03', 'agency-04',
        'ops-02', 'ops-03', 'ops-04', 'ops-06',
        'ops-07', 'ops-08', 'ops-09',
        'ops-11', 'ops-12', 'ops-13', 'ops-14'
        ],
      /* R5 配租经办角色：配租批次、轮候库、选房编排、合同 */
      allocator: ['home', 'wb-01', 'wb-02', 'wb-04',
        'alloc-01', 'alloc-02', 'alloc-03', 'alloc-04', 'alloc-06', 'alloc-07',
        'alloc-08', 'alloc-09', 'alloc-10', 'alloc-11', 'alloc-12', 'alloc-13',
        'house-14', 'house-16', 'house-27', 'house-37',
        'stat-15', 'stat-17'
        ],
      /* R6 租金核算角色：租金标准、账单、收缴、补助核发 */
      keeper: ['home', 'wb-01', 'wb-04',
        'rent-01', 'rent-02', 'rent-03', 'rent-04', 'rent-05', 'rent-06', 'rent-07', 'rent-08',
        'rent-16', 'rent-17', 'rent-18', 'rent-19', 'rent-20',
        'alloc-10', 'alloc-12', 'stat-27'
        ],
      /* R7 权限配置管理员：全部可见 */
      admin: null,
      /* R8 运营机构角色：本机构受托房源及其派生的全部业务数据 */
      agency: ['home', 'wb-01', 'wb-04',
        'house-07', 'house-08', 'house-14', 'house-16', 'house-26',
        'agency-05', 'agency-06', 'agency-07', 'agency-02', 'agency-08',
        'rent-05', 'ops-05', 'ops-07', 'ops-13'
        ],
      /* R9 用人单位角色：本单位职工申报件，不涉及房源与合同 */
      employer: ['home', 'wb-01', 'wb-04',
        'employer-01', 'employer-02', 'employer-03', 'employer-04'
        ],
      /* R10 窗口受理角色：兜底代办与现场答复，政策与房源均为只读 */
      window: ['home', 'wb-01', 'wb-04',
        'apply-23', 'apply-24', 'apply-25', 'apply-06',
        'house-37', 'house-27', 'rule-16'
        ],
      /* R11 信息公开经办角色：对外公开的内容、公告与台账 */
      publisher: ['home', 'wb-01', 'wb-04',
        'rule-01', 'rule-15', 'rule-03', 'rule-05'
        ],
      /* R12 业务管理员角色：政策规则的配置与生效期 */
      manager: ['home', 'wb-01', 'wb-03', 'wb-04',
        'rule-06', 'rule-07', 'rule-09', 'rule-10', 'rule-11', 'rule-12',
        'rule-08', 'rule-13', 'rule-14'
        ],
      /* R13 领导查看角色：驾驶舱与统计，不参与业务办理 */
      leader: ['home', 'wb-02', 'wb-03', 'wb-04',
        'stat-01', 'stat-02', 'stat-03', 'stat-04', 'stat-05', 'stat-06', 'stat-07',
        'stat-09', 'stat-11', 'stat-12', 'stat-13', 'stat-14', 'stat-15',
        'stat-17', 'stat-18', 'stat-23', 'stat-24', 'stat-25', 'stat-26', 'stat-27',
        'stat-28', 'stat-29', 'stat-30', 'stat-31', 'stat-32', 'stat-33'
        ]
    },

    /* ---------- 常驻菜单：出现在所有子系统菜单之前 ---------- */
    menu: [
      { key: 'home', label: '我的工作台', icon: 'fa-table-columns', href: 'modules/workbench/workbench.html' },
      {
        label: '待办与协同', icon: 'fa-bell',
        children: [
          { key: 'wb-01', label: '待办任务中心', href: 'modules/workbench/todo-center.html' },
          { key: 'wb-02', label: '审核时限台账', href: 'modules/workbench/timelimit.html' },
          { key: 'wb-03', label: '跨部门协同看板', href: 'modules/workbench/coop-board.html' },
          { key: 'wb-04', label: '通知公告', href: 'modules/workbench/notice.html' }
        ]
      }
    ],

    /* ---------- 业务子系统 ----------
       一期共 39 个功能模块，按业务线收敛为 10 个子系统，
       每个子系统的一级分组不超过 9 组、每组二级项不超过 8 个。 */
    defaultSystem: 'apply',
    systems: [
      {
        key: 'house', name: '房源筹集与楼盘表', icon: 'fa-building', line: '房源保障',
        menu: [
          {
            label: '房源筹集与项目', icon: 'fa-city',
            children: [
              { key: 'house-01', label: '项目表管理', href: 'modules/house/proj-list.html' },
              { key: 'house-21', label: '项目批量导入', href: 'modules/house/proj-import.html' },
              { key: 'house-04', label: '拎包入住验收', href: 'modules/house/acceptance-list.html' },
              { key: 'house-05', label: '筹集计划与完成率', href: 'modules/house/plan-progress.html' },
              { key: 'house-06', label: '资金来源标注', href: 'modules/house/fund-source.html' }
            ]
          },
          {
            label: '楼盘表与多源归集', icon: 'fa-table-cells',
            children: [
              { key: 'house-07', label: '统一楼盘表', href: 'modules/house/building-table.html' },
              { key: 'house-08', label: '房源批量导入', href: 'modules/house/building-import.html' },
              { key: 'house-22', label: '导入与接口比对合并', href: 'modules/house/import-merge.html' },
              { key: 'house-23', label: '导入模板与批次台账', href: 'modules/house/import-batch.html' },
              { key: 'house-09', label: '保租房房源调用', href: 'modules/house/src-bzf.html' },
              { key: 'house-10', label: '公租房房源调用', href: 'modules/house/src-gzf.html' },
              { key: 'house-11', label: '来源与属性打标', href: 'modules/house/src-tag.html' },
              { key: 'house-12', label: '重复登记校验', href: 'modules/house/src-dup.html' },
              { key: 'house-13', label: '房源同步与对账', href: 'modules/house/src-sync.html' }
            ]
          },
          {
            label: '房源档案与房态', icon: 'fa-house-chimney',
            children: [
              { key: 'house-14', label: '房源档案', href: 'modules/house/house-archive.html' },
              { key: 'house-15', label: '按套与按间管理', href: 'modules/house/house-unit-mode.html' },
              { key: 'house-16', label: '房态图管理', href: 'modules/house/house-status-map.html' },
              { key: 'house-17', label: '用途转换台账', href: 'modules/house/house-convert.html' },
              { key: 'house-18', label: '房源冻结与停租', href: 'modules/house/house-freeze.html' },
              { key: 'house-19', label: '房源展示配置', href: 'modules/house/house-display.html' },
              { key: 'house-20', label: '房源供需测算', href: 'modules/house/house-forecast.html' }
            ]
          },
          {
            label: '房源发布与预约', icon: 'fa-tower-broadcast',
            children: [
              { key: 'house-26', label: '批量上架与下架', href: 'modules/house/shelf-batch.html' },
              { key: 'house-36', label: '房源发布状态统计', href: 'modules/house/publish-stat.html' },
              { key: 'house-37', label: '房源查询（只读）', href: 'modules/house/house-query.html' },
              { key: 'house-27', label: '预约名单管理', href: 'modules/house/book-manage.html' }
            ]
          },
          {
            label: '房源导入与来源台账', icon: 'fa-file-import',
            children: [
              { key: 'house-28', label: '房源来源分类配置', href: 'modules/house/source-config.html' },
              { key: 'house-29', label: '分渠道筹集台账', href: 'modules/house/source-ledger.html' },
              { key: 'house-30', label: '报送账号与范围', href: 'modules/house/report-account.html' },
              { key: 'house-31', label: '分批导入与断点续传', href: 'modules/house/import-load.html' },
              { key: 'house-32', label: '导入校验规则配置', href: 'modules/house/import-rule.html' },
              { key: 'house-33', label: '导入失败明细与重传', href: 'modules/house/import-fail.html' },
              { key: 'house-34', label: '导入批次回滚', href: 'modules/house/import-rollback.html' },
              { key: 'house-35', label: '入库类型标识与切换', href: 'modules/house/intake-type.html' }
            ]
          }
        ]
      },
      {
        key: 'apply', name: '人才档案与资格联审', icon: 'fa-user-check', line: '资格审核',
        menu: [
          {
            label: '人才档案', icon: 'fa-id-card',
            children: [
              { key: 'apply-01', label: '人才一人一档', href: 'modules/apply/talent-list.html' },
              { key: 'apply-02', label: '人才分层分类', href: 'modules/apply/talent-level.html' },
              { key: 'apply-03', label: '保障历史全景', href: 'modules/apply/talent-history.html' },
              { key: 'apply-04', label: '失信名单管理', href: 'modules/apply/talent-blacklist.html' },
              { key: 'apply-05', label: '人才库数据同步', href: 'modules/apply/talent-sync.html' }
            ]
          },
          {
            label: '资格受理与初审', icon: 'fa-inbox',
            children: [
              { key: 'apply-06', label: '多渠道件池', href: 'modules/apply/pool-list.html' },
              { key: 'apply-22', label: '初审与复审分级办理', href: 'modules/apply/two-level-audit.html' },
              { key: 'apply-27', label: '资格审核表打印', href: 'modules/apply/review-form.html' },
              { key: 'apply-26', label: '容缺受理台账', href: 'modules/apply/pending-check.html' },
              { key: 'apply-09', label: '证照智能识别', href: 'modules/apply/verify-ocr.html' },
              { key: 'apply-08', label: '智能预审核验报告', href: 'modules/apply/verify-report.html' }
            ]
          },
          {
            label: '复核与结论', icon: 'fa-user-check',
            children: [
              { key: 'apply-07', label: '人工复核工作台', href: 'modules/apply/audit-desk.html' },
              { key: 'apply-10', label: '审核时限管理', href: 'modules/apply/timelimit-manage.html' },
              { key: 'apply-11', label: '驳回与重新提交', href: 'modules/apply/reject-list.html' },
              { key: 'apply-12', label: '审核结论与送达', href: 'modules/apply/conclusion.html' },
              { key: 'apply-21', label: '全过程电子档案', href: 'modules/apply/archive-list.html' }
            ]
          },
          {
            label: '窗口兜底代办', icon: 'fa-person-booth',
            children: [
              { key: 'apply-23', label: '窗口代办录入', href: 'modules/apply/window-entry.html' },
              { key: 'apply-24', label: '窗口办件台账', href: 'modules/apply/window-ledger.html' },
              { key: 'apply-25', label: '材料清单与表单打印', href: 'modules/apply/material-print.html' }
            ]
          },
          {
            label: '多部门数据核验', icon: 'fa-shield-halved',
            children: [
              { key: 'apply-13', label: '婚姻数据核验', href: 'modules/apply/verify-marriage.html' },
              { key: 'apply-14', label: '不动产数据核验', href: 'modules/apply/verify-realty.html' },
              { key: 'apply-15', label: '学历数据核验', href: 'modules/apply/verify-edu.html' },
              { key: 'apply-16', label: '工商数据核验', href: 'modules/apply/verify-business.html' },
              { key: 'apply-17', label: '个人所得税核验', href: 'modules/apply/verify-tax-personal.html' },
              { key: 'apply-18', label: '企业纳税核验', href: 'modules/apply/verify-tax-corp.html' },
              { key: 'apply-19', label: '社保数据核验', href: 'modules/apply/verify-social.html' },
              { key: 'apply-20', label: '接口异常人工兜底', href: 'modules/apply/manual-fallback.html' }
            ]
          }
        ]
      },
      {
        key: 'alloc', name: '配租选房与合同', icon: 'fa-key', line: '配租签约',
        menu: [
          {
            label: '配租管理', icon: 'fa-list-ol',
            children: [
              { key: 'alloc-01', label: '配租批次管理', href: 'modules/alloc/batch-list.html' },
              { key: 'alloc-02', label: '顺序配租名单', href: 'modules/alloc/order-list.html' },
              { key: 'alloc-03', label: '选房时段编排', href: 'modules/alloc/slot-plan.html' },
              { key: 'alloc-04', label: '意向轮候库管理', href: 'modules/alloc/queue-list.html' },
              { key: 'alloc-06', label: '放弃与资格处置', href: 'modules/alloc/giveup-list.html' },
              { key: 'alloc-07', label: '配租异常处理', href: 'modules/alloc/exception.html' }
            ]
          },
          {
            label: '合同管理', icon: 'fa-file-contract',
            children: [
              { key: 'alloc-08', label: '合同模板管理', href: 'modules/alloc/tpl-list.html' },
              { key: 'alloc-09', label: '电子签章管理', href: 'modules/alloc/seal-manage.html' },
              { key: 'alloc-10', label: '合同要素台账', href: 'modules/alloc/contract-list.html' },
              { key: 'alloc-11', label: '合同变更与解除', href: 'modules/alloc/contract-change.html' },
              { key: 'alloc-12', label: '到期预警', href: 'modules/alloc/expire-warn.html' },
              { key: 'alloc-13', label: '合同归档与查询', href: 'modules/alloc/contract-archive.html' }
            ]
          }
        ]
      },
      {
        key: 'rent', name: '租金收缴与年审退出', icon: 'fa-money-bill-wave', line: '租后管理',
        menu: [
          {
            label: '租金与费用', icon: 'fa-receipt',
            children: [
              { key: 'rent-01', label: '减免方案配置', href: 'modules/rent/relief-plan.html' },
              { key: 'rent-02', label: '分账核算', href: 'modules/rent/split-account.html' },
              { key: 'rent-03', label: '账单批量生成', href: 'modules/rent/bill-batch.html' },
              { key: 'rent-04', label: '账单台账', href: 'modules/rent/bill-list.html' },
              { key: 'rent-05', label: '翼支付收缴对账', href: 'modules/rent/pay-recon.html' },
              { key: 'rent-06', label: '欠租台账与催收', href: 'modules/rent/arrears.html' },
              { key: 'rent-07', label: '押金管理', href: 'modules/rent/deposit.html' },
              { key: 'rent-08', label: '电子票据管理', href: 'modules/rent/invoice.html' }
            ]
          },
          {
            label: '年审续租与退出', icon: 'fa-rotate',
            children: [
              { key: 'rent-09', label: '续租资格自动复核', href: 'modules/rent/renew-check.html' },
              { key: 'rent-10', label: '续租三类结论处理', href: 'modules/rent/renew-conclusion.html' },
              { key: 'rent-11', label: '年度资格审查', href: 'modules/rent/annual-batch.html' },
              { key: 'rent-12', label: '年审结论处置', href: 'modules/rent/annual-result.html' },
              { key: 'rent-13', label: '违规清退管理', href: 'modules/rent/violation.html' },
              { key: 'rent-14', label: '腾退全流程管理', href: 'modules/rent/quit-manage.html' },
              { key: 'rent-15', label: '退出房源回收', href: 'modules/rent/recycle.html' }
            ]
          },
          {
            label: '租房补贴核发', icon: 'fa-hand-holding-dollar',
            children: [
              { key: 'rent-16', label: '补贴标准与计费配置', href: 'modules/rent/subsidy-rule.html' },
              { key: 'rent-17', label: '资格与服务核验', href: 'modules/rent/subsidy-verify.html' },
              { key: 'rent-18', label: '补助金额核定', href: 'modules/rent/subsidy-amount.html' },
              { key: 'rent-19', label: '财政复核与拨付', href: 'modules/rent/subsidy-pay.html' },
              { key: 'rent-20', label: '补助台账与追溯', href: 'modules/rent/subsidy-ledger.html' }
            ]
          }
        ]
      },
      {
        key: 'ops', name: '运营考核与工单服务', icon: 'fa-clipboard-check', line: '运营监管',
        menu: [
          {
            label: '运营机构考核', icon: 'fa-ranking-star',
            children: [
              { key: 'ops-01', label: '运营机构档案', href: 'modules/ops/org-list.html' },
              { key: 'ops-02', label: '考核指标配置', href: 'modules/ops/kpi-config.html' },
              { key: 'ops-03', label: '考核评分', href: 'modules/ops/kpi-score.html' },
              { key: 'ops-04', label: '考核结果应用', href: 'modules/ops/kpi-apply.html' },
              { key: 'ops-05', label: '巡检维修记录', href: 'modules/ops/patrol-record.html' },
              { key: 'ops-06', label: '检查与整改跟踪', href: 'modules/ops/inspect-task.html' }
            ]
          },
          {
            label: '工单与服务', icon: 'fa-screwdriver-wrench',
            children: [
              { key: 'ops-07', label: '报修工单流转', href: 'modules/ops/wo-list.html' },
              { key: 'ops-08', label: '投诉建议办理', href: 'modules/ops/complaint.html' },
              { key: 'ops-09', label: '工单统计与督办', href: 'modules/ops/wo-stat.html' },
              { key: 'ops-10', label: '知识库维护', href: 'modules/ops/kb-list.html' }
            ]
          },
          {
            label: '服务评价管理', icon: 'fa-star-half-stroke',
            children: [
              { key: 'ops-11', label: '评价问卷配置', href: 'modules/ops/eval-form.html' },
              { key: 'ops-12', label: '评价采集与回收', href: 'modules/ops/eval-collect.html' },
              { key: 'ops-13', label: '评价结果统计与公开', href: 'modules/ops/eval-stat.html' },
              { key: 'ops-14', label: '评价与补助挂钩', href: 'modules/ops/eval-subsidy.html' }
            ]
          }
        ]
      },
      {
        key: 'agency', name: '运营机构端', icon: 'fa-building-user', line: '运营协同',
        menu: [
          {
            label: '房源与发布', icon: 'fa-house-circle-check',
            children: [
              { key: 'agency-05', label: '房源提交发布', href: 'modules/agency/publish-submit.html' }
            ]
          },
          {
            label: '签约入住与退租', icon: 'fa-file-signature',
            children: [
              { key: 'agency-06', label: '签约与入住办理', href: 'modules/agency/sign-checkin.html' },
              { key: 'agency-07', label: '退租结算办理', href: 'modules/agency/quit-settle.html' }
            ]
          },
          {
            label: '补助与考核', icon: 'fa-hand-holding-dollar',
            children: [
              { key: 'agency-02', label: '补助申请发起', href: 'modules/agency/subsidy-apply.html' },
              { key: 'agency-08', label: '考核自评与整改', href: 'modules/agency/kpi-self.html' }
            ]
          },
          {
            label: '企业机构管理', icon: 'fa-building-shield',
            children: [
              { key: 'agency-03', label: '用人单位审核', href: 'modules/agency/employer-audit.html' },
              { key: 'agency-04', label: '用人单位管理', href: 'modules/agency/employer-manage.html' }
            ]
          }
        ]
      },
      {
        key: 'employer', name: '用人单位端', icon: 'fa-users-line', line: '单位申报',
        menu: [
          {
            label: '单位与申报', icon: 'fa-clipboard-list',
            children: [
              { key: 'employer-01', label: '单位注册与认证', href: 'modules/employer/org-register.html' },
              { key: 'employer-02', label: '员工批量代申报', href: 'modules/employer/batch-apply.html' },
              { key: 'employer-03', label: '在职状态变更上报', href: 'modules/employer/staff-change.html' },
              { key: 'employer-04', label: '申报进度与数据', href: 'modules/employer/apply-progress.html' }
            ]
          }
        ]
      },
      {
        key: 'rule', name: '信息公开与规则配置', icon: 'fa-sliders', line: '政策口径',
        menu: [
          {
            label: '信息公开与公示', icon: 'fa-bullhorn',
            children: [
              { key: 'rule-01', label: '政策宣传内容管理', href: 'modules/rule/content-manage.html' },
              { key: 'rule-02', label: '房源信息公开配置', href: 'modules/rule/house-open.html' },
              { key: 'rule-15', label: '配租批次公告发布', href: 'modules/rule/batch-notice.html' },
              { key: 'rule-03', label: '配租结果公开', href: 'modules/rule/result-open.html' },
              { key: 'rule-16', label: '政策资讯查看（只读）', href: 'modules/rule/policy-view.html' },
              { key: 'rule-05', label: '信息公开台账', href: 'modules/rule/open-ledger.html' }
            ]
          },
          {
            label: '政策规则配置', icon: 'fa-scale-balanced',
            children: [
              { key: 'rule-06', label: '申请条件规则配置', href: 'modules/rule/cond-rule.html' },
              { key: 'rule-07', label: '租金减免标准配置', href: 'modules/rule/relief-rule.html' },
              { key: 'rule-09', label: '区域差异化规则', href: 'modules/rule/area-rule.html' },
              { key: 'rule-10', label: '流程编排配置', href: 'modules/rule/flow-design.html' },
              { key: 'rule-11', label: '表单与材料清单', href: 'modules/rule/form-config.html' },
              { key: 'rule-12', label: '核验项开关配置', href: 'modules/rule/verify-switch.html' }
            ]
          },
          {
            label: '版本与变更留痕', icon: 'fa-code-branch',
            children: [
              { key: 'rule-08', label: '规则版本与生效期', href: 'modules/rule/version.html' },
              { key: 'rule-13', label: '规则测试与模拟', href: 'modules/rule/rule-test.html' },
              { key: 'rule-14', label: '规则变更留痕', href: 'modules/rule/rule-log.html' }
            ]
          }
        ]
      },
      {
        key: 'stat', name: '统计分析', icon: 'fa-chart-column', line: '决策支持',
        menu: [
          {
            label: '领导驾驶舱', icon: 'fa-gauge-high',
            children: [
              { key: 'stat-01', label: '保障全景一张图', href: 'modules/stat/map-overview.html' },
              { key: 'stat-02', label: '核心指标看板', href: 'modules/stat/kpi-board.html' },
              { key: 'stat-03', label: '政策成效指标', href: 'modules/stat/policy-effect.html' },
              { key: 'stat-04', label: '实时风险告警', href: 'modules/stat/risk-alert.html' }
            ]
          },
          {
            label: '房源分析', icon: 'fa-building-circle-check',
            children: [
              { key: 'stat-05', label: '筹集完成率分析', href: 'modules/stat/house-plan.html' },
              { key: 'stat-06', label: '房源来源构成', href: 'modules/stat/house-source.html' },
              { key: 'stat-07', label: '房源结构分析', href: 'modules/stat/house-struct.html' },
              { key: 'stat-09', label: '供需匹配分析', href: 'modules/stat/house-supply.html' },
              { key: 'stat-32', label: '预约热度与需求分析', href: 'modules/stat/book-demand.html' }
            ]
          },
          {
            label: '人才与配租分析', icon: 'fa-users-viewfinder',
            children: [
              { key: 'stat-11', label: '人才画像分析', href: 'modules/stat/talent-profile.html' },
              { key: 'stat-12', label: '申请漏斗分析', href: 'modules/stat/funnel.html' },
              { key: 'stat-13', label: '审核效能分析', href: 'modules/stat/audit-perf.html' },
              { key: 'stat-14', label: '数据核验命中分析', href: 'modules/stat/verify-hit.html' },
              { key: 'stat-15', label: '配租与轮候分析', href: 'modules/stat/alloc-queue.html' },
              { key: 'stat-33', label: '申请渠道分析', href: 'modules/stat/channel-stat.html' },
              { key: 'stat-17', label: '放弃配租分析', href: 'modules/stat/giveup.html' },
              { key: 'stat-18', label: '年审与退出分析', href: 'modules/stat/review-exit.html' }
            ]
          },
          {
            label: '报表与数据服务', icon: 'fa-file-excel',
            children: [
              { key: 'stat-23', label: '法定报表自动生成', href: 'modules/stat/report-legal.html' },
              { key: 'stat-24', label: '自定义报表', href: 'modules/stat/report-custom.html' },
              { key: 'stat-25', label: '指标下钻', href: 'modules/stat/drilldown.html' },
              { key: 'stat-26', label: '导出与定时推送', href: 'modules/stat/report-push.html' },
              { key: 'stat-27', label: '业务台账导出', href: 'modules/stat/ledger-export.html' }
            ]
          },
          {
            label: '系统运行与用户', icon: 'fa-heart-pulse',
            children: [
              { key: 'stat-28', label: '用户与登录分析', href: 'modules/stat/user-login.html' },
              { key: 'stat-29', label: '功能使用分析', href: 'modules/stat/func-usage.html' },
              { key: 'stat-30', label: '接口健康分析', href: 'modules/stat/api-health.html' },
              { key: 'stat-31', label: '系统运行监控', href: 'modules/stat/sys-monitor.html' }
            ]
          }
        ]
      },
      {
        key: 'system', name: '权限与系统管理', icon: 'fa-gear', line: '平台支撑',
        menu: [
          {
            label: '用户与权限', icon: 'fa-user-shield',
            children: [
              { key: 'system-01', label: '组织机构管理', href: 'modules/system/sys-org.html' },
              { key: 'system-17', label: '岗位管理', href: 'modules/system/sys-post-manage.html' },
              { key: 'system-02', label: '用户账号管理', href: 'modules/system/sys-user.html' },
              { key: 'system-22', label: '用户角色分配', href: 'modules/system/sys-user-role.html' },
              { key: 'system-25', label: '小程序菜单绑定', href: 'modules/system/sys-mp-menu.html' }
            ]
          },
          {
            label: '角色与权限项', icon: 'fa-user-shield',
            children: [
              { key: 'system-03', label: '角色管理', href: 'modules/system/sys-role.html' },
              { key: 'system-18', label: '菜单与路由管理', href: 'modules/system/sys-menu.html' },
              { key: 'system-19', label: '按钮与操作权限', href: 'modules/system/sys-button.html' },
              { key: 'system-20', label: '权限资源项管理', href: 'modules/system/sys-resource.html' },
              { key: 'system-21', label: '角色权限分配', href: 'modules/system/sys-role-auth.html' },
              { key: 'system-04', label: '数据权限配置', href: 'modules/system/sys-datascope.html' }
            ]
          },
          {
            label: '授权审批与安全', icon: 'fa-shield-halved',
            children: [
              { key: 'system-23', label: '授权审批与临时授权', href: 'modules/system/sys-auth-approve.html' },
              { key: 'system-24', label: '权限留痕与反查', href: 'modules/system/sys-perm-log.html' },
              { key: 'system-06', label: '安全策略配置', href: 'modules/system/sys-security.html' },
              { key: 'system-07', label: '登录日志与在线', href: 'modules/system/sys-loginlog.html' },
              { key: 'system-08', label: '敏感信息保护', href: 'modules/system/sys-sensitive.html' }
            ]
          },
          {
            label: '基础配置与运维', icon: 'fa-screwdriver-wrench',
            children: [
              { key: 'system-09', label: '数据字典管理', href: 'modules/system/dict.html' },
              { key: 'system-10', label: '消息模板管理', href: 'modules/system/msg-tpl.html' },
              { key: 'system-11', label: '系统参数配置', href: 'modules/system/param.html' },
              { key: 'system-12', label: '附件与影像管理', href: 'modules/system/attach.html' },
              { key: 'system-13', label: '操作日志与审计', href: 'modules/system/audit-log.html' },
              { key: 'system-14', label: '电子印章管理', href: 'modules/system/seal.html' },
              { key: 'system-15', label: '数据备份与恢复', href: 'modules/system/backup.html' },
              { key: 'system-16', label: '接口监控与告警', href: 'modules/system/api-monitor.html' }
            ]
          }
        ]
      }
    ],

    /* ---------- 字典：[编码, 名称] ---------- */
    dict: {
      yesNo: [['1', '是'], ['0', '否']],
      district: [
        ['01', '天元区'], ['02', '荷塘区'], ['03', '芦淞区'], ['04', '石峰区'],
        ['05', '经开区'], ['06', '渌口区']
      ],
      applyType: [
        ['1', '创业青年人才'], ['2', '就业青年人才'], ['3', '特殊人才（免毕业年限）']
      ],
      applyStatus: [
        ['1', '待受理'], ['2', '联审中'], ['3', '待复核'], ['4', '待补正'],
        ['5', '审核通过'], ['6', '不予通过'], ['7', '已撤回']
      ],
      talentLevel: [
        ['1', '经营管理人才'], ['2', '专业技术人才'], ['3', '技能人才'], ['4', '普通青年人才']
      ],
      education: [
        ['1', '全日制大专'], ['2', '全日制本科'], ['3', '硕士研究生'], ['4', '博士研究生'],
        ['5', '国（境）外学历']
      ],
      marriage: [['1', '未婚'], ['2', '已婚'], ['3', '离异'], ['4', '丧偶']],
      houseSource: [
        ['1', '收购存量商品房'], ['2', '公租房盘活'], ['3', '保租房“一间房”']
      ],
      /* 房源颗粒度到「间」：一套三室两厅拆为 A、B、C 三间，每间单独计租 */
      roomStruct: [
        ['1', '单间配套'], ['2', '一室一厅'], ['3', '二室一厅'], ['4', '三室一厅'], ['5', '三室两厅']
      ],
      roomFacility: [
        ['1', '独立卫生间'], ['2', '空调'], ['3', '阳台'], ['4', '衣柜'], ['5', '书桌'], ['6', '飘窗']
      ],
      publishStatus: [
        ['1', '待提交'], ['2', '待审核'], ['3', '已发布'], ['4', '已退回'], ['5', '已下架']
      ],
      /* 四类申请渠道，办件列表与办理界面均须显示 */
      applyChannel: [
        ['1', '个人申请'], ['2', '用人单位（移动端申请）'],
        ['3', '运营机构（PC 申请）'], ['4', '政务窗口（PC 申请）']
      ],
      orgType: [['1', '主管单位'], ['2', '运营机构'], ['3', '用人单位']],
      agencyOrg: [
        ['1', '株洲城发高科人才安居服务有限公司'], ['2', '清水塘投资运营服务有限公司'],
        ['3', '株洲高新人才公寓运营有限公司']
      ],
      pendingStatus: [['1', '待补核'], ['2', '已补核通过'], ['3', '补核不通过'], ['4', '已转人工']],
      /* 会议明确的四类房源来源渠道，作为筹集进度考核与统计口径基准 */
      srcChannel: [
        ['1', '市本级存量'], ['2', '收购商品房转化'], ['3', '收购保租房转化'], ['4', '园区公租房纳管']
      ],
      /* 入库方式：与来源渠道分别标注、互不替代 */
      intakeType: [['1', '批量导入'], ['2', '接口对接']],
      reportOrg: [
        ['1', '株洲城发高科集团'], ['2', '清水塘投资集团'], ['3', '株洲高新区管委会'],
        ['4', '株洲经开区管委会'], ['5', '市保障性住房服务中心']
      ],
      bookStatus: [
        ['1', '预约中'], ['2', '已确认'], ['3', '已改约'], ['4', '已取消'],
        ['5', '已转申请'], ['6', '已配租']
      ],
      subsidyStatus: [
        ['1', '待发起'], ['2', '待核验'], ['3', '待核定'], ['4', '待财政复核'],
        ['5', '已拨付'], ['6', '已退回']
      ],
      evalObject: [['1', '物业服务'], ['2', '运营单位服务']],
      evalCycle: [['1', '按月'], ['2', '按季']],
      houseStatus: [
        ['1', '可配租'], ['2', '已锁定'], ['3', '已签约'], ['4', '在租'],
        ['5', '待腾退'], ['6', '维修中'], ['7', '已冻结']
      ],
      roomType: [
        ['1', '单间配套'], ['2', '一室一厅'], ['3', '二室一厅'], ['4', '三室一厅']
      ],
      unitMode: [['1', '整套配租'], ['2', '按间配租'], ['3', '按床位配租']],
      /* 会议决议：不采用摇号方式确定顺序，故只保留顺序配租 */
      allocWay: [['1', '顺序配租']],
      queueStatus: [
        ['1', '正常轮候'], ['2', '意向预定'], ['3', '已配租'], ['4', '已作废'], ['5', '已放弃']
      ],
      contractStatus: [
        ['1', '待签署'], ['2', '已生效'], ['3', '已变更'], ['4', '已解除'], ['5', '已到期']
      ],
      billStatus: [
        ['1', '待缴'], ['2', '部分缴'], ['3', '已缴清'], ['4', '已欠费'], ['5', '已核销']
      ],
      feeItem: [
        ['1', '租金'], ['2', '押金'], ['3', '物业费'], ['4', '水费'], ['5', '电费'], ['6', '燃气费']
      ],
      renewConclusion: [
        ['1', '继续享受人才政策'], ['2', '转按市场租金续租'], ['3', '启动退出清退']
      ],
      verifyResult: [['1', '一致'], ['2', '不一致'], ['3', '数据缺失']],
      rejectReason: [
        ['1', '个税与社保期数不匹配，需补充实际从业证明'],
        ['2', '市城区范围内已有自有住房'],
        ['3', '毕业时间超过 2 年且不属免年限人才'],
        ['4', '缺境外学历学位认证书'],
        ['5', '创业企业无实际纳税记录'],
        ['6', '已承租政策性住房或正享受租赁补贴'],
        ['7', '材料影像不清晰或与填报不一致']
      ],
      verifyItem: [
        ['1', '婚姻登记'], ['2', '不动产登记'], ['3', '学历学位'], ['4', '工商登记'],
        ['5', '个人所得税'], ['6', '企业纳税'], ['7', '养老保险'], ['8', '人口与人脸']
      ],
      woType: [
        ['1', '水暖管道'], ['2', '电路照明'], ['3', '家电维修'], ['4', '门窗锁具'],
        ['5', '墙面地面'], ['6', '其他']
      ],
      woStatus: [
        ['1', '待受理'], ['2', '待派单'], ['3', '处理中'], ['4', '待验收'], ['5', '已办结'], ['6', '已超时']
      ],
      channel: [
        ['1', '湘易办小程序'], ['2', '湘易办 APP'], ['3', '株洲人才公众号'],
        ['4', '政务窗口代办'], ['5', '单位批量申报']
      ],
      quitReason: [
        ['1', '保障期届满'], ['2', '购买住房'], ['3', '离职离株'], ['4', '主动退租'],
        ['5', '违规清退'], ['6', '其他']
      ],
      lvColor: [
        ['blue', '蓝色 · 正常'], ['yellow', '黄色 · 提示'],
        ['orange', '橙色 · 预警'], ['red', '红色 · 严重']
      ]
    },

    /* ---------- 首页数据：按角色一份 ----------
       页面里只需放 <div id="home-root"></div> */
    home: {
      window: {
        welcome: '人才住房窗口兜底代办工作台',
        heroStats: [{ v: '6', l: '待代录' }, { v: '18', l: '今日代办' }, { v: '9', l: '现场咨询' }],
        kpis: [
          { c: 'blue', i: 'fa-person-booth', l: '本月窗口代办', v: '186', t: '渠道标记为政务窗口 PC 申请' },
          { c: 'green', i: 'fa-circle-check', l: '已汇入件池', v: '174', t: '与线上申请同一流程' },
          { c: 'orange', i: 'fa-print', l: '材料清单打印', v: '132', t: '供申请人带回准备' },
          { c: 'cyan', i: 'fa-building', l: '可选房源', v: '412', t: '已审核发布' }
        ],
        todos: [
          { c: 'orange', tag: '窗口代录', txt: 'RC2026-0907-0186 谭×× 就业青年人才申请待代为录入提交', time: '剩 4h', warn: 1, h: 'modules/apply/window-entry.html' },
          { c: 'blue', tag: '现场咨询', txt: '2 名申请人咨询天元区楼盘余量与申请形势，待现场答复', time: '剩 1天', h: 'modules/house/house-query.html' },
          { c: 'blue', tag: '进度查询', txt: 'RC2026-0902-0171 申请人到窗口查询办理进度与补正要求', time: '剩 1天', h: 'modules/apply/window-ledger.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-person-booth', l: '窗口代办录入', h: 'modules/apply/window-entry.html' },
          { c: 'green', i: 'fa-magnifying-glass', l: '房源查询（只读）', h: 'modules/house/house-query.html' },
          { c: 'cyan', i: 'fa-list-ol', l: '楼盘余量查看', h: 'modules/house/book-manage.html' },
          { c: 'orange', i: 'fa-print', l: '材料清单与表单打印', h: 'modules/apply/material-print.html' },
          { c: 'purple', i: 'fa-book-open', l: '政策资讯查看', h: 'modules/rule/policy-view.html' },
          { c: 'red', i: 'fa-clipboard-list', l: '窗口办件台账', h: 'modules/apply/window-ledger.html' }
        ]
      },
      reviewer: {
        welcome: '青年人才住房资格审核工作台',
        heroStats: [{ v: '23', l: '待我复核' }, { v: '41', l: '今日办结' }, { v: '3', l: '超期预警' }],
        kpis: [
          { c: 'blue', i: 'fa-file-circle-check', l: '本月受理', v: '1,286', t: '↑ 较上月 14.2%' },
          { c: 'green', i: 'fa-circle-check', l: '审核通过', v: '1,092', t: '通过率 84.9%' },
          { c: 'orange', i: 'fa-clock', l: '3 日内办结率', v: '96.4%', t: '临期 11 件' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '核验不一致', v: '78', t: '待人工例外处理', td: 'text-danger' }
        ],
        todos: [
          { c: 'red', tag: '超期预警', txt: 'RC2026-0902-0148 王×× 不动产核验不一致，已超 3 个工作日', time: '已超期', warn: 1, h: 'modules/apply/audit-desk.html' },
          { c: 'orange', tag: '人工复核', txt: 'RC2026-0903-0162 邓×× 创业企业纳税申报期数不足待核', time: '剩 5h', warn: 1, h: 'modules/apply/audit-desk.html' },
          { c: 'blue', tag: '联审在办', txt: 'RC2026-0904-0177 学信网接口超时，已转人工核验通道', time: '剩 1天', h: 'modules/apply/manual-fallback.html' },
          { c: 'blue', tag: '年审复核', txt: '2026 年度第 3 批年审名单 168 户待复核住房与社保变化', time: '剩 3天', h: 'modules/rent/annual-list.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-inbox', l: '多渠道件池', h: 'modules/apply/pool-list.html' },
          { c: 'green', i: 'fa-user-check', l: '复核工作台', h: 'modules/apply/audit-desk.html' },
          { c: 'cyan', i: 'fa-shield-halved', l: '核验报告', h: 'modules/apply/verify-report.html' },
          { c: 'orange', i: 'fa-clock', l: '审核时限管理', h: 'modules/apply/timelimit-manage.html' },
          { c: 'red', i: 'fa-user-slash', l: '失信名单', h: 'modules/apply/talent-blacklist.html' },
          { c: 'purple', i: 'fa-box-archive', l: '电子档案', h: 'modules/apply/archive-list.html' }
        ]
      },
      allocator: {
        welcome: '配租批次与线上选房工作台',
        heroStats: [{ v: '2', l: '在办批次' }, { v: '46', l: '待签约' }, { v: '5', l: '锁房超时' }],
        kpis: [
          { c: 'blue', i: 'fa-key', l: '本批次投放', v: '320', t: '天元区 186 套' },
          { c: 'green', i: 'fa-circle-check', l: '已选房锁定', v: '274', t: '认领率 85.6%' },
          { c: 'orange', i: 'fa-hourglass-half', l: '轮候在库', v: '612', t: '平均等待 47 天' },
          { c: 'red', i: 'fa-ban', l: '放弃配租', v: '18', t: '放弃率 5.6%', td: 'text-danger' }
        ],
        todos: [
          { c: 'orange', tag: '锁房超时', txt: '2026 年第 3 批 5 套房源锁定超时待释放给下一顺序人', time: '剩 40min', warn: 1, h: 'modules/alloc/slot-plan.html' },
          { c: 'blue', tag: '批次公示', txt: '2026 年第 3 批配租顺序名单待导出公示', time: '剩 1天', h: 'modules/alloc/order-list.html' },
          { c: 'blue', tag: '预申请转正', txt: '湖南工业大学 34 名应届生已补齐毕业证，待转正式申请', time: '剩 2天', h: 'modules/alloc/queue-list.html' },
          { c: 'red', tag: '资格处置', txt: '3 名人才不服从配租且未办理入住，待写入放弃标记', time: '已超期', warn: 1, h: 'modules/alloc/giveup-list.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-layer-group', l: '配租批次', h: 'modules/alloc/batch-list.html' },
          { c: 'green', i: 'fa-list-ol', l: '顺序名单', h: 'modules/alloc/order-list.html' },
          { c: 'cyan', i: 'fa-clock', l: '选房时段编排', h: 'modules/alloc/slot-plan.html' },
          { c: 'orange', i: 'fa-hourglass-half', l: '意向轮候库', h: 'modules/alloc/queue-list.html' },
          { c: 'purple', i: 'fa-file-contract', l: '合同要素台账', h: 'modules/alloc/contract-list.html' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '配租异常处理', h: 'modules/alloc/exception.html' }
        ]
      },
      keeper: {
        welcome: '租金分账核算与收缴工作台',
        heroStats: [{ v: '14', l: '待核算' }, { v: '3', l: '对账差错' }, { v: '62', l: '欠费户' }],
        kpis: [
          { c: 'blue', i: 'fa-money-bill-wave', l: '本月应收租金', v: '1,286,400.00', t: '含财政补助部分' },
          { c: 'green', i: 'fa-circle-check', l: '实收金额', v: '1,203,180.00', t: '收缴率 93.5%' },
          { c: 'cyan', i: 'fa-hand-holding-dollar', l: '财政补助', v: '842,760.00', t: '占应收 65.5%' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '欠费金额', v: '83,220.00', t: '账龄 90 天以上 12 户', td: 'text-danger' }
        ],
        todos: [
          { c: 'red', tag: '对账差错', txt: '翼支付 09-04 到账流水 3 笔未匹配账单，待人工核销', time: '已超期', warn: 1, h: 'modules/rent/pay-recon.html' },
          { c: 'orange', tag: '账单生成', txt: '2026 年 9 月账单待批量生成，覆盖 1,286 份在租合同', time: '剩 6h', warn: 1, h: 'modules/rent/bill-batch.html' },
          { c: 'blue', tag: '减免核定', txt: '湘江1958 人才公寓二期减免标准审定文件待落库形成计费规则', time: '剩 2天', h: 'modules/rent/relief-plan.html' },
          { c: 'blue', tag: '押金退还', txt: '9 户腾退结算完成，押金退还待复核', time: '剩 3天', h: 'modules/rent/deposit.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-receipt', l: '账单台账', h: 'modules/rent/bill-list.html' },
          { c: 'green', i: 'fa-scale-balanced', l: '分账核算', h: 'modules/rent/split-account.html' },
          { c: 'cyan', i: 'fa-right-left', l: '翼支付对账', h: 'modules/rent/pay-recon.html' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '欠租台账', h: 'modules/rent/arrears.html' },
          { c: 'orange', i: 'fa-file-invoice-dollar', l: '电子票据', h: 'modules/rent/invoice.html' },
          { c: 'purple', i: 'fa-piggy-bank', l: '押金管理', h: 'modules/rent/deposit.html' }
        ]
      },
      housing: {
        welcome: '多源房源归集与房态管理工作台',
        heroStats: [{ v: '8', l: '待验收' }, { v: '4', l: '对账差异' }, { v: '2', l: '重复登记' }],
        kpis: [
          { c: 'blue', i: 'fa-building', l: '房源总量', v: '2,486', t: '年度计划 3,000 套' },
          { c: 'green', i: 'fa-circle-check', l: '可配租', v: '412', t: '拎包入住已验收' },
          { c: 'orange', i: 'fa-house-circle-exclamation', l: '空置超 90 天', v: '36', t: '空置率 1.4%' },
          { c: 'cyan', i: 'fa-arrows-rotate', l: '外部同步套数', v: '1,342', t: '保租房 986 / 公租房 356' }
        ],
        todos: [
          { c: 'red', tag: '重复登记', txt: '湘江1958 A6-1502 在保租房系统与本系统重复登记，已锁定待核', time: '已超期', warn: 1, h: 'modules/house/src-dup.html' },
          { c: 'orange', tag: '验收待办', txt: '天元区栗雨佳苑 8 套家电家具未配齐，未达拎包入住标准', time: '剩 1天', warn: 1, h: 'modules/house/acceptance-list.html' },
          { c: 'blue', tag: '同步对账', txt: '公租房系统 09-04 同步产生 4 条房态差异，待人工核实', time: '剩 2天', h: 'modules/house/src-sync.html' },
          { c: 'blue', tag: '用途转换', txt: '荷塘区茨菇塘公租房 46 套转人才公寓审批待提交', time: '剩 4天', h: 'modules/house/house-convert.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-table-cells', l: '统一楼盘表', h: 'modules/house/building-table.html' },
          { c: 'green', i: 'fa-house-chimney', l: '房态图管理', h: 'modules/house/house-status-map.html' },
          { c: 'cyan', i: 'fa-arrows-rotate', l: '房源同步对账', h: 'modules/house/src-sync.html' },
          { c: 'orange', i: 'fa-clipboard-check', l: '拎包入住验收', h: 'modules/house/acceptance-list.html' },
          { c: 'purple', i: 'fa-chart-line', l: '房源供需测算', h: 'modules/house/house-forecast.html' },
          { c: 'red', i: 'fa-lock', l: '冻结与停租', h: 'modules/house/house-freeze.html' }
        ]
      },
      manager: {
        welcome: '政策规则配置与生效期管理工作台',
        heroStats: [{ v: '3', l: '待生效' }, { v: '2', l: '待配置' }, { v: '14', l: '在用规则' }],
        kpis: [
          { c: 'blue', i: 'fa-scale-balanced', l: '在用规则', v: '14', t: '申请条件 6 · 减免 5 · 其他 3' },
          { c: 'green', i: 'fa-code-branch', l: '规则版本', v: '26', t: '按受理时点适用版本' },
          { c: 'orange', i: 'fa-clock', l: '待生效', v: '3', t: '2026-10-01 起施行' },
          { c: 'cyan', i: 'fa-toggle-on', l: '启用中核验项', v: '8', t: '接口未通可切人工' }
        ],
        todos: [
          { c: 'orange', tag: '规则配置', txt: '创业人才「正常纳税」判定口径待按市税务局意见更新', time: '剩 2天', warn: 1, h: 'modules/rule/cond-rule.html' },
          { c: 'blue', tag: '标准维护', txt: '收购保租房转化批次租金减免档次待补充配置', time: '剩 4天', h: 'modules/rule/relief-rule.html' },
          { c: 'blue', tag: '版本生效', txt: '2026 年第 4 版申请条件规则待设定生效日期并留档', time: '剩 6天', h: 'modules/rule/version.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-scale-balanced', l: '申请条件规则配置', h: 'modules/rule/cond-rule.html' },
          { c: 'green', i: 'fa-money-bill-transfer', l: '租金减免标准配置', h: 'modules/rule/relief-rule.html' },
          { c: 'cyan', i: 'fa-diagram-project', l: '流程编排配置', h: 'modules/rule/flow-design.html' },
          { c: 'orange', i: 'fa-list-check', l: '表单与材料清单', h: 'modules/rule/form-config.html' },
          { c: 'purple', i: 'fa-code-branch', l: '规则版本与生效期', h: 'modules/rule/version.html' },
          { c: 'red', i: 'fa-toggle-on', l: '核验项开关配置', h: 'modules/rule/verify-switch.html' }
        ]
      },
      leader: {
        welcome: '人才住房保障决策分析驾驶舱',
        heroStats: [{ v: '2,486', l: '房源总量' }, { v: '1,286', l: '在租人才' }, { v: '7', l: '风险预警' }],
        kpis: [
          { c: 'blue', i: 'fa-building', l: '筹集完成率', v: '82.9%', t: '年度计划 3,000 套' },
          { c: 'green', i: 'fa-users', l: '累计保障人次', v: '1,842', t: '↑ 较上年 46.2%' },
          { c: 'cyan', i: 'fa-clock', l: '平均配租周期', v: '18.6 天', t: '↓ 缩短 4.2 天' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '风险指标', v: '7', t: '空置超期 / 欠费 / 超审', td: 'text-danger' }
        ],
        todos: [
          { c: 'red', tag: '风险告警', txt: '空置超 90 天房源 36 套，集中在石峰区清水塘片区', time: '待关注', warn: 1, h: 'modules/stat/risk-alert.html' },
          { c: 'orange', tag: '成效汇报', txt: '2026 年前三季度人才安居政策成效汇报材料待调阅', time: '剩 2天', h: 'modules/stat/policy-effect.html' },
          { c: 'blue', tag: '流程堵点', txt: '税务企业纳税核验平均耗时 2.4 天，为联审最长环节', time: '待关注', h: 'modules/stat/verify-hit.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-gauge-high', l: '核心指标看板', h: 'modules/stat/kpi-board.html' },
          { c: 'green', i: 'fa-map-location-dot', l: '保障全景一张图', h: 'modules/stat/map-overview.html' },
          { c: 'cyan', i: 'fa-chart-pie', l: '政策成效指标', h: 'modules/stat/policy-effect.html' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '实时风险告警', h: 'modules/stat/risk-alert.html' },
          { c: 'orange', i: 'fa-filter', l: '申请漏斗分析', h: 'modules/stat/funnel.html' },
          { c: 'purple', i: 'fa-file-excel', l: '法定报表', h: 'modules/stat/report-legal.html' }
        ]
      },
      auditor: {
        welcome: '资格复审与结论出具工作台',
        heroStats: [{ v: '9', l: '待复审' }, { v: '28', l: '今日办结' }, { v: '2', l: '临期' }],
        kpis: [
          { c: 'blue', i: 'fa-user-check', l: '本月复审', v: '1,092', t: '两级办理第二级' },
          { c: 'green', i: 'fa-circle-check', l: '审核通过', v: '946', t: '通过率 86.6%' },
          { c: 'orange', i: 'fa-rotate-left', l: '退回受理', v: '38', t: '注明退回层级与理由' },
          { c: 'red', i: 'fa-clock', l: '超期件', v: '2', t: '3 个工作日时限', td: 'text-danger' }
        ],
        todos: [
          { c: 'red', tag: '复审临期', txt: 'RC2026-0906-0212 王×× 复审剩余 4 小时，请及时出具结论', time: '剩 4h', warn: 1, h: 'modules/apply/conclusion.html' },
          { c: 'orange', tag: '待复审', txt: 'RC2026-0906-0208 谭×× 受理初审已通过，待复审出具结论', time: '剩 1天', h: 'modules/apply/conclusion.html' },
          { c: 'blue', tag: '年审复核', txt: '2026 年度第 3 批年审名单 168 户待出具年审结论', time: '剩 3天', h: 'modules/rent/annual-result.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-user-check', l: '复审办理', h: 'modules/apply/conclusion.html' },
          { c: 'green', i: 'fa-layer-group', l: '两级办理台账', h: 'modules/apply/two-level-audit.html' },
          { c: 'cyan', i: 'fa-print', l: '资格审核表', h: 'modules/apply/review-form.html' },
          { c: 'orange', i: 'fa-hourglass-half', l: '容缺受理台账', h: 'modules/apply/pending-check.html' },
          { c: 'purple', i: 'fa-box-archive', l: '全过程电子档案', h: 'modules/apply/archive-list.html' },
          { c: 'red', i: 'fa-rotate', l: '年度资格审查', h: 'modules/rent/annual-batch.html' }
        ]
      },
      orgadmin: {
        welcome: '运营机构与用人单位管理工作台',
        heroStats: [{ v: '6', l: '单位待审' }, { v: '3', l: '待考核' }, { v: '12', l: '待督办' }],
        kpis: [
          { c: 'blue', i: 'fa-building', l: '在册运营机构', v: '3', t: '受托楼盘 6 个' },
          { c: 'green', i: 'fa-users-line', l: '已认证用人单位', v: '186', t: '本月新增 24 家' },
          { c: 'orange', i: 'fa-file-circle-question', l: '注册待审核', v: '6', t: '超 2 日 1 家' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '超时工单', v: '12', t: '待向机构督办', td: 'text-danger' }
        ],
        todos: [
          { c: 'orange', tag: '单位审核', txt: '株洲时代新材料科技股份有限公司注册申请待审核开通', time: '剩 1天', warn: 1, h: 'modules/agency/employer-audit.html' },
          { c: 'blue', tag: '考核评分', txt: '2026 年第三季度运营机构考核评分待审定与通报', time: '剩 5天', h: 'modules/ops/kpi-score.html' },
          { c: 'red', tag: '工单督办', txt: '清水塘社区服务有限公司 12 件报修工单超时未办结', time: '已超期', warn: 1, h: 'modules/ops/wo-stat.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-building-shield', l: '用人单位审核', h: 'modules/agency/employer-audit.html' },
          { c: 'green', i: 'fa-users-line', l: '用人单位管理', h: 'modules/agency/employer-manage.html' },
          { c: 'cyan', i: 'fa-city', l: '运营机构档案', h: 'modules/ops/org-list.html' },
          { c: 'orange', i: 'fa-ranking-star', l: '考核评分', h: 'modules/ops/kpi-score.html' },
          { c: 'purple', i: 'fa-star-half-stroke', l: '评价结果统计', h: 'modules/ops/eval-stat.html' },
          { c: 'red', i: 'fa-screwdriver-wrench', l: '工单统计与督办', h: 'modules/ops/wo-stat.html' }
        ]
      },
      employer: {
        welcome: '用人单位职工代申报工作台',
        heroStats: [{ v: '18', l: '待确认' }, { v: '46', l: '在办' }, { v: '2', l: '待上报' }],
        kpis: [
          { c: 'blue', i: 'fa-user-group', l: '本单位在职职工', v: '2,486', t: '符合条件 386 人' },
          { c: 'green', i: 'fa-paper-plane', l: '累计代申报', v: '164', t: '本月 46 人' },
          { c: 'orange', i: 'fa-hourglass-half', l: '待职工确认', v: '18', t: '3 个自然日内未确认自动作废' },
          { c: 'cyan', i: 'fa-house-circle-check', l: '已获保障', v: '86', t: '在租 82 人' }
        ],
        todos: [
          { c: 'orange', tag: '待确认', txt: '2026 年 9 月批次 18 名职工尚未在移动端确认授权', time: '剩 2天', warn: 1, h: 'modules/employer/apply-progress.html' },
          { c: 'blue', tag: '批量申报', txt: '第四季度新入职 46 人资料已收齐，待按模板导入提交', time: '剩 5天', h: 'modules/employer/batch-apply.html' },
          { c: 'red', tag: '状态变更', txt: '2 名职工已离职，须上报变更以触发承租资格复核', time: '已超期', warn: 1, h: 'modules/employer/staff-change.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-file-import', l: '员工批量代申报', h: 'modules/employer/batch-apply.html' },
          { c: 'green', i: 'fa-chart-line', l: '申报进度与数据', h: 'modules/employer/apply-progress.html' },
          { c: 'orange', i: 'fa-user-pen', l: '在职状态变更上报', h: 'modules/employer/staff-change.html' },
          { c: 'cyan', i: 'fa-building-user', l: '单位注册与认证', h: 'modules/employer/org-register.html' },
          { c: 'purple', i: 'fa-list-check', l: '待办任务中心', h: 'modules/workbench/todo-center.html' },
          { c: 'red', i: 'fa-bullhorn', l: '通知公告', h: 'modules/workbench/notice.html' }
        ]
      },
      publisher: {
        welcome: '政策公开与配租公告发布工作台',
        heroStats: [{ v: '2', l: '待发布' }, { v: '26', l: '在发内容' }, { v: '1', l: '待公示' }],
        kpis: [
          { c: 'blue', i: 'fa-file-lines', l: '在发政策内容', v: '26', t: '购房 8 · 租房 12 · 指南 6' },
          { c: 'green', i: 'fa-bullhorn', l: '本年配租公告', v: '4', t: '第 3 批进行中' },
          { c: 'orange', i: 'fa-clock', l: '待发布', v: '2', t: '待复核后发布' },
          { c: 'cyan', i: 'fa-book', l: '公开台账', v: '186', t: '全程留痕可追溯' }
        ],
        todos: [
          { c: 'orange', tag: '公告发布', txt: '2026 年第 4 批配租公告待发布，需明确房源范围与报名时间', time: '剩 1天', warn: 1, h: 'modules/rule/batch-notice.html' },
          { c: 'blue', tag: '内容更新', txt: '创业青年人才申请常见问题解答待复核后发布', time: '剩 3天', h: 'modules/rule/content-manage.html' },
          { c: 'blue', tag: '结果公开', txt: '2026 年第 3 批配租结果名单待公开公示', time: '剩 4天', h: 'modules/rule/result-open.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-file-pen', l: '政策宣传内容管理', h: 'modules/rule/content-manage.html' },
          { c: 'green', i: 'fa-bullhorn', l: '配租批次公告发布', h: 'modules/rule/batch-notice.html' },
          { c: 'cyan', i: 'fa-list-ol', l: '配租结果公开', h: 'modules/rule/result-open.html' },
          { c: 'orange', i: 'fa-book', l: '信息公开台账', h: 'modules/rule/open-ledger.html' },
          { c: 'purple', i: 'fa-eye', l: '政策资讯查看', h: 'modules/rule/policy-view.html' },
          { c: 'red', i: 'fa-bell', l: '通知公告', h: 'modules/workbench/notice.html' }
        ]
      },
      admin: {
        welcome: '平台权限与运行保障工作台',
        heroStats: [{ v: '4', l: '待建账号' }, { v: '2', l: '接口告警' }, { v: '1', l: '待授权导出' }],
        kpis: [
          { c: 'blue', i: 'fa-users', l: '在册账号', v: '246', t: '在线 38 人' },
          { c: 'green', i: 'fa-plug-circle-check', l: '接口可用率', v: '99.2%', t: '19 个外部接口' },
          { c: 'orange', i: 'fa-clock-rotate-left', l: '本月操作日志', v: '186,420', t: '不可篡改长期留存' },
          { c: 'red', i: 'fa-triangle-exclamation', l: '接口告警', v: '2', t: '学信网 / 税务企业纳税', td: 'text-danger' }
        ],
        todos: [
          { c: 'red', tag: '接口告警', txt: '学信网学历核验接口失败率 12.4%，已切人工核验通道', time: '已超期', warn: 1, h: 'modules/system/api-monitor.html' },
          { c: 'orange', tag: '账号办理', txt: '渌口区住保中心 4 个新增账号待创建并绑定岗位', time: '剩 1天', warn: 1, h: 'modules/system/sys-user.html' },
          { c: 'blue', tag: '授权导出', txt: '资格审核科申请导出含身份证号台账，待授权与留痕', time: '剩 2天', h: 'modules/system/sys-sensitive.html' },
          { c: 'blue', tag: '备份演练', txt: '第三季度数据备份恢复演练待安排', time: '剩 6天', h: 'modules/system/backup.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-user-gear', l: '用户账号管理', h: 'modules/system/sys-user.html' },
          { c: 'green', i: 'fa-user-shield', l: '角色与菜单权限', h: 'modules/system/sys-role.html' },
          { c: 'cyan', i: 'fa-plug', l: '接口监控与告警', h: 'modules/system/api-monitor.html' },
          { c: 'orange', i: 'fa-clock-rotate-left', l: '操作日志与审计', h: 'modules/system/audit-log.html' },
          { c: 'purple', i: 'fa-book', l: '数据字典管理', h: 'modules/system/dict.html' },
          { c: 'red', i: 'fa-database', l: '数据备份与恢复', h: 'modules/system/backup.html' }
        ]
      },
      agency: {
        welcome: '运营机构申请初审与补助申报工作台',
        heroStats: [{ v: '18', l: '待初审' }, { v: '1', l: '待申报' }, { v: '3', l: '评价待改进' }],
        kpis: [
          { c: 'blue', i: 'fa-clipboard-check', l: '本月待初审', v: '18', t: '分派至本机构' },
          { c: 'green', i: 'fa-circle-check', l: '已提交复审', v: '164', t: '初审通过率 92.1%' },
          { c: 'orange', i: 'fa-building', l: '在管房源', v: '1,286', t: '在租 1,192 套' },
          { c: 'cyan', i: 'fa-hand-holding-dollar', l: '上期已拨补助', v: '842,760.00', t: '2026 年 8 月' }
        ],
        todos: [
          { c: 'orange', tag: '申请初审', txt: 'RC2026-0904-0186 谭×× 材料完整性与在租状态待初审', time: '剩 4h', warn: 1, h: 'modules/agency/publish-submit.html' },
          { c: 'blue', tag: '补助申报', txt: '2026 年 9 月租房补助待就 1,192 套在租房源批量发起申请', time: '剩 3天', h: 'modules/agency/subsidy-apply.html' },
          { c: 'red', tag: '评价改进', txt: '湘江1958 报修及时率评分 78.2 分，低于约定标准将扣减补助', time: '剩 5天', warn: 1, h: 'modules/ops/eval-stat.html' }
        ],
        shortcuts: [
          { c: 'blue', i: 'fa-clipboard-check', l: '申请初审办理', h: 'modules/agency/publish-submit.html' },
          { c: 'green', i: 'fa-hand-holding-dollar', l: '补助申请发起', h: 'modules/agency/subsidy-apply.html' },
          { c: 'cyan', i: 'fa-screwdriver-wrench', l: '报修工单流转', h: 'modules/ops/wo-list.html' },
          { c: 'orange', i: 'fa-star-half-stroke', l: '服务评价结果', h: 'modules/ops/eval-stat.html' },
          { c: 'purple', i: 'fa-list-check', l: '待办任务中心', h: 'modules/workbench/todo-center.html' },
          { c: 'red', i: 'fa-bullhorn', l: '通知公告', h: 'modules/workbench/notice.html' }
        ]
      }
    }
  };

  window.APP_CONFIG = APP_CONFIG;

  /* ==========================================================================
     二、运行时 —— 以下无需修改
     ========================================================================== */
  var DICT = APP_CONFIG.dict || {};
  var ROLE_META = APP_CONFIG.roles || {};
  var ROLE_MENU = APP_CONFIG.roleMenu || {};
  var HOME = APP_CONFIG.home || {};
  var SYS_NAME = APP_CONFIG.sysName || '';
  var EXT_ROLES = APP_CONFIG.extRoles || [];
  var SYSTEMS = APP_CONFIG.systems || [];
  var SYS_INDEX = {};
  SYSTEMS.forEach(function (s) { SYS_INDEX[s.key] = s; });
  var CUR_ROLE = APP_CONFIG.defaultRole;
  var CUR_SYS = '';

  /* 静态原型没有构建工具：从 app.js 自身的 src 反推资源前缀与项目根前缀，
     于是同一份菜单配置在任意目录深度的页面里都能正确解析。 */
  var ASSET_BASE = (function () {
    var s = document.querySelector('script[src*="assets/js/app.js"]');
    var src = s ? s.getAttribute('src') : 'assets/js/app.js';
    return src.replace(/assets\/js\/app\.js.*$/, 'assets/');
  })();
  var ROOT_BASE = ASSET_BASE.replace(/assets\/$/, '');

  /* ------- 角色解析：URL ?role= 优先，其次会话记忆，最后页面声明 ------- */
  function resolveRole(declaredRole) {
    var param = null;
    try { param = new URLSearchParams(location.search).get('role'); } catch (e) {}
    var stored = null;
    try { stored = sessionStorage.getItem('app-role'); } catch (e) {}
    var role = param || stored || declaredRole || APP_CONFIG.defaultRole;
    if (!ROLE_META[role]) role = APP_CONFIG.defaultRole;
    try { sessionStorage.setItem('app-role', role); } catch (e) {}
    CUR_ROLE = role;
    CUR_SYS = resolveSystem(role);
    return role;
  }

  /* 菜单 href 从项目根起算 → 补前缀 + 追加角色参数 */
  function withRole(href, role) {
    if (!href) return '';
    var h = /^(https?:|\/|\.\.\/|javascript:|#)/.test(href) ? href : ROOT_BASE + href;
    if (!role || /^(javascript:|#)/.test(h)) return h;
    return h + (h.indexOf('?') >= 0 ? '&role=' : '?role=') + role;
  }

  /* 把绝对路径换算成相对外壳目录的路径，支撑业务页面分目录存放 */
  function relFrom(baseDir, path) {
    var a = baseDir.split('/').filter(Boolean), b = path.split('/').filter(Boolean), i = 0;
    while (i < a.length && i < b.length - 1 && a[i] === b[i]) i++;
    return new Array(a.length - i + 1).join('../') + b.slice(i).join('/');
  }

  /* 按菜单 key 高亮 —— 业务页共用占位页时唯一可靠的高亮依据 */
  function highlightMenuByKey(sidebar, key) {
    sidebar.querySelectorAll('.menu-single.active, .menu-sub a.active').forEach(function (a) { a.classList.remove('active'); });
    sidebar.querySelectorAll('.menu-item.open').forEach(function (g) { g.classList.remove('open'); });
    var hit = sidebar.querySelector('[data-key="' + key + '"]');
    if (!hit) return false;
    hit.classList.add('active');
    var g = hit.closest('.menu-item');
    if (g) g.classList.add('open');
    return true;
  }

  function sysModulesFor(sys, role) {
    var allow = ROLE_MENU[role];
    return ((sys && sys.menu) || []).filter(function (m) {
      /* 有 children 的分组没有 key，只要组内有可见叶子就保留 */
      if (m.children) {
        return m.children.some(function (c) { return !allow || !c.key || allow.indexOf(c.key) >= 0; });
      }
      return !allow || !m.key || allow.indexOf(m.key) >= 0;
    });
  }
  function systemsFor(role) {
    return SYSTEMS.filter(function (s) { return sysModulesFor(s, role).length > 0; });
  }
  function sysOfKey(key) {
    var code = String(key || '').replace(/-\d+$/, '');
    return SYS_INDEX[code] ? code : '';
  }
  function keyInUrl(u) { var m = /[?&]k=([^&#]*)/.exec(u || ''); return m ? decodeURIComponent(m[1]) : ''; }

  /* 当前子系统：URL 的 sys 参数 → 当前业务页所属板块 → 会话记忆 → 配置默认值 → 第一个可进入的 */
  function resolveSystem(role) {
    var list = systemsFor(role);
    if (!list.length) return '';
    var has = function (c) { return c && list.some(function (s) { return s.key === c; }) ? c : ''; };
    var qs = null;
    try { qs = new URLSearchParams(location.search); } catch (e) {}
    var cur = has(qs && qs.get('sys'));
    if (!cur) cur = has(sysOfKey(keyInUrl(location.search)));
    if (!cur) cur = has(sysOfKey(keyInUrl(qs && qs.get('page'))));
    if (!cur && document.body) cur = has(sysOfKey(document.body.getAttribute('data-active')));
    if (!cur) { try { cur = has(sessionStorage.getItem('app-sys')); } catch (e) {} }
    if (!cur) cur = has(APP_CONFIG.defaultSystem) || list[0].key;
    try { sessionStorage.setItem('app-sys', cur); } catch (e) {}
    return cur;
  }

  /* 侧栏菜单 = 常驻菜单 + 当前子系统的菜单。子系统名只出现在顶栏胶囊上 */
  function menuOf(sysKey) {
    var base = (APP_CONFIG.menu || []).slice();
    var s = SYS_INDEX[sysKey];
    return s ? base.concat(s.menu) : base;
  }
  function firstModuleOf(sysKey) {
    var ms = sysModulesFor(SYS_INDEX[sysKey], CUR_ROLE);
    if (!ms.length) return null;
    var m = ms[0];
    return m.children ? (m.children[0] || null) : m;
  }

  /* 切换子系统：改会话记忆、换顶栏胶囊文案、重渲染侧栏菜单 */
  function applySystem(code, sidebar) {
    var s = SYS_INDEX[code];
    if (!s) return;
    CUR_SYS = code;
    try { sessionStorage.setItem('app-sys', code); } catch (e) {}
    var cur = document.querySelector('.app-topbar .sys-capsule .sys-cur');
    if (cur) cur.innerHTML = '<span>' + s.name + '</span>';
    if (!sidebar) return;
    var list = sidebar.querySelector('.menu-list');
    if (list) list.innerHTML = buildMenu('', '', CUR_ROLE);
    var box = sidebar.querySelector('.menu-search-input');
    if (box) box.value = '';
    var sbox = sidebar.querySelector('.menu-search');
    if (sbox) sbox.classList.remove('has-value');
  }

  /* 顶栏当前子系统胶囊。只有一个子系统时不显示（无处可切） */
  function sysCapsuleHTML() {
    if (systemsFor(CUR_ROLE).length < 2) return '';
    var s = SYS_INDEX[CUR_SYS];
    return '<div class="sys-capsule">' +
        '<div class="sys-cur" title="当前业务子系统"><span>' + esc(s ? s.name : SYS_NAME) + '</span></div>' +
        '<button type="button" class="sys-switch-btn" title="切换系统">' +
          '<i class="fa-solid fa-repeat"></i>切换系统</button>' +
      '</div>';
  }

  /* 切换系统弹层：四列卡片网格，卡片宽度按最长子系统名实测 */
  var SYS_GRID_COLS = 4, SYS_GRID_GAP = 14, SYS_CARD_EXTRA = 70, SYS_PANEL_PADDING_X = 64;

  function measureSysCardWidth(list) {
    if (!list.length) return 0;
    var ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return 0;
    ctx.font = '600 14px "Microsoft YaHei", "PingFang SC", sans-serif';
    var max = 0;
    list.forEach(function (s) { max = Math.max(max, ctx.measureText(s.name).width); });
    return Math.ceil(max) + 8 + SYS_CARD_EXTRA;
  }

  /* 量出来的四列宽度放得下就用定宽列，放不下退回等分列，靠 CSS 的省略号收尾 */
  function sizeSysPanel(mask) {
    var panel = mask.querySelector('.sys-panel');
    var grid = mask.querySelector('.sys-grid');
    if (!panel || !grid) return;
    var w = measureSysCardWidth(systemsFor(CUR_ROLE));
    if (!w) return;
    var want = w * SYS_GRID_COLS + SYS_GRID_GAP * (SYS_GRID_COLS - 1) + SYS_PANEL_PADDING_X;
    var avail = window.innerWidth - 48;
    if (want <= avail) {
      grid.style.gridTemplateColumns = 'repeat(' + SYS_GRID_COLS + ', ' + w + 'px)';
      panel.style.width = want + 'px';
    } else {
      grid.style.gridTemplateColumns = '';
      panel.style.width = avail + 'px';
    }
  }

  function sysPanelHTML() {
    var cards = systemsFor(CUR_ROLE).map(function (s) {
      return '<button type="button" class="sys-card' + (s.key === CUR_SYS ? ' current' : '') +
        '" data-sys="' + s.key + '" title="' + esc(s.name) + '">' +
        '<span class="sys-card-row"><span class="sc-name">' + esc(s.name) + '</span>' +
        '<span class="sc-go" aria-hidden="true"></span></span>' +
        '<span class="sc-jb" aria-hidden="true"></span>' +
      '</button>';
    }).join('');
    var body = cards ? '<div class="sys-grid">' + cards + '</div>'
      : '<div class="sys-empty">当前登录身份没有可进入的业务子系统</div>';
    return '<div class="sys-panel">' +
        '<div class="sys-panel-head">' +
          '<div class="sys-panel-title"><h3>切换系统</h3>' +
            '<span class="sys-panel-tag">SWITCH THE SYSTEM</span></div>' +
          '<button type="button" class="sys-panel-close" title="关闭"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<div class="sys-panel-body">' + body + '</div>' +
      '</div>';
  }

  function initSysSwitch(topbar, onPick) {
    var btn = topbar.querySelector('.sys-switch-btn');
    if (!btn) return;
    var mask = null;
    function close() { if (mask) mask.classList.remove('open'); btn.classList.remove('open'); }
    function open() {
      if (!mask) {
        mask = document.createElement('div');
        mask.className = 'sys-mask';
        document.body.appendChild(mask);
        mask.addEventListener('click', function (e) {
          if (e.target === mask || e.target.closest('.sys-panel-close')) { close(); return; }
          var card = e.target.closest('.sys-card');
          if (card) { close(); onPick(card.getAttribute('data-sys')); }
        });
        window.addEventListener('resize', function () {
          if (mask.classList.contains('open')) sizeSysPanel(mask);
        });
      }
      mask.innerHTML = sysPanelHTML();
      mask.classList.add('open');
      btn.classList.add('open');
      sizeSysPanel(mask);
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mask && mask.classList.contains('open')) close(); else open();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ------- 侧边栏菜单 HTML（按角色过滤、按当前页高亮、链接带 role） ------- */
  function buildMenu(active, file, role) {
    var allow = ROLE_MENU[role];
    var ok = function (key) { return !allow || !key || allow.indexOf(key) >= 0; };
    var isOn = function (it) { return (it.key && it.key === active) || (it.href && it.href === file); };
    var html = '';
    menuOf(CUR_SYS).forEach(function (it) {
      if (it.children) {
        var kids = it.children.filter(function (c) { return ok(c.key); });
        if (!kids.length) return;
        var isOpen = kids.some(isOn);
        html += '<div class="menu-item' + (isOpen ? ' open' : '') + '">';
        html += '<div class="menu-link"><i class="m-icon fa-solid ' + (it.icon || 'fa-folder') + '"></i><span>' + esc(it.label) + '</span><i class="m-arrow fa-solid fa-chevron-right"></i></div>';
        html += '<div class="menu-sub">';
        kids.forEach(function (c) {
          html += '<a href="' + withRole(c.href, role) + '" data-key="' + (c.key || '') + '" class="' + (isOn(c) ? 'active' : '') + '">' + esc(c.label) + '</a>';
        });
        html += '</div></div>';
      } else {
        if (!ok(it.key)) return;
        html += '<a href="' + withRole(it.href, role) + '" data-key="' + (it.key || '') + '" class="menu-single' + (isOn(it) ? ' active' : '') + '"><i class="m-icon fa-solid ' + (it.icon || 'fa-file') + '"></i><span>' + esc(it.label) + '</span></a>';
      }
    });
    return html;
  }

  /* ==========================================================================
     顶栏角色切换器
     选定角色即按该角色重建菜单树、首页与数据范围。
     不提供「全部角色」与「超级角色」选项。
     ========================================================================== */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function roleIcon(k) {
    return {
      window: 'fa-building-columns', district: 'fa-building-columns',
      reviewer: 'fa-user-check', manager: 'fa-city', city: 'fa-city',
      leader: 'fa-user-tie', admin: 'fa-gear', ops: 'fa-screwdriver-wrench',
      dev: 'fa-building-flag', agency: 'fa-handshake', bank: 'fa-building-columns',
      builder: 'fa-helmet-safety', public: 'fa-users', citizen: 'fa-users'
    }[k] || 'fa-user';
  }

  /* 角色名称取 ROLE_META[k].role 的「单位 · 岗位」里的岗位段，单位段单独展示 */
  function roleParts(k) {
    var m = ROLE_META[k] || {};
    var s = String(m.role || k);
    var i = s.lastIndexOf(' · ');
    return i > 0
      ? { name: s.slice(i + 3), org: s.slice(0, i) }
      : { name: s, org: m.tag || '' };
  }

  function roleSwitchHTML(curRole) {
    var keys = Object.keys(ROLE_META);
    if (keys.length < 2 && !EXT_ROLES.length) return '';

    var cur = roleParts(curRole);
    var h = '<div class="rs-wrap">'
      + '<button class="rs-btn" id="rsBtn" type="button" title="切换角色（仅用于原型演示与权限核对）">'
      + '<i class="rb-ic fa-solid ' + roleIcon(curRole) + '"></i>'
      + '<span class="rb-n">' + esc(cur.name) + '</span>'
      + '<i class="rb-a fa-solid fa-angle-down"></i></button>'
      + '<div class="rs-pop" id="rsPop">'
      + '<div class="rp-h">选定角色即按该角色重建菜单树、首页与数据范围。'
      + '本切换器仅用于原型演示与权限核对，正式环境按统一身份认证与权限授权平台的授权结果加载。</div>';

    h += '<div class="rp-g">内部办理角色 · 留在本端</div>';
    keys.forEach(function (k) {
      var p = roleParts(k), m = ROLE_META[k];
      var on = k === curRole;
      h += '<div class="rp-i' + (on ? ' on' : '') + '" data-role-pick="' + k + '">'
        + '<i class="fa-solid ' + roleIcon(k) + '"></i>'
        + '<div class="rp-b"><div class="rp-n">' + esc(p.name) + '</div>'
        + '<div class="rp-u">' + esc(m.user || '') + '</div>'
        + '<div class="rp-o">' + esc(p.org) + '</div></div>'
        + (on ? '<span class="rp-tag">当前</span>' : '') + '</div>';
    });

    if (EXT_ROLES.length) {
      h += '<div class="rp-g">外部角色 · 跳转其他应用</div>';
      EXT_ROLES.forEach(function (r) {
        h += '<div class="rp-i" data-role-out="' + esc(r.href) + '">'
          + '<i class="fa-solid ' + (r.icon || roleIcon(r.key)) + '"></i>'
          + '<div class="rp-b"><div class="rp-n">' + esc(r.name) + '</div>'
          + '<div class="rp-u">' + esc(r.user || '') + '</div>'
          + '<div class="rp-o">' + esc(r.org || '') + '</div></div>'
          + '<span class="rp-tag out">跳转</span></div>';
      });
    }

    h += '<div class="rp-f">不提供「全部角色」与「超级角色」选项，任何角色都不得看见全量菜单树。'
      + '切换后上一角色的查询条件与暂存草稿一并清空，不跨角色带出数据。</div>'
      + '</div></div>';
    return h;
  }

  function initRoleSwitch(topbar) {
    var btn = topbar.querySelector('#rsBtn');
    var pop = topbar.querySelector('#rsPop');
    if (!btn || !pop) return;

    function close() { pop.classList.remove('open'); btn.classList.remove('on'); }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.classList.toggle('open');
      btn.classList.toggle('on', open);
    });
    document.addEventListener('click', function (e) {
      if (!pop.contains(e.target) && e.target !== btn) close();
    });

    /* 切换角色前清空上一角色的查询条件、暂存草稿与已选行 */
    function clearRoleScoped() {
      try {
        Object.keys(sessionStorage).forEach(function (k) {
          if (k !== 'app-role' && /^(app-|pms-)/.test(k)) sessionStorage.removeItem(k);
        });
      } catch (e) {}
    }

    pop.querySelectorAll('[data-role-pick]').forEach(function (el) {
      el.addEventListener('click', function () {
        var k = el.getAttribute('data-role-pick');
        if (k === CUR_ROLE) { close(); return; }
        clearRoleScoped();
        try { sessionStorage.setItem('app-role', k); } catch (e) {}
        /* 角色写入 URL，刷新、前进后退与复制链接都还原为当前角色 */
        var u = new URL(window.location.href);
        u.searchParams.set('role', k);
        window.location.href = u.toString();
      });
    });

    pop.querySelectorAll('[data-role-out]').forEach(function (el) {
      el.addEventListener('click', function () {
        clearRoleScoped();
        window.location.href = ROOT_BASE + el.getAttribute('data-role-out');
      });
    });
  }

  function topbarHTML(meta) {
    var logoInner = APP_CONFIG.logo
      ? '<img src="' + ROOT_BASE + APP_CONFIG.logo + '" alt="' + esc(SYS_NAME) + '">'
      : '<i class="fa-solid ' + (APP_CONFIG.logoIcon || 'fa-building-columns') + '"></i>';
    return '<div class="brand">' +
        '<i class="sidebar-toggle fa-solid fa-bars"></i>' +
        '<div class="logo">' + logoInner + '</div>' +
        '<div class="name">' + esc(SYS_NAME) + '</div>' +
      '</div>' + sysCapsuleHTML() +
      '<div class="topbar-right">' +
        roleSwitchHTML(CUR_ROLE) +
        '<div class="topbar-icon" title="消息"><i class="fa-solid fa-bell"></i><span class="dot">5</span></div>' +
        '<div class="topbar-icon" title="帮助"><i class="fa-solid fa-circle-question"></i></div>' +
        '<div class="user"><div class="avatar">' + esc(meta.user.charAt(0)) + '</div>' +
          '<div class="u-meta"><div class="u-name">' + esc(meta.user) + '</div><div class="u-role">' + esc(meta.role) + '</div></div>' +
        '</div>' +
        '<a href="' + ROOT_BASE + (APP_CONFIG.portalHref || 'index.html') + '" class="topbar-icon" title="返回门户 / 退出"><i class="fa-solid fa-right-from-bracket"></i></a>' +
      '</div>';
  }

  function sidebarHTML(active, file, role) {
    return '<div class="menu-search">' +
        '<input type="text" class="menu-search-input" placeholder="菜单搜索" autocomplete="off">' +
        '<i class="fa-solid fa-magnifying-glass s-ico"></i>' +
        '<i class="fa-solid fa-xmark s-clear" title="清空"></i>' +
      '</div>' +
      '<div class="menu-list">' + buildMenu(active, file, role) + '</div>';
  }

  /* ------- 首页渲染（由 APP_CONFIG.home 驱动） ------- */
  function greet() { var h = new Date().getHours(); return h < 12 ? '上午好' : h < 18 ? '下午好' : '晚上好'; }
  function todayStr() {
    var d = new Date(), wk = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 星期' + wk;
  }
  function statCards(list) {
    return '<div class="stat-grid">' + (list || []).map(function (k) {
      return '<div class="stat-card"><div class="s-icon ' + k.c + '"><i class="fa-solid ' + k.i + '"></i></div><div>' +
        '<div class="s-label">' + k.l + '</div><div class="s-value">' + k.v + '</div>' +
        (k.t ? '<div class="s-trend ' + (k.td || 'text-success') + '">' + k.t + '</div>' : '') + '</div></div>';
    }).join('') + '</div>';
  }
  function demoLink(href, tip) {
    return href
      ? ' href="' + withRole(href, CUR_ROLE) + '"'
      : ' href="javascript:void(0)" onclick="PMS.toast(\'' + (tip || '原型演示') + '\')"';
  }
  function quickGrid(items) {
    return '<div class="quick-grid">' + (items || []).map(function (it) {
      return '<a class="quick-item"' + demoLink(it.h, it.l) + '><span class="q-ico ' + it.c + '"><i class="fa-solid ' + it.i + '"></i></span><span class="q-label">' + it.l + '</span></a>';
    }).join('') + '</div>';
  }
  function todoRows(items) {
    return '<div class="home-todo">' + (items || []).map(function (t) {
      return '<a class="todo-row"' + demoLink(t.h, '待办详情') + '><span class="badge ' + t.c + '">' + t.tag + '</span>' +
        '<span class="todo-text">' + t.txt + '</span><span class="todo-time ' + (t.warn ? 'is-warn' : '') + '">' + t.time + '</span></a>';
    }).join('') + '</div>';
  }
  function panel(title, moreHref, inner) {
    return '<div class="card home-panel"><div class="card-head"><h3>' + title + '</h3>' +
      (moreHref ? '<a class="home-more" href="' + withRole(moreHref, CUR_ROLE) + '">查看全部 <i class="fa-solid fa-angle-right"></i></a>' : '') +
      '</div><div class="card-body">' + inner + '</div></div>';
  }
  function renderHome(role, meta) {
    var root = document.getElementById('home-root');
    if (!root) return;
    var cfg = HOME[role] || HOME[APP_CONFIG.defaultRole];
    if (!cfg) return;
    var html = '<div class="home-hero">' +
      '<div class="hero-l">' +
        '<div class="hero-greet">' + greet() + '，' + esc(meta.user) + '</div>' +
        '<div class="hero-sub">' + esc(meta.tag) + ' · ' + esc(meta.role) + '　|　' + (cfg.welcome || '') + '</div>' +
        '<div class="hero-date"><i class="fa-regular fa-calendar"></i> ' + todayStr() + '</div>' +
      '</div>' +
      '<div class="hero-r">' + (cfg.heroStats || []).map(function (s) {
        return '<div class="hs"><div class="hs-v">' + s.v + '</div><div class="hs-l">' + s.l + '</div></div>';
      }).join('<div class="hs-div"></div>') + '</div>' +
    '</div>';
    if (cfg.kpis && cfg.kpis.length) html += statCards(cfg.kpis);
    if (cfg.body) {
      html += cfg.body(withRole('', role));
    } else {
      html += '<div class="grid-2">' +
        panel('我的待办', cfg.todoMoreHref || '', todoRows(cfg.todos)) +
        panel('快捷入口', '', quickGrid(cfg.shortcuts)) +
      '</div>';
    }
    root.innerHTML = html;
  }

  /* ------- 详情分组增强：.section-title + .desc-list → .grp-card ------- */
  function enhanceDetailGroups() {
    Array.prototype.forEach.call(document.querySelectorAll('.section-title'), function (title) {
      if (title.classList.contains('grp-head')) return;
      if (title.closest('.grp-card')) return;
      var next = title.nextElementSibling;
      if (!next || !next.classList.contains('desc-list')) return;
      var bodyEls = [], n = next;
      while (n && n.classList.contains('desc-list')) { var cur = n; n = n.nextElementSibling; bodyEls.push(cur); }
      var icon = title.getAttribute('data-icon') || 'fa-layer-group';
      var card = document.createElement('div');
      card.className = 'grp-card';
      var head = document.createElement('div');
      head.className = 'grp-head';
      head.innerHTML = '<span class="gi"><i class="fa-solid ' + icon + '"></i></span>' + title.innerHTML;
      title.parentNode.insertBefore(card, title);
      card.appendChild(head);
      bodyEls.forEach(function (el) { el.classList.remove('mb-16', 'mt-16', 'mt-8'); card.appendChild(el); });
      title.parentNode.removeChild(title);
    });
  }

  function isEmbedded() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }

  /* ------- 布局注入：嵌入外壳时只初始化内容，独立打开则补齐顶栏与侧栏 ------- */
  function injectLayout() {
    var body = document.body;
    var declaredRole = body.getAttribute('data-role');
    if (!declaredRole) return;
    var role = resolveRole(declaredRole);
    var active = body.getAttribute('data-active') || '';
    var meta = ROLE_META[role];

    if (isEmbedded()) {
      body.classList.add('embedded');
    } else {
      var topbar = document.createElement('header');
      topbar.className = 'app-topbar';
      topbar.innerHTML = topbarHTML(meta);
      var sidebar = document.createElement('aside');
      sidebar.className = 'app-sidebar';
      sidebar.innerHTML = sidebarHTML(active, '', role);
      body.insertBefore(sidebar, body.firstChild);
      body.insertBefore(topbar, body.firstChild);
      sidebar.addEventListener('click', function (e) {
        var link = e.target.closest('.menu-link');
        if (link) { link.parentElement.classList.toggle('open'); }
      });
      topbar.querySelector('.sidebar-toggle').addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
      initMenuSearch(sidebar);
      if (active) highlightMenuByKey(sidebar, active);
      /* 独立打开的页面，切换子系统直接跳到该子系统的第一个功能页 */
      initSysSwitch(topbar, function (code) {
        var m = firstModuleOf(code);
        if (m && m.href) { location.href = withRole(m.href, role) + '&sys=' + code; return; }
        applySystem(code, sidebar);
      });
      initRoleSwitch(topbar);
    }
    renderHome(role, meta);
    applyRolePerms(role);
    mergeActionsIntoFilter();
    enhanceDetailGroups();
  }

  /* ------- 外壳：常驻顶栏 + 侧栏，右侧 iframe 承载内容 ------- */
  function initShell() {
    var body = document.body;
    var role = resolveRole(body.getAttribute('data-role'));
    body.setAttribute('data-role', role);
    var meta = ROLE_META[role];

    var topbar = document.createElement('header');
    topbar.className = 'app-topbar';
    topbar.innerHTML = topbarHTML(meta);
    var sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    sidebar.innerHTML = sidebarHTML('', '', role);
    body.insertBefore(sidebar, body.firstChild);
    body.insertBefore(topbar, body.firstChild);

    var frame = document.getElementById('content-frame');
    function loadPage(href) {
      if (!href) return;
      frame.setAttribute('src', href);
      if (window.innerWidth <= 1100) sidebar.classList.remove('open');
    }

    sidebar.addEventListener('click', function (e) {
      var groupHead = e.target.closest('.menu-link');
      if (groupHead) { groupHead.parentElement.classList.toggle('open'); return; }
      var a = e.target.closest('a.menu-single, .menu-sub a');
      if (a) {
        e.preventDefault();
        setActiveAnchor(sidebar, a);
        loadPage(a.getAttribute('href'));
      }
    });
    topbar.querySelector('.sidebar-toggle').addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    initMenuSearch(sidebar);
    /* 外壳内切换子系统只换侧栏与右侧内容，不整页刷新 */
    initSysSwitch(topbar, function (code) {
      var m = firstModuleOf(code);
      applySystem(code, sidebar);
      if (m && m.href) loadPage(withRole(m.href, role));
    });
    initRoleSwitch(topbar);

    frame.addEventListener('load', function () {
      /* 先按 iframe 内 body[data-active] 的菜单 key 高亮，再回退到相对路径比对 */
      var key = '', rel = '';
      try {
        var doc = frame.contentDocument;
        if (doc && doc.body) key = doc.body.getAttribute('data-active') || '';
        var loc = frame.contentWindow.location;
        rel = relFrom(location.pathname.replace(/[^/]*$/, ''), loc.pathname) + (loc.search || '');
      } catch (e) {}
      /* 首页快捷入口可能跳到别的子系统，侧栏与顶栏胶囊自动跟随 */
      var owner = sysOfKey(key);
      if (owner && owner !== CUR_SYS && sysModulesFor(SYS_INDEX[owner], role).length) applySystem(owner, sidebar);
      if (!key || !highlightMenuByKey(sidebar, key)) {
        if (rel) highlightMenu(sidebar, rel.split('?')[0]);
      }
      if (rel) {
        var page = rel.replace(/([?&])role=[^&]*/, '$1').replace(/[?&]+$/, '').replace(/\?&/, '?');
        var url = 'shell.html?role=' + role + (CUR_SYS ? '&sys=' + CUR_SYS : '') + '&page=' + encodeURIComponent(page);
        try { history.replaceState(null, '', url); } catch (e) {}
      }
    });

    var page = null;
    try { page = new URLSearchParams(location.search).get('page'); } catch (e) {}
    if (!page) {
      var m0 = firstModuleOf(CUR_SYS) || (APP_CONFIG.menu || [])[0];
      page = (m0 && m0.href) ? m0.href : '';
    }
    if (page) loadPage(page + (page.indexOf('?') >= 0 ? '&' : '?') + 'role=' + role);
  }

  function setActiveAnchor(sidebar, a) {
    sidebar.querySelectorAll('.menu-single.active, .menu-sub a.active').forEach(function (x) { x.classList.remove('active'); });
    a.classList.add('active');
    var g = a.closest('.menu-item');
    if (g) {
      sidebar.querySelectorAll('.menu-item.open').forEach(function (x) { if (x !== g) x.classList.remove('open'); });
      g.classList.add('open');
    } else {
      sidebar.querySelectorAll('.menu-item.open').forEach(function (x) { x.classList.remove('open'); });
    }
  }

  function highlightMenu(sidebar, file) {
    sidebar.querySelectorAll('.menu-single.active, .menu-sub a.active').forEach(function (a) { a.classList.remove('active'); });
    sidebar.querySelectorAll('.menu-item.open').forEach(function (g) { g.classList.remove('open'); });
    sidebar.querySelectorAll('.menu-single').forEach(function (a) {
      if ((a.getAttribute('href') || '').split('?')[0] === file) a.classList.add('active');
    });
    sidebar.querySelectorAll('.menu-sub a').forEach(function (a) {
      if ((a.getAttribute('href') || '').split('?')[0] === file) {
        a.classList.add('active');
        var g = a.closest('.menu-item'); if (g) g.classList.add('open');
      }
    });
  }

  /* ------- 页头操作按钮并入查询工具条（整体右对齐） ------- */
  function mergeActionsIntoFilter() {
    var main = document.querySelector('main.app-main');
    if (!main) return;
    var actions = main.querySelector('.page-head .page-actions');
    var fb = main.querySelector('.filter-bar');
    if (!fb) return;
    var group = fb.querySelector('.filter-actions');
    if (!group) { group = document.createElement('div'); group.className = 'filter-actions'; }
    [].slice.call(fb.children).forEach(function (ch) {
      if (ch === group) return;
      if (ch.classList && (ch.classList.contains('btn') || ch.tagName === 'BUTTON')) group.appendChild(ch);
    });
    if (actions) {
      while (actions.firstChild) { group.appendChild(actions.firstChild); }
      if (actions.parentNode) actions.parentNode.removeChild(actions);
    }
    var sp = fb.querySelector('.spacer');
    if (sp && sp.parentNode) sp.parentNode.removeChild(sp);
    if (group.childNodes.length) fb.appendChild(group);
  }

  /* ------- 按角色显隐：data-roles / data-roles-not ------- */
  function applyRolePerms(role) {
    document.querySelectorAll('[data-roles]').forEach(function (el) {
      var roles = (el.getAttribute('data-roles') || '').split(/[,\s]+/).filter(Boolean);
      if (roles.length && roles.indexOf(role) < 0) el.style.display = 'none';
    });
    document.querySelectorAll('[data-roles-not]').forEach(function (el) {
      var roles = (el.getAttribute('data-roles-not') || '').split(/[,\s]+/).filter(Boolean);
      if (roles.indexOf(role) >= 0) el.style.display = 'none';
    });
    if (window.PMS) window.PMS.role = role;
    document.body.setAttribute('data-current-role', role);
  }

  /* ------- 菜单搜索：实时过滤并展开命中分组 ------- */
  function initMenuSearch(sidebar) {
    var box = sidebar.querySelector('.menu-search');
    if (!box) return;
    var input = box.querySelector('.menu-search-input');
    var clear = box.querySelector('.s-clear');
    var list = sidebar.querySelector('.menu-list');
    function textOf(el) { return (el.textContent || '').toLowerCase(); }
    function restore() {
      list.querySelectorAll('.menu-single, .menu-item, .menu-sub a').forEach(function (el) { el.style.display = ''; });
      list.querySelectorAll('.menu-item').forEach(function (g) {
        if (g.querySelector('.menu-sub a.active')) g.classList.add('open'); else g.classList.remove('open');
      });
    }
    function filter(q) {
      q = q.trim().toLowerCase();
      box.classList.toggle('has-value', q.length > 0);
      if (!q) { restore(); return; }
      list.querySelectorAll('.menu-single').forEach(function (el) {
        el.style.display = textOf(el).indexOf(q) >= 0 ? '' : 'none';
      });
      list.querySelectorAll('.menu-item').forEach(function (g) {
        var head = g.querySelector('.menu-link');
        var groupHit = head && textOf(head).indexOf(q) >= 0;
        var subHit = false;
        g.querySelectorAll('.menu-sub a').forEach(function (sub) {
          var hit = groupHit || textOf(sub).indexOf(q) >= 0;
          sub.style.display = hit ? '' : 'none';
          if (hit) subHit = true;
        });
        if (groupHit || subHit) { g.style.display = ''; g.classList.add('open'); }
        else { g.style.display = 'none'; }
      });
    }
    input.addEventListener('input', function () { filter(input.value); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; filter(''); input.blur(); } });
    clear.addEventListener('click', function () { input.value = ''; filter(''); input.focus(); });
  }

  /* ==========================================================================
     文件上传：表单中的 URL / 附件字段自动升级为方形宫格上传组件
     ========================================================================== */
  function fileNameFromUrl(url) {
    if (!url || url === '—' || url === '-') return '';
    try {
      var path = String(url).split('?')[0];
      var name = path.substring(path.lastIndexOf('/') + 1);
      return decodeURIComponent(name || path);
    } catch (e) { return String(url); }
  }
  function parseFileList(val) {
    if (val == null) return [];
    var s = String(val).trim();
    if (!s || s === '—' || s === '-') return [];
    if (s.charAt(0) === '[') {
      try {
        var arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.map(function (x) { return String(x || '').trim(); }).filter(Boolean);
      } catch (e) {}
    }
    return s.split(/[,;\n]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  function joinFileList(list) { return (list || []).filter(Boolean).join(','); }
  function isImageName(name) { return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name || ''); }
  function fileExt(name) { var m = String(name || '').match(/\.([a-z0-9]+)$/i); return m ? m[1] : 'file'; }
  function isUrlFillName(name) {
    var n = (name || '').toLowerCase();
    return /url$/.test(n) || n.indexOf('url') >= 0 || /file$/.test(n);
  }
  function isUrlField(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    if (el.type === 'hidden' && el.closest('.file-up')) return false;
    if (el.getAttribute('data-upload') === '1') return true;
    var fill = (el.getAttribute('data-fill') || '').toLowerCase();
    if (fill.indexOf('url') >= 0) return true;
    var item = el.closest('.form-item');
    var lab = item ? (item.querySelector('label') || {}) : {};
    var lt = (lab.textContent || '').replace(/\s+/g, '');
    return /URL|链接|附件|材料|凭证/.test(lt) && !/网址入口|接口/.test(lt);
  }
  function acceptForLabel(labelText, fill) {
    var t = (labelText || '') + ' ' + (fill || '');
    if (/照片|图片|平面图|image|photo|plan/i.test(t)) return 'image/*,.jpg,.jpeg,.png,.gif,.webp';
    if (/pdf|文件|合同|备案|材料|凭证/i.test(t)) return '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
    return '*/*';
  }
  function fileViewHtml(value) {
    var list = parseFileList(value);
    if (!list.length) return '<span class="text-3">—</span>';
    return '<span class="file-view">' + list.map(function (v) {
      var nm = fileNameFromUrl(v) || v;
      var icon = isImageName(nm) ? 'fa-regular fa-image' : 'fa-regular fa-file-lines';
      return /^https?:\/\//i.test(v)
        ? ('<a class="file-chip" href="' + v + '" target="_blank" onclick="event.stopPropagation()"><i class="' + icon + '"></i><span class="fv-name">' + nm + '</span></a>')
        : ('<span class="file-chip"><i class="' + icon + '"></i><span class="fv-name">' + nm + '</span></span>');
    }).join('') + '</span>';
  }
  function getFileUpList(wrap) {
    var hid = wrap.querySelector('input[type="hidden"][data-fill], input[type="hidden"].file-up-val');
    return parseFileList(hid ? hid.value : '');
  }
  function setFileUpList(wrap, list) {
    var hid = wrap.querySelector('input[type="hidden"][data-fill], input[type="hidden"].file-up-val');
    if (hid) hid.value = joinFileList(list);
    syncFileUpUI(wrap);
  }
  function tileHtml(v, i, previews) {
    var nm = fileNameFromUrl(v) || v;
    var isImg = isImageName(nm) || /^data:image|^blob:/i.test(v);
    var thumb = (previews && previews[nm]) || (isImg && /^(https?:|data:|blob:)/i.test(v) ? v : '');
    var view = /^https?:\/\//i.test(v) ? ('<a class="view" href="' + v + '" target="_blank" onclick="event.stopPropagation()"></a>') : '';
    if (thumb) {
      return '<div class="file-up-tile thumb" title="' + nm + '"><img src="' + thumb + '" alt="' + nm + '">' + view +
        '<span class="rm" data-file-rm="' + i + '"><i class="fa-solid fa-xmark"></i></span></div>';
    }
    if (isImg) {
      return '<div class="file-up-tile doc" title="' + nm + '"><i class="fa-regular fa-image"></i>' + view +
        '<span class="fname">' + nm + '</span><span class="rm" data-file-rm="' + i + '"><i class="fa-solid fa-xmark"></i></span></div>';
    }
    return '<div class="file-up-tile doc" title="' + nm + '"><i class="fa-regular fa-file-lines"></i><span class="ext">' + fileExt(nm) + '</span>' + view +
      '<span class="fname">' + nm + '</span><span class="rm" data-file-rm="' + i + '"><i class="fa-solid fa-xmark"></i></span></div>';
  }
  function syncFileUpUI(wrap) {
    if (!wrap) return;
    var list = getFileUpList(wrap);
    var grid = wrap.querySelector('.file-up-grid');
    var addTile = wrap.querySelector('.file-up-add');
    var previews = wrap._previews || {};
    wrap.classList.toggle('has-file', list.length > 0);
    if (!grid) return;
    Array.prototype.slice.call(grid.querySelectorAll('.file-up-tile:not(.file-up-add)')).forEach(function (t) { t.remove(); });
    var frag = '';
    list.forEach(function (v, i) { frag += tileHtml(v, i, previews); });
    if (addTile) addTile.insertAdjacentHTML('beforebegin', frag);
    else grid.innerHTML = frag;
  }
  function addFilesToUp(wrap, fileList) {
    if (!fileList || !fileList.length) return;
    var cur = getFileUpList(wrap);
    var names = {};
    cur.forEach(function (x) { names[fileNameFromUrl(x) || x] = 1; });
    wrap._previews = wrap._previews || {};
    var added = 0;
    Array.prototype.forEach.call(fileList, function (f) {
      if (!f || !f.name || names[f.name]) return;
      if (isImageName(f.name)) {
        try { wrap._previews[f.name] = URL.createObjectURL(f); } catch (e) {}
      }
      cur.push(f.name);
      names[f.name] = 1;
      added++;
    });
    setFileUpList(wrap, cur);
    if (added) PMS.toast('已添加 ' + added + ' 个文件', 'success');
  }
  function bindFileUp(wrap) {
    if (!wrap || wrap.getAttribute('data-bound') === '1') { if (wrap) syncFileUpUI(wrap); return; }
    wrap.setAttribute('data-bound', '1');
    var file = wrap.querySelector('input[type="file"]');
    var grid = wrap.querySelector('.file-up-grid');
    if (file) {
      if (!file.hasAttribute('multiple')) file.setAttribute('multiple', 'multiple');
      file.addEventListener('change', function () { addFilesToUp(wrap, file.files); file.value = ''; });
    }
    wrap.addEventListener('dragover', function (e) { e.preventDefault(); wrap.classList.add('is-drag'); });
    wrap.addEventListener('dragleave', function () { wrap.classList.remove('is-drag'); });
    wrap.addEventListener('drop', function (e) {
      e.preventDefault(); wrap.classList.remove('is-drag');
      if (e.dataTransfer && e.dataTransfer.files) addFilesToUp(wrap, e.dataTransfer.files);
    });
    if (grid) {
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-file-rm]');
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-file-rm'), 10);
        var cur = getFileUpList(wrap);
        if (!isNaN(idx) && idx >= 0 && idx < cur.length) { cur.splice(idx, 1); setFileUpList(wrap, cur); }
      });
    }
    syncFileUpUI(wrap);
  }
  function buildFileUpHtml(opts) {
    opts = opts || {};
    var fill = opts.fill || '';
    var val = opts.value == null ? '' : String(opts.value);
    if (val === '—') val = '';
    var accept = opts.accept || '*/*';
    var fillAttr = fill ? (' data-fill="' + fill + '"') : '';
    var list = parseFileList(val);
    return '<div class="file-up' + (list.length ? ' has-file' : '') + '">' +
      '<input type="hidden" class="file-up-val"' + fillAttr + ' value="' + val.replace(/"/g, '&quot;') + '">' +
      '<div class="file-up-grid">' +
        '<div class="file-up-tile file-up-add" title="添加文件（可多选）">' +
          '<input type="file" multiple accept="' + accept + '">' +
          '<i class="fa-solid fa-plus"></i><span>上传</span>' +
        '</div>' +
      '</div></div>';
  }
  function enhanceUrlUploads(root) {
    var scope = root || document;
    scope.querySelectorAll('.file-up').forEach(function (wrap) {
      var file = wrap.querySelector('input[type="file"]');
      if (file && !file.hasAttribute('multiple')) file.setAttribute('multiple', 'multiple');
      bindFileUp(wrap);
    });
    scope.querySelectorAll('.drawer .form-item input[type="text"], .modal .form-item input[type="text"], form .form-item input[type="text"], .app-main .form-item input[type="text"]').forEach(function (inp) {
      if (!isUrlField(inp) || inp.closest('.file-up')) return;
      var item = inp.closest('.form-item');
      if (!item) return;
      var lab = item.querySelector('label');
      var labelText = lab ? lab.textContent : '';
      if (lab) {
        lab.innerHTML = lab.innerHTML.replace(/\s*URL\s*/gi, '').replace(/文件链接|链接/g, '').replace(/\s+$/, '');
        if (!(lab.textContent || '').trim()) lab.textContent = '附件';
      }
      var fill = inp.getAttribute('data-fill') || '';
      inp.insertAdjacentHTML('beforebegin', buildFileUpHtml({ fill: fill, value: inp.value, accept: acceptForLabel(labelText, fill) }));
      inp.remove();
      bindFileUp(item.querySelector('.file-up'));
    });
  }

  /* ==========================================================================
     交互组件 PMS
     ========================================================================== */
  function formatMonth(v) {
    if (v == null || v === '' || v === '—') return '';
    var s = String(v).trim();
    if (/^\d{4}-\d{2}$/.test(s)) return s;
    if (/^\d{6}$/.test(s)) return s.slice(0, 4) + '-' + s.slice(4, 6);
    return s;
  }

  var PMS = {
    fileUpHtml: buildFileUpHtml,
    fileViewHtml: fileViewHtml,
    enhanceUrlUploads: enhanceUrlUploads,
    formatMonth: formatMonth,
    statMonth: function () {
      var d = new Date(), m = d.getMonth() + 1;
      return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m;
    },
    openDrawer: function (id) {
      var d = document.getElementById(id); if (!d) return;
      var mask = d.previousElementSibling && d.previousElementSibling.classList.contains('drawer-mask') ? d.previousElementSibling : null;
      d.classList.add('open'); if (mask) mask.classList.add('open');
      enhanceUrlUploads(d);
      d.querySelectorAll('.file-up').forEach(syncFileUpUI);
    },
    closeDrawer: function (id) {
      var d = id ? document.getElementById(id) : document.querySelector('.drawer.open');
      if (!d) return;
      d.classList.remove('open');
      var mask = d.previousElementSibling && d.previousElementSibling.classList.contains('drawer-mask') ? d.previousElementSibling : null;
      if (mask) mask.classList.remove('open');
    },
    openModal: function (id) {
      var m = document.getElementById(id); if (!m) return;
      m.classList.add('open');
      enhanceUrlUploads(m);
      m.querySelectorAll('.file-up').forEach(syncFileUpUI);
    },
    closeModal: function (id) {
      var m = id ? document.getElementById(id) : document.querySelector('.modal-mask.open');
      if (m) m.classList.remove('open');
    },
    toast: function (msg, type) {
      var wrap = document.querySelector('.toast-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
      var t = document.createElement('div');
      t.className = 'toast' + (type ? ' ' + type : '');
      var icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
      t.innerHTML = '<i class="fa-solid ' + icon + '"></i>' + msg;
      wrap.appendChild(t);
      setTimeout(function () {
        t.style.opacity = '0'; t.style.transition = '.3s';
        setTimeout(function () { t.remove(); }, 300);
      }, 2200);
    },
    /* PMS.confirm({ title, message, detail, type, okText, cancelText, onOk, onCancel })
       type: danger | warning | info | success */
    confirm: function (opts) {
      opts = opts || {};
      var type = opts.type || 'danger';
      var icons = { danger: 'fa-trash-can', warning: 'fa-triangle-exclamation', info: 'fa-circle-question', success: 'fa-circle-check' };
      var okCls = type === 'danger' ? 'btn-danger-solid' : 'btn-primary';
      var mask = document.getElementById('appConfirmMask');
      if (!mask) {
        mask = document.createElement('div');
        mask.className = 'modal-mask';
        mask.id = 'appConfirmMask';
        mask.innerHTML =
          '<div class="modal modal-sm">' +
            '<div class="modal-head" style="display:flex;align-items:center;justify-content:space-between">' +
              '<span data-confirm-title>确认</span>' +
              '<span class="close" data-confirm-cancel style="cursor:pointer;color:var(--text-3);width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px"><i class="fa-solid fa-xmark"></i></span>' +
            '</div>' +
            '<div class="modal-body"><div class="confirm-box">' +
              '<div class="confirm-ico" data-confirm-ico><i class="fa-solid fa-trash-can"></i></div>' +
              '<div><div class="confirm-msg" data-confirm-msg></div><div class="confirm-detail" data-confirm-detail></div></div>' +
            '</div></div>' +
            '<div class="modal-foot">' +
              '<button type="button" class="btn" data-confirm-cancel>取消</button>' +
              '<button type="button" class="btn" data-confirm-ok>确定</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(mask);
        mask.addEventListener('click', function (e) {
          if (e.target === mask) PMS._confirmCancel();
          if (e.target.closest('[data-confirm-cancel]')) PMS._confirmCancel();
          if (e.target.closest('[data-confirm-ok]')) PMS._confirmOk();
        });
      }
      PMS._confirmCb = { onOk: opts.onOk || null, onCancel: opts.onCancel || null };
      mask.querySelector('[data-confirm-title]').textContent = opts.title || '确认';
      mask.querySelector('[data-confirm-msg]').textContent = opts.message || '确定执行该操作吗？';
      var detailEl = mask.querySelector('[data-confirm-detail]');
      detailEl.textContent = opts.detail || '';
      detailEl.style.display = opts.detail ? '' : 'none';
      var ico = mask.querySelector('[data-confirm-ico]');
      ico.className = 'confirm-ico ' + type;
      ico.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.danger) + '"></i>';
      var okBtn = mask.querySelector('[data-confirm-ok]');
      okBtn.className = 'btn ' + okCls;
      okBtn.textContent = opts.okText || '确定';
      var cancelBtn = mask.querySelector('.modal-foot [data-confirm-cancel]');
      if (cancelBtn) cancelBtn.textContent = opts.cancelText || '取消';
      mask.classList.add('open');
    },
    _confirmOk: function () {
      var cb = PMS._confirmCb || {};
      PMS._confirmCb = null;
      PMS.closeModal('appConfirmMask');
      if (cb.onOk) cb.onOk();
    },
    _confirmCancel: function () {
      var cb = PMS._confirmCb || {};
      PMS._confirmCb = null;
      PMS.closeModal('appConfirmMask');
      if (cb.onCancel) cb.onCancel();
    },
    /* 生成字典下拉选项：value=编码，text=名称 */
    opts: function (name, selected, placeholder) {
      var list = DICT[name] || [];
      var ph = placeholder == null ? '请选择' : placeholder;
      var html = ph === false ? '' : '<option value="">' + ph + '</option>';
      var sel = selected == null ? '' : String(selected).trim();
      list.forEach(function (it) {
        var on = (sel !== '' && (sel === it[0] || sel === it[1])) ? ' selected' : '';
        html += '<option value="' + it[0] + '"' + on + '>' + it[1] + '</option>';
      });
      return html;
    },
    /* 按 data-fill 键名批量填充抽屉 / 详情字段 */
    fill: function (scopeId, data) {
      var scope = document.getElementById(scopeId) || document;
      Object.keys(data).forEach(function (k) {
        scope.querySelectorAll('[data-fill="' + k + '"]').forEach(function (el) {
          var v = data[k];
          if (el.tagName === 'SELECT') {
            var s = v == null ? '' : String(v).trim();
            el.value = s;
            if (el.value !== s) {
              Array.prototype.forEach.call(el.options, function (o) {
                if (o.textContent.trim() === s) el.value = o.value;
              });
            }
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = (el.type === 'month') ? formatMonth(v) : (v == null ? '' : v);
          } else if (isUrlFillName(k) || el.getAttribute('data-file-view') === '1') {
            el.innerHTML = fileViewHtml(v);
          } else {
            el.textContent = v == null ? '' : v;
          }
        });
      });
      enhanceUrlUploads(scope);
      scope.querySelectorAll('.file-up').forEach(syncFileUpUI);
    },
    /* 列表行删除：确认 → 移除该行 → 提示 */
    delRow: function (tr, name) {
      if (!tr) return;
      var label = name || '该记录';
      PMS.confirm({
        title: '删除确认',
        message: '确定删除「' + label + '」吗？',
        detail: '此操作不可撤销。',
        type: 'danger',
        okText: '删除',
        onOk: function () {
          if (tr.parentNode) tr.parentNode.removeChild(tr);
          PMS.toast('已删除', 'success');
        }
      });
    }
  };
  window.PMS = PMS;

  /* ------- 全局事件委托 ------- */
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open-drawer]');
    if (o) PMS.openDrawer(o.getAttribute('data-open-drawer'));
    var m = e.target.closest('[data-open-modal]');
    if (m) PMS.openModal(m.getAttribute('data-open-modal'));
    if (e.target.closest('[data-close-drawer]') || e.target.classList.contains('drawer-mask')) PMS.closeDrawer();
    if (e.target.closest('[data-close-modal]')) PMS.closeModal();
    else if (e.target.classList.contains('modal-mask')) {
      if (e.target.id === 'appConfirmMask') PMS._confirmCancel();
      else PMS.closeModal();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var cm = document.getElementById('appConfirmMask');
      if (cm && cm.classList.contains('open')) { PMS._confirmCancel(); e.preventDefault(); }
    }
  });

  /* ------- 标签页 ------- */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabs) {
      tabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.tab'); if (!tab) return;
        var name = tab.getAttribute('data-tab');
        var scope = tabs.closest('[data-tabs-scope]') || document;
        tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        scope.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-panel') === name);
        });
        scope.querySelectorAll('.tab-panel.active .table-wrap > table.data-table').forEach(function (t) {
          if (t.getAttribute('data-fill') === '1') { applyListLayout(t); fillRows(t); }
        });
      });
    });
  }

  /* ==========================================================================
     列表增强：定高布局 + 序号列 + 右侧固定操作列 + 综合分页
     ========================================================================== */
  var PAGE_SIZES = [10, 20, 50, 100];
  var DEFAULT_PAGE_SIZE = 20;

  function listTables() {
    var out = [];
    document.querySelectorAll('main.app-main .table-wrap > table.data-table').forEach(function (t) {
      if (!t.closest('.drawer')) out.push(t);
    });
    return out;
  }
  function addIndexColumn(table) {
    var headRow = table.querySelector('thead tr');
    if (headRow && !headRow.querySelector('th.idx-col')) {
      var th = document.createElement('th');
      th.className = 'idx-col'; th.textContent = '序号';
      headRow.insertBefore(th, headRow.firstChild);
    }
  }
  function markOpsColumn(table) {
    if (!table) return;
    var headRow = table.querySelector('thead tr');
    if (!headRow) return;
    var ths = headRow.children, idx = -1, i;
    for (i = 0; i < ths.length; i++) {
      if ((ths[i].textContent || '').replace(/\s+/g, '') === '操作') { idx = i; break; }
    }
    if (idx < 0) return;
    for (i = 0; i < ths.length; i++) ths[i].classList.toggle('col-ops', i === idx);
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      var cells = tr.children;
      for (var j = 0; j < cells.length; j++) {
        if (cells[j].tagName === 'TD') cells[j].classList.toggle('col-ops', j === idx);
      }
    });
  }
  function watchOpsColumn(table) {
    if (!table || table._opsWatch || typeof MutationObserver === 'undefined') return;
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    table._opsWatch = new MutationObserver(function () { markOpsColumn(table); });
    table._opsWatch.observe(tbody, { childList: true });
  }
  function renumber(table, start) {
    var n = start || 1;
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      var cell = tr.querySelector('td.idx-col');
      if (!cell) { cell = document.createElement('td'); cell.className = 'idx-col'; tr.insertBefore(cell, tr.firstChild); }
      cell.textContent = n < 10 ? '0' + n : String(n);
      n++;
    });
  }
  function applyListLayout(table) {
    var main = table.closest('main.app-main');
    if (main) {
      main.classList.add('list-layout');
      document.documentElement.classList.add('list-page');
      document.body.classList.add('list-page');
    }
    var card = table.closest('.card'); if (card) card.classList.add('list-card');
    var body = table.closest('.card-body'); if (body) body.classList.add('list-body');
    var panelEl = table.closest('.tab-panel'); if (panelEl) panelEl.classList.add('list-panel');
  }
  function ensureFoot(table) {
    var wrap = table.parentElement;
    var next = wrap.nextElementSibling;
    if (next && next.classList.contains('table-foot')) return next;
    var foot = document.createElement('div');
    foot.className = 'table-foot';
    wrap.parentNode.insertBefore(foot, wrap.nextSibling);
    return foot;
  }
  function buildPageNums(cur, total) {
    var pages = [], i;
    if (total <= 7) { for (i = 1; i <= total; i++) pages.push(i); return pages; }
    pages.push(1);
    var start = Math.max(2, cur - 1), end = Math.min(total - 1, cur + 1);
    if (cur <= 3) { start = 2; end = 4; }
    if (cur >= total - 2) { start = total - 3; end = total - 1; }
    if (start > 2) pages.push('…');
    for (i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  }
  function renderPager(foot, state) {
    var pageNum = Math.max(1, state.pageNum || 1);
    var pageSize = state.pageSize || DEFAULT_PAGE_SIZE;
    var total = Math.max(0, state.total || 0);
    var pages = Math.max(1, Math.ceil(total / pageSize) || 1);
    if (pageNum > pages) pageNum = pages;

    var sizeOpts = PAGE_SIZES.map(function (n) {
      return '<option value="' + n + '"' + (n === pageSize ? ' selected' : '') + '>' + n + '</option>';
    }).join('');

    var btns = '';
    btns += '<button type="button" data-pg="first" title="首页"' + (pageNum <= 1 ? ' disabled' : '') + '><i class="fa-solid fa-angles-left"></i></button>';
    btns += '<button type="button" data-pg="prev" title="上一页"' + (pageNum <= 1 ? ' disabled' : '') + '><i class="fa-solid fa-angle-left"></i></button>';
    buildPageNums(pageNum, pages).forEach(function (p) {
      if (p === '…') btns += '<span class="pager-ellipsis">…</span>';
      else btns += '<button type="button" class="' + (p === pageNum ? 'active' : '') + '" data-pg="' + p + '">' + p + '</button>';
    });
    btns += '<button type="button" data-pg="next" title="下一页"' + (pageNum >= pages ? ' disabled' : '') + '><i class="fa-solid fa-angle-right"></i></button>';
    btns += '<button type="button" data-pg="last" title="末页"' + (pageNum >= pages ? ' disabled' : '') + '><i class="fa-solid fa-angles-right"></i></button>';

    var from = total === 0 ? 0 : (pageNum - 1) * pageSize + 1;
    var to = Math.min(total, pageNum * pageSize);

    foot.innerHTML =
      '<div class="pager-info">共 <b>' + total + '</b> 条，显示 <b>' + from + '</b>–<b>' + to + '</b> 条</div>' +
      '<div class="pager-controls">' +
        '<label class="pager-size">每页 <select data-page-size>' + sizeOpts + '</select> 条</label>' +
        '<div class="pager">' + btns + '</div>' +
        '<label class="pager-jump">前往 <input type="number" min="1" max="' + pages + '" value="' + pageNum + '" data-page-jump> 页</label>' +
        '<span class="pager-pages">共 ' + pages + ' 页</span>' +
      '</div>';

    foot._pagerState = { pageNum: pageNum, pageSize: pageSize, total: total, pages: pages, onChange: state.onChange };

    function go(nextNum, nextSize) {
      var st = foot._pagerState;
      var size = nextSize != null ? nextSize : st.pageSize;
      var max = Math.max(1, Math.ceil(st.total / size) || 1);
      var num = Math.min(Math.max(1, nextNum), max);
      if (typeof st.onChange === 'function') { st.onChange({ pageNum: num, pageSize: size }); return; }
      var table = foot._table;
      if (!table && foot.previousElementSibling) table = foot.previousElementSibling.querySelector('table.data-table');
      if (table && table.getAttribute('data-fill') === '1') {
        table._pageNum = num; table._pageSize = size; fillRows(table);
      } else {
        renderPager(foot, { pageNum: num, pageSize: size, total: st.total, onChange: st.onChange });
      }
    }

    foot.querySelectorAll('.pager button[data-pg]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = foot._pagerState, pg = b.getAttribute('data-pg'), target = st.pageNum;
        if (pg === 'first') target = 1;
        else if (pg === 'prev') target = st.pageNum - 1;
        else if (pg === 'next') target = st.pageNum + 1;
        else if (pg === 'last') target = st.pages;
        else target = parseInt(pg, 10);
        go(target);
      });
    });
    var sizeSel = foot.querySelector('[data-page-size]');
    if (sizeSel) sizeSel.addEventListener('change', function () { go(1, parseInt(sizeSel.value, 10) || DEFAULT_PAGE_SIZE); });
    var jumpInput = foot.querySelector('[data-page-jump]');
    if (jumpInput) {
      var doJump = function () { var v = parseInt(jumpInput.value, 10); if (!isNaN(v)) go(v); };
      jumpInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doJump(); } });
      jumpInput.addEventListener('blur', doJump);
    }
  }
  PMS.renderPager = function (footOrTable, opts) {
    var foot = footOrTable;
    if (footOrTable && footOrTable.tagName === 'TABLE') {
      foot = ensureFoot(footOrTable);
      applyListLayout(footOrTable);
    }
    if (!foot) return;
    renderPager(foot, opts || {});
  };

  /* 列表模拟总量：每张表固定随机 500～20000，刷新页面前保持不变 */
  function mockTotalFor(table) {
    if (table._total != null) return table._total;
    var key = 'app.mockTotal:' + (location.pathname || '') + '#' + (table.id || '');
    var head = table.querySelector('thead');
    if (head) key += ':' + (head.textContent || '').replace(/\s+/g, '').slice(0, 40);
    try {
      var cached = sessionStorage.getItem(key);
      if (cached) {
        var n = parseInt(cached, 10);
        if (n >= 500 && n <= 20000) { table._total = n; return n; }
      }
    } catch (e) {}
    var total = 500 + Math.floor(Math.random() * 19501);
    table._total = total;
    try { sessionStorage.setItem(key, String(total)); } catch (e2) {}
    return total;
  }
  function fillRows(table) {
    var tbody = table.querySelector('tbody'); if (!tbody) return;
    if (!table._origRows) {
      table._origRows = Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) { return tr.cloneNode(true); });
    }
    var orig = table._origRows;
    if (!orig.length) return;

    var pageSize = table._pageSize || DEFAULT_PAGE_SIZE;
    var pageNum = table._pageNum || 1;
    var total = mockTotalFor(table);
    table._pageSize = pageSize;

    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (pageNum > pages) pageNum = pages;
    if (pageNum < 1) pageNum = 1;
    table._pageNum = pageNum;

    var showCount = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    if (showCount < 0) showCount = 0;

    tbody.innerHTML = '';
    for (var i = 0; i < showCount; i++) {
      var seq = (pageNum - 1) * pageSize + i;
      var row = orig[seq % orig.length].cloneNode(true);
      row.classList.add('is-clone');
      tbody.appendChild(row);
    }
    renumber(table, (pageNum - 1) * pageSize + 1);
    markOpsColumn(table);
    var foot = ensureFoot(table);
    foot._table = table;
    renderPager(foot, { pageNum: pageNum, pageSize: pageSize, total: total });
  }
  function enhanceTables() {
    var all = listTables();
    all.forEach(addIndexColumn);
    all.forEach(markOpsColumn);
    all.forEach(watchOpsColumn);
    var layoutOnly = all.filter(function (t) { return t.hasAttribute('data-static') || t.getAttribute('data-fill') === '0'; });
    var fillable = all.filter(function (t) {
      return !t.closest('.grid-2, .grid-3') && !t.hasAttribute('data-static') && t.getAttribute('data-fill') !== '0';
    });
    layoutOnly.forEach(function (t) { t.setAttribute('data-fill', '0'); applyListLayout(t); });
    fillable.forEach(function (t) {
      t.setAttribute('data-fill', '1');
      t._pageSize = DEFAULT_PAGE_SIZE;
      t._pageNum = 1;
      applyListLayout(t);
    });
    all.forEach(function (t) { if (t.getAttribute('data-fill') !== '1') renumber(t); });
    fillable.forEach(fillRows);
    all.forEach(markOpsColumn);
  }

  /* ------- 字典下拉自动填充：<select data-dict="xxx"> ------- */
  function populateDicts(root) {
    (root || document).querySelectorAll('select[data-dict]').forEach(function (sel) {
      if (sel.getAttribute('data-dict-done') === '1') return;
      var name = sel.getAttribute('data-dict');
      if (!DICT[name]) return;
      var ph = '请选择';
      if (sel.hasAttribute('data-ph')) { ph = sel.getAttribute('data-ph'); if (ph === '') ph = false; }
      sel.innerHTML = PMS.opts(name, sel.getAttribute('data-selected'), ph);
      sel.setAttribute('data-dict-done', '1');
    });
  }
  PMS.populateDicts = populateDicts;

  /* ------- 引导 ------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.hasAttribute('data-shell')) { initShell(); return; }
    injectLayout();
    initTabs();
    enhanceTables();
    populateDicts();
    enhanceUrlUploads(document);
    document.querySelectorAll('.filter-item input[type="month"]').forEach(function (el) {
      if (!el.value) el.value = PMS.statMonth();
    });
  });
})();
