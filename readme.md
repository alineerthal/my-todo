# ✨ To-Do List – Produtividade Moderna em Estilo macOS Sonoma

Aplicação de lista de tarefas (**To-Do List**) desenvolvida com foco em:

- Visual moderno inspirado no **macOS Sonoma** (glassmorphism, blur, sombras suaves)
- Experiência profissional: filtros, prioridades, períodos do dia, tema claro/escuro
- Código limpo, organizado e pronto para portfólio

---

## 🎯 Funcionalidades

- ✅ **Criar tarefas** com:
  - Título
  - Prioridade: **Alta**, **Média**, **Baixa**
  - Período do dia: **Manhã**, **Tarde**, **Noite**

- ✅ **Marcar como concluída**  
- ✅ **Excluir tarefas**
- ✅ **Filtros avançados**:
  - Por prioridade
  - Por período do dia
  - Por status: **Todas**, **Pendentes**, **Concluídas**

- ✅ **Drag & Drop (arrastar e soltar)**:
  - Reorganizar a ordem das tarefas de forma intuitiva
  - Animações suaves ao mover os itens

- ✅ **Tema**:
  - **Claro**
  - **Escuro**
  - **Sistema** (detecta o tema do sistema operacional)

- ✅ **Persistência de dados**:
  - Tarefas salvas no **localStorage**
  - Mantém a lista mesmo após fechar o navegador

- ✅ **UI moderna**:
  - Glassmorphism (fundo translúcido, blur, bordas suaves)
  - Layout responsivo
  - Micro-animações e transições com Tailwind

---

## 🧰 Tecnologias utilizadas

- **React** (com **TypeScript**)
- **Vite** (bundler rápido e moderno)
- **Tailwind CSS** (estilização utilitária)
- **@dnd-kit/core**, **@dnd-kit/sortable**, **@dnd-kit/modifiers** (drag & drop moderno)
- **localStorage** (para persistência no navegador)

---

## 📁 Estrutura básica do projeto

```bash
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src
    ├── main.tsx
    ├── App.tsx
    └── index.css
