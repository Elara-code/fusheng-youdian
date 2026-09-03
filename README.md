# 浮生有典

只用有出处的中外名句、典故和格言开展对话挑战，并在情绪转折或主动要求时抽取一张文化反应卡。

## 这是做什么的

“浮生有典”是一个对话型 Skill，把普通聊天变成一场引用挑战：使用者提出一句话，Agent 根据语义和情绪，选择贴切的古文、诗词、成语、典故、名人名言或世界经典原句回应，并在每条引用后标明出处。

它还配有一套原创文化反应卡。对话出现反差、情绪转折，或使用者主动要求时，Agent 会偶尔抽取一张卡片；卡片图片由 Cloudflare Worker 从私有 R2 存储桶读取。牌库固定、图片不临时生成，也不会抓取网络表情包。

它不是什么：不是知识问答库，不会解释引文含义，也不会把普通聊天内容保存成用户资料。找不到可靠出处时，会使用固定的可靠兜底句。

## 安装

### Codex 一键安装

在 Codex 中执行：

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --method download \
  --ref master \
  --repo Elara-code/fusheng-youdian \
  --path work/fusheng-youdian-v1/fusheng-youdian
```

安装完成后，重新开始一个对话即可生效。

### 其他 Agent 通用安装

如果 Agent 支持导入自定义 Skill：

1. 下载本仓库
2. 将 `work/fusheng-youdian-v1/fusheng-youdian/` 整个目录导入 Skill/能力/插件管理页面
3. 确认导入目录内直接包含 `SKILL.md`
4. 重新开始对话

如果 Agent 只支持上传单个规则文件，上传该目录中的 `SKILL.md` 即可；图片抽卡功能依赖其中写入的 Worker 接口地址。

Cloud Code、豆包、WorkBuddy 等产品的具体入口名称和安装命令可能不同，请在各自的“自定义 Agent / Skill / 插件 / 知识库”功能中导入上述目录。若产品不支持外部 HTTP 请求或远程 Markdown 图片，它仍可运行名句对话，但可能无法自动显示卡片。

## 使用

安装后直接说：

```text
$fusheng-youdian
```

也可以在对话中主动说：

```text
给我一张今日偶得卡
```

出现明显情绪转折时，Skill 也会按规则尝试展示卡片。图片由 Cloudflare Worker 从私有 R2 存储桶读取，使用者不需要 Cloudflare 账号或 R2 权限。

## 图片接口

```text
https://fusheng-youdian.yawei-c-1008.workers.dev/card.png
```

可选参数：

```text
?character=character-01
?character=character-01&state=coffee
```

## 开发者

- Skill：`work/fusheng-youdian-v1/fusheng-youdian/`
- Worker：`work/fusheng-youdian-v1/fusheng-youdian/worker/`
- R2 对象路径：`character-01/01-coffee.png`
- 牌库清单：`assets/cards/manifest.json`

图片资产不提交到公开仓库；请上传到名为 `fusheng-youdian-cards` 的私有 R2 存储桶。
