# 🛡️ Gmail Attachment Sentinel

> "Confie, mas verifique." - Um script para backup e auditoria de anexos legados.

## 📖 Contexto

Este projeto foi criado para resolver um problema de **Preservação Digital**. Ele permite extrair centenas de anexos (PDFs) de e-mails antigos de um remetente específico e salvá-los no Google Drive, garantindo que nada seja perdido e que duplicatas não sejam criadas.

O sistema opera em dois modos:
1.  **Extração (Writer):** Baixa os arquivos e marca os e-mails como processados.
2.  **Auditoria (Reader):** Compara o que existe no e-mail contra o que está na pasta do Drive, gerando um relatório de integridade.

## 🚀 Funcionalidades

* **Extração Incremental:** Usa *Labels* (etiquetas) do Gmail para saber o que já foi baixado. Pode ser rodado múltiplas vezes sem baixar o mesmo arquivo duas vezes.
* **Proteção contra Duplicatas:** Verifica se o arquivo já existe na pasta do Drive antes de copiar.
* **Relatório de Discrepância:** Identifica arquivos que estão no e-mail mas falharam em ir para o Drive (Faltantes) e arquivos que estão no Drive mas não constam nos e-mails (Extras/Órfãos).

## 🛠️ Instalação

1.  Acesse [script.google.com](https://script.google.com/) e crie um novo projeto.
2.  Crie três arquivos no editor: `Config.gs`, `Extractor.gs` e `Auditor.gs`.
3.  Copie o conteúdo da pasta `/src` deste repositório para os respectivos arquivos.

## ⚙️ Configuração (Importante)

Antes de executar, abra o arquivo `Config.gs` e preencha com seus dados. **Não comite este arquivo com seus dados reais.**

```javascript
var CONFIG = {
  FOLDER_ID: 'COLE_AQUI_O_ID_DA_SUA_PASTA_DO_DRIVE', 
  TARGET_EMAIL: 'email_da_tia@exemplo.com',
  PROCESSED_LABEL: 'Processado_Backup'
};