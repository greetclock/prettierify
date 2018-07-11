# prettierify
Adds `prettier` to your project in one command. Just run `npx prettierify` in the root of your project.

**Optionally** create a file `~/.prettierrc` in your home directory.
At recogizer, for example, we use the following config:

```
{ 
  "semi": false, 
  "singleQuote": true,
  "trailingComma": "all"
} 
```

The command `npx prettierify` does several things:

1. Runs `npm i -D husky lint-staged prettier`
2. Creates a file .prettierrc. It is a copy of `~/.prettierrc` from your home directory.
3. Adds lint-staged block to `package.json`.
```
"lint-staged": { 
    "*.{js,json,css}": ["prettier --write", "git add"], 
    "*.ts": [ 
      "tslint --fix -c ./tslint.json 'src/**/*{.ts,.tsx}'", 
      "prettier --write", 
      "git add" 
    ] 
},
```
4. In `package.json`, adds a line to scripts: `"precommit": "lint-staged"`
5. Finally, `prettierify` applies `prettier` to all files in your project.

Steps 1-4 add a pre-commit hook that guarantees all your files will be formatted before commits. 
