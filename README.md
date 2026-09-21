# yoi

整理された新しいプロジェクトフォルダを作り、そこにcdをする、ターミナル用の小さなコマンド。

## 特徴

- 上下キーで分類フォルダを選び、名前を打つだけ
- 作ったフォルダにcdした状態でコマンドが終わる
- 空の名前や既にある名前は、その場で入力し直し
- Ctrl+P / Ctrl+N でも上下に動く

## 使い方

1. ビルドして `yoi` コマンドを登録する

```bash
pnpm install
pnpm build
npm link
```

2. `~/.zshrc` に次の関数を足して、ターミナルを開き直す

```bash
yoi() {
  local target_dir
  target_dir=$(command yoi --print-created-path "$@")
  if [ -n "$target_dir" ]; then
    cd "$target_dir"
  else
    echo "[!] Failed to create project folder or print the path."
  fi
}
```

3. `yoi` を実行して、分類フォルダを選ぶ
4. 名前を入力
5. cdされるので、プログラミング開始

移動してくれるのはこのシェル関数の働きで、`command yoi` 単体だとフォルダを作ってパスを表示するだけです。

## 開発

```bash
pnpm install
pnpm dev     # ビルドせずに実行
pnpm build   # dist/ に出力
```

`npm link` が指すのは `dist/index.js` なので、直したら `pnpm build` が必要です。
作る場所は `src/commands/new/entrypoint.ts` に直書きしてあり、そのフォルダが無いとエラーで終了します。
