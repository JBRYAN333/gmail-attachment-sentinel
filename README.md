# 🛡️ Gmail Attachment Sentinel

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)]()
[![Gmail](https://img.shields.io/badge/Gmail-EA4335?logo=gmail&logoColor=white)]()
[![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?logo=googledrive&logoColor=white)]()
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> *"Confie, mas verifique."* — Backup e auditoria de anexos legados direto do
> Gmail para o Google Drive, sem depender de terceiros.

## O que faz

Extrai **centenas de PDFs** de e-mails antigos de um remetente específico e os
salva no Google Drive — garantindo que **nada se perca** e que **não exista
duplicata**. Roda inteiro no Google Apps Script (gratuito), sem servidor.

Dois modos de operação:

| Modo | Arquivo | Função |
|---|---|---|
| **Extração (Writer)** | `Extractor.js` | Baixa os PDFs e marca os e-mails como processados |
| **Auditoria (Reader)** | `Auditor.js` | Compara e-mail × Drive e gera relatório de integridade |

## Funcionalidades

- **Extração incremental** — usa *Label* do Gmail pra lembrar o que já foi
  baixado; pode rodar de novo sem rebaixar nada.
- **Proteção contra duplicatas** — verifica se o arquivo já existe na pasta do
  Drive antes de salvar.
- **Relatório de discrepância** — aponta arquivos **faltantes** (estavam no
  e-mail, não chegaram no Drive) e **extras/órfãos** (estão no Drive, mas não
  constam nos e-mails).
- **À prova de timeout** — processa 20 e-mails por vez (limite de execução do
  Apps Script).

## Instalação

1. Acesse [script.google.com](https://script.google.com/) e crie um novo projeto.
2. Crie os 3 arquivos: `Config.js`, `Extractor.js` e `Auditor.js`.
3. Copie o conteúdo correspondente deste repo para cada um.

## Configuração (importante)

Antes de rodar, preencha o `Config.js` com seus dados:

```javascript
var CONFIG = {
  FOLDER_ID: 'INSIRA_SEU_ID_DA_PASTA_AQUI',   // ID da pasta no Drive
  TARGET_EMAIL: 'email_do_alvo@exemplo.com',   // Remetente dos anexos
  PROCESSED_LABEL: 'Processado_Backup'          // Label de já-processado
};
```

> ⚠️ **NUNCA comite o `Config.js` com dados reais.** O versionamento serve de
> molde; seus valores ficam só no projeto do Apps Script.

## Estrutura

```
gmail-attachment-sentinel/
├── Config.js     → Configuração global (FOLDER_ID, remetente, label)
├── Extractor.js  → Modo Extração: baixa PDFs + marca processado
└── Auditor.js    → Modo Auditoria: relatório de integridade e-mail × Drive
```

## Auditoria

O `Auditor.js` reconstrói o inventário esperado a partir dos e-mails e compara
com o conteúdo real da pasta, devolvendo:

- ✅ arquivos OK (presentes nos dois lados)
- ❌ **Faltantes** — no e-mail, sumiram do Drive
- ⚠️ **Extras/Órfãos** — no Drive, sem origem no e-mail

## Licença

MIT — veja `LICENSE`.