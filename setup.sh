# GitHubにリポジトリを作成してpush
gh repo create neon-runner --public --source=. --push

# claude-fixラベルを作成
gh label create claude-fix --color 00ffff

# CLAUDE_CODE_OAUTH_TOKENをSecretに登録
gh secret set CLAUDE_CODE_OAUTH_TOKEN


# いくつか，初期セットアップで必要なことをまとめておきます．
# - ghのインストールとセットアップは完了している前提で進めます．
# - `gh auth login`でGitHubにログインしておく必要があります．
# - issue作成の際のclaude-fixラベルを事前に作成する必要があります．
# - CLAUDE_CODE_OAUTH_TOKENは，Anthropicのサイトで取得したトークンを使います．
# - Claude をGihub Actionsで使うために，GitHubのリポジトリのSecretにCLAUDE_CODE_OAUTH_TOKENを登録する必要があります．
# - github と Claudeの連携がまだの場合は，連携をする必要があります．
# - リポジトリの権限として，Actions > General > Workflow permissions > Allow GitHub Actions to create and approve pull requests を有効にする必要があります．

