function baixarPDFsComProtecao() {
  var folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  
  // Busca e-mails que tenham PDF e NÃO tenham a etiqueta de processado
  var query = 'in:anywhere from:' + CONFIG.TARGET_EMAIL + ' has:attachment filename:pdf -label:' + CONFIG.PROCESSED_LABEL;
  
  // Processa 20 e-mails por vez para evitar timeout do Google
  var threads = GmailApp.search(query, 0, 20); 
  
  // Busca ou cria o marcador de forma segura
  var label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!label) {
    label = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  }

  if (threads.length === 0) {
    Logger.log('Nenhum e-mail novo encontrado para processar.');
    return;
  }

  Logger.log('Processando ' + threads.length + ' conversas...');

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      var attachments = messages[j].getAttachments();
      
      for (var k = 0; k < attachments.length; k++) {
        var attachment = attachments[k];
        
        // Garante que é PDF
        if (attachment.getContentType() === 'application/pdf') {
          var nomeArquivo = attachment.getName();
          
          // VERIFICAÇÃO DE DUPLICADO: Só salva se não existir
          var jaExiste = folder.getFilesByName(nomeArquivo).hasNext();
          
          if (!jaExiste) {
            folder.createFile(attachment.copyBlob());
            Logger.log('💾 Salvo: ' + nomeArquivo);
          } else {
            Logger.log('⏩ Pulei (já existe): ' + nomeArquivo);
          }
        }
      }
    }
    
    // Marca o e-mail para não ser processado novamente
    thread.addLabel(label);
  }
  
  Logger.log('✅ Lote concluído com sucesso.');
}