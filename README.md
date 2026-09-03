# 浮生有典

只用有出处的中外名句、典故和格言开展对话挑战，并在情绪转折或主动要求时抽取一张文化反应卡。

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
