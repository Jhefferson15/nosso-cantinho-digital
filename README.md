# Nosso Cantinho Digital

Bem-vindos ao repositório do **Nosso Cantinho Digital**, uma aplicação web progressiva (PWA) projetada para ser um espaço privado e especial para um casal. A plataforma centraliza memórias, planejamentos e momentos em um ambiente rico e interativo.

A aplicação foi construída como uma Single Page Application (SPA) com JavaScript puro, garantindo uma experiência de usuário rápida e fluida, e é totalmente funcional offline.

## ✨ Funcionalidades Atuais

- **Bullet Journal (Bujo) Completo:**
  - **Dashboard:** Um painel de controle com resumos de finanças, tarefas diárias e progresso de hábitos.
  - **Registro de Logs:** Calendário mensal interativo e registro diário de tarefas, eventos e notas.
  - **Registro Futuro:** Planejamento a longo prazo para os próximos 6 meses.
  - **Coleções:** Crie e gerencie listas personalizadas para qualquer finalidade (livros, filmes, etc.).
  - **Rastreador de Hábitos:** Grade mensal para acompanhar a conclusão de hábitos.
  - **Controle Financeiro:** Registre receitas e despesas e visualize o balanço mensal.
  - **Gráficos:** Visualize o balanço financeiro e o progresso dos hábitos em gráficos.
- **Momentos:** Um feed de cartões no estilo "Tinder" com fotos e legendas para relembrar momentos especiais.
- **Galeria de Fotos:** Uma galeria com todas as imagens e funcionalidade de lightbox.
- **Nossos Planos:** Uma checklist de planos e sonhos do casal com barra de progresso.
- **Reprodutor de Áudio:** Uma página dedicada para ouvir áudios especiais.
- **Progressive Web App (PWA):**
  - **Instalável:** Pode ser adicionado à tela inicial de um celular ou desktop.
  - **Offline-first:** A aplicação funciona perfeitamente mesmo sem conexão com a internet.

## 🏛️ Arquitetura da Aplicação

A aplicação utiliza uma arquitetura de SPA modular sem frameworks.

### Estrutura de Pastas

```
/nosso-cantinho-digital
├── src/
│   ├── css/
│   │   ├── bujo/         # Estilos para cada módulo do Bujo
│   │   └── components/   # Estilos de componentes reutilizáveis
│   ├── js/
│   │   ├── bujo/         # Lógica para cada módulo do Bujo
│   │   ├── components/   # Lógica de componentes (galeria, journal loader, etc.)
│   │   └── router/       # Sistema de roteamento da SPA
│   └── pages/
│       ├── bujo/         # Arquivos HTML para os módulos do Bujo
│       └── ...           # Outras páginas da aplicação
├── index.html            # Ponto de entrada da aplicação
├── manifest.json         # Manifesto da PWA
├── sw.js                 # Service Worker
└── README.md
```

### Roteamento

O roteamento é gerenciado por `src/js/router/router.js` e utiliza **rotas baseadas em hash** (ex: `/#/journal`). Isso garante que a aplicação possa ser carregada a partir de qualquer URL sem a necessidade de configuração especial do servidor.

## 🚀 Como Executar Localmente

Para executar o projeto, você precisa de um servidor web local devido ao uso de módulos ES6 e `fetch`.

1.  **Instale o `live-server` (se não tiver):**
    ```bash
    npm install -g live-server
    ```
2.  **Inicie o servidor na raiz do projeto:**
    ```bash
    live-server
    ```
3.  Abra o navegador no endereço fornecido (geralmente `http://127.0.0.1:8080`).

---

## 🔮 Roteiro de Desenvolvimento Futuro: Módulo de Integrações

O próximo grande passo é transformar a plataforma em uma central de dados pessoais, conectando-se a outras ferramentas para automatizar e enriquecer a experiência.

### Arquitetura Proposta

1.  **Página de Gerenciamento:**
    *   Uma nova seção na aplicação chamada "Integrações", onde o usuário poderá conectar e gerenciar contas de serviços como Google Fotos, Google Drive, etc.

2.  **Autenticação Segura:**
    *   A conexão com serviços de terceiros será feita de forma segura usando o padrão **OAuth 2.0**, garantindo que o usuário tenha total controle sobre seus dados.

3.  **Conectores Modulares:**
    *   Cada integração será um "conector" independente, permitindo adicionar novos serviços no futuro de forma fácil.

### Integrações Planejadas (Fase 1)

*   **Google Fotos:**
    *   **Objetivo:** Sincronizar fotos para criar "Momentos" ou popular a "Galeria" automaticamente.
    *   **Funcionalidade:** Permitir que o usuário conecte sua conta e escolha álbuns ou períodos para sincronizar.

*   **Google Drive:**
    *   **Objetivo:** Realizar backup e restauração seguros de todos os dados da aplicação (diário, Bujo, etc.).
    *   **Funcionalidade:** Permitir que o usuário salve um snapshot de seus dados em um arquivo no Google Drive e o restaure quando necessário.

*   **API de LLM (Large Language Model):**
    *   **Objetivo:** Adicionar uma camada de inteligência à plataforma.
    *   **Funcionalidades Propostas:**
        *   **Resumo Automático:** Gerar resumos semanais ou mensais das entradas do diário e do Bujo.
        *   **Análise de Sentimentos:** Criar gráficos mostrando a evolução do humor com base nas entradas de texto.
        *   **Assistente de Bujo:** Um chatbot para "conversar com seu Bujo", permitindo fazer perguntas ("O que eu fiz em março?") ou pedir sugestões ("Me dê ideias para uma nova coleção").

---
*Feito com ❤️ para ser o nosso cantinho especial.*