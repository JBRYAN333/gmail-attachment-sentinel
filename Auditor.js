function relatorioCompletoComExtras() {
  var folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  
  // 1. Mapear o Drive
  var inventarioDrive = {}; 
  var listaNomesDrive = []; 
  
  var arquivos = folder.getFiles();
  var contadorDrive = 0;
  
  Logger.log('>>> 1. Lendo arquivos na pasta do Google Drive...');
  while (arquivos.hasNext()) {
    var arquivo = arquivos.next();
    var nomeArq = arquivo.getName();
    inventarioDrive[nomeArq] = true;
    listaNomesDrive.push(nomeArq);
    contadorDrive++;
  }
  Logger.log('Total de arquivos no Drive: ' + contadorDrive);

  // 2. Mapear o Email (Auditoria completa, ignorando labels)
  var query = 'from:' + CONFIG.TARGET_EMAIL + ' has:attachment filename:pdf';
  // Nota: GmailApp.search sem limite pode falhar se houver milhares de threads.
  // Considere usar paginação se o volume for massivo.
  var threads = GmailApp.search(query);
  
  var listaFaltantes = []; 
  var inventarioEmails = {}; 
  var totalAnexosEmail = 0;

  Logger.log('>>> 2. Comparando com os emails...');
  
  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      message.getAttachments().forEach(function(attachment) {
        if (attachment.getContentType() === 'application/pdf') {
          totalAnexosEmail++;
          var nome = attachment.getName();
          
          inventarioEmails[nome] = true;
          
          if (!inventarioDrive[nome]) {
            listaFaltantes.push(nome);
          }
        }
      });
    });
  });

  // 3. Identificar os EXTRAS
  var listaExtras = [];
  listaNomesDrive.forEach(function(nomeNoDrive) {
    if (!inventarioEmails[nomeNoDrive]) {
      listaExtras.push(nomeNoDrive);
    }
  });

  // 4. O Veredito
  Logger.log('\n---------------- RELATÓRIO FINAL ----------------');
  Logger.log('Total de PDFs nos emails (Original): ' + totalAnexosEmail);
  Logger.log('Total de PDFs no Drive (Atual):      ' + contadorDrive);
  Logger.log('-------------------------------------------------');
  
  if (listaFaltantes.length > 0) {
    Logger.log('❌ FALTA BAIXAR: ' + listaFaltantes.length + ' arquivos.');
    listaFaltantes.forEach(function(nome) { Logger.log('[FALTA]: ' + nome); });
  } else {
    Logger.log('✅ SUCESSO DE BACKUP: Sincronização perfeita dos e-mails encontrados.');
  }

  Logger.log('-------------------------------------------------');

  if (listaExtras.length > 0) {
    Logger.log('⚠️ ARQUIVOS EXTRAS NO DRIVE (' + listaExtras.length + '):');
    listaExtras.forEach(function(nome) { Logger.log('[EXTRA]: ' + nome); });
  } else {
    Logger.log('✨ LIMPEZA TOTAL: Não há arquivos órfãos.');
  }
  
  Logger.log('-------------------------------------------------');
}