<div align="center">

  <img src="public/icon.ico" alt="Arcahub Logo" width="120" height="120">

  # Arcahub
  
  **Sua Command Center de Desenvolvimento**
  
  [![Electron](https://img.shields.io/badge/Electron-v28+-2B2E3A?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
  [![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

  <p align="center">
    Gerencie projetos, organize tarefas, controle o Git e acesse ferramentas de dev essenciais.<br/>
    Tudo em um único lugar, sem sair do fluxo.
  </p>
</div>

---

## 🚀 Sobre o Projeto

O **Arcahub** nasceu da necessidade de organizar o caos da área de trabalho de um desenvolvedor. Ele não é apenas um "launcher" de projetos; é uma **IDE de Gerenciamento**. 

Ele permite visualizar status do Git, gerenciar dependências, limpar node_modules, controlar containers Docker e até manter um Kanban local para cada projeto, tudo com uma interface fluida e moderna.

---

## ✨ Funcionalidades Principais

### 📂 Project Dashboard
Cada projeto tem sua própria central de comando:
- **Visão Geral:** Tech Stack detectada automaticamente, scripts NPM (run/build/dev) e atalhos rápidos.
- **Git Status:** Veja branches, arquivos alterados e faça commits/syncs rápidos.
- **Navegador de Arquivos:** Explore a estrutura de pastas sem abrir o Explorer.

### 📋 Ferramentas Integradas
- **Kanban Board Local:** Um Trello simplificado dentro de cada projeto (Todo/Doing/Done).
- **Asset Gallery:** Escaneia e exibe todas as imagens/assets do projeto para fácil importação.

### 🛠️ DevTools Suite (Ctrl+K)
Um canivete suíço acessível globalmente:
- **🕵️ Port Hunter:** Encontre e mate processos que estão bloqueando portas (adeus EADDRINUSE).
- **🐳 Docker Panel:** Visualize, inicie e pare containers rapidamente.
- **🕳️ Black Hole:** Encontre e delete pastas node_modules gigantes para liberar espaço.
- **🚇 Wormhole:** Crie túneis locais (tunneling) para expor seu localhost para a web.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as melhores ferramentas do ecossistema moderno:

* **Core:** [Electron](https://www.electronjs.org/) + [Vite](https://vitejs.dev/)
* **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** CSS Modules / Inline Styles Otimizados
* **Animações:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [React Icons (VS Code Style)](https://react-icons.github.io/react-icons/)
* **Build:** [Electron Builder](https://www.electron.build/)

---

## 📦 Como Rodar Localmente

Pré-requisitos: Node.js (v18+) e Git.

### 1. Clone o repositório
`git clone https://github.com/isaac-const/Arcahub.git`

### 2. Entre na pasta
`cd arcahub`

### 3. Instale as dependências
`npm install`

### 4. Rode em modo de desenvolvimento
`npm run dev`