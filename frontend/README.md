# LMS_FrontEnd

### Setup Instruction

1. Clone the project

```
    git clone https://github.com/ayush931/LMS-Project-FrontEnd
```
2. Move into the directory

```
    cd LMS-Project-FrontEnd
```

3. Install dependencies

```
    npm i
```

4. Run the server

```
    npm run dev
```

### Setup instruction for tailwind

[Tailwind CSS official instruction doc](https://tailwindcss.com/docs/installation)

1. Install tailwindcss

```
    npm install -D tailwindcss postcss autoprefixer
```

2. Create tailwind config file

```
    npx tailwindcss init
```

3. Add file extension to tailwind config file in the contents property

```
    ""./index.html ,./src/**/*.{html,js,jsx,ts,tsx}"
```

4. Add the tailwind directives at the top of the `index.css` file

```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```

5. Add the following details in the plugin property of tailwind config

```
    [require("daisyui"), require("@tailwindcss/line-clamp")]
```

### Adding plugins and dependencies

```
    npm install @reduxjs/toolkit react-redux react-router-dom react-icons react-chartjs-2 chart.js daisyui axios react-hot-toast @tailwindcss/line-clamp
```

### Config auto import sort eslint

1. Install simple import sort

```
    npm install -D eslint-plugin-simple-import-sort
```

2. Add rule in `.eslint.cjs`

```
    'simple-import-sort/imports': 'error'
```

3. Add simple-import sort plugin in `.eslint.cjs`

```
    plugins: [..., 'simple-import-sort']
```

4. To enable auto import sort on file save in vscode

    - Open `settings.json`
    - add the following config

```
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
```