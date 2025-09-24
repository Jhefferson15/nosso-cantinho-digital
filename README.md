# Nosso Cantinho Digital

Bem-vindos ao repositório do **Nosso Cantinho Digital**, uma aplicação web progressiva (PWA) projetada para ser um espaço privado e especial para um casal. A plataforma centraliza memórias, planejamentos e momentos em um ambiente rico e interativo.

A aplicação agora é um sistema cliente-servidor, com um frontend em JavaScript puro (SPA) e um backend em Node.js com Express e SQLite.

## ✨ Funcionalidades

O frontend continua com todas as suas funcionalidades ricas, mas agora os dados são persistidos em um servidor, permitindo o uso compartilhado em múltiplos dispositivos.

- **Bullet Journal (Bujo) Completo**
- **Momentos**
- **Galeria de Fotos**
- **Nossos Planos**
- **Reprodutor de Áudio**
- **PWA com Suporte Offline:** A interface da aplicação continua funcionando offline, enquanto as requisições de dados são sincronizadas com o servidor quando há conexão.

## 🏛️ Arquitetura da Aplicação

A arquitetura agora é composta por um frontend SPA e um backend RESTful.

### Estrutura de Pastas

```
/nosso-cantinho-digital
├── server/
│   ├── node_modules/     # Dependências do backend
│   ├── database.db       # Banco de dados SQLite
│   ├── database.js       # Script de inicialização do banco
│   ├── package.json      # Definições do projeto backend
│   └── server.js         # Servidor principal (Express)
├── src/
│   ├── css/
│   └── js/
├── index.html
├── manifest.json
├── sw.js                 # Service Worker (agora com lógica de API)
└── README.md
```

### Roteamento

O roteamento do frontend continua baseado em hash (`/#/journal`), enquanto o backend expõe uma API REST em `/api/*`.

## 🚀 Como Executar Localmente

O projeto agora requer a execução de um servidor Node.js.

1.  **Pré-requisitos:**
    *   Node.js e npm instalados.

2.  **Instale as dependências do backend:**
    *   Navegue até a pasta `server/` e execute:
    ```bash
    npm install
    ```

3.  **Inicie o servidor:**
    *   Ainda na pasta `server/`, execute:
    ```bash
    npm start
    ```

4.  **Acesse a aplicação:**
    *   Abra o navegador no endereço `http://localhost:3000`.

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