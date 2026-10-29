/*
  CONTEÚDO DO SITE DA UTV
  Este é o único arquivo que precisa ser editado no dia a dia.

  Para adicionar um trabalho ao portfólio:
    1. Copie um dos blocos { ... } da lista "trabalhos".
    2. Cole no topo da lista (o primeiro aparece em destaque).
    3. Troque título, cliente, ano, categoria e cole o link do YouTube.
  A capa vem sozinha do YouTube. Se quiser outra imagem, preencha "imagem"
  com o caminho do arquivo, por exemplo "assets/img/minha-capa.jpg".

  As categorias dos filtros são criadas a partir dos trabalhos.
*/
window.UTV = {
  // Link do showreel no YouTube (ex.: https://www.youtube.com/watch?v=XXXXXXXXXXX)
  showreel: '',

  // Showreel em arquivo (prévia curta). Troque por um link do YouTube em "showreel" quando houver a versão completa.
  showreelArquivo: 'assets/media/showreel.mp4',

  // ID do canal no YouTube, começa com "UC" (YouTube Studio > Configurações > Canal > Configurações avançadas).
  // Com ele preenchido, a página do Canal 24h mostra a transmissão ao vivo.
  youtubeCanalId: '',

  // ID da playlist de reprises, começa com "PL" (aparece no link da playlist depois de "list=").
  playlistReprises: '',

  // "foco" ajusta o enquadramento da capa (posição horizontal e vertical, em %), útil para vídeos verticais.
  // "arquivo" é uma prévia curta em assets/media, usada enquanto o vídeo completo não está no YouTube.
  // Quando preencher "video" com o link do YouTube, ele passa a abrir o vídeo completo.
  trabalhos: [
    { titulo: 'Construindo o Amanhã', cliente: 'Hub Turismo', ano: '', categoria: 'Institucional', video: '', arquivo: 'assets/media/hub-turismo.mp4', imagem: 'assets/media/hub-turismo.jpg' },
    { titulo: 'Deus Invisível', cliente: 'Campanha Hightea', ano: '2026', categoria: 'Publicidade', video: '', arquivo: 'assets/media/hightea.mp4', imagem: 'assets/media/hightea.jpg' },
    { titulo: 'Abelhas sem Ferrão, parte 1', cliente: 'Animal Care', ano: '', categoria: 'Documentário', video: '', arquivo: 'assets/media/abelhas-sem-ferrao-parte-1.mp4', imagem: 'assets/media/abelhas-sem-ferrao-parte-1.jpg' },
    { titulo: 'Abelhas sem Ferrão, parte 2', cliente: 'Animal Care', ano: '', categoria: 'Documentário', video: '', arquivo: 'assets/media/abelhas-sem-ferrao-parte-2.mp4', imagem: 'assets/media/abelhas-sem-ferrao-parte-2.jpg' },
    { titulo: 'Abelhas sem Ferrão, parte 3', cliente: 'Animal Care', ano: '', categoria: 'Documentário', video: '', arquivo: 'assets/media/abelhas-sem-ferrao-parte-3.mp4', imagem: 'assets/media/abelhas-sem-ferrao-parte-3.jpg' },
    { titulo: 'After Movie da Semana Tecnológica', cliente: 'Semana Tecnológica', ano: '', categoria: 'Eventos', video: '', arquivo: 'assets/media/semana-tecnologica.mp4', imagem: 'assets/media/semana-tecnologica.jpg' },
    { titulo: 'Vídeo publicitário', cliente: 'Pubblicitá', ano: '', categoria: 'Publicidade', video: '', arquivo: 'assets/media/publicidade.mp4', imagem: 'assets/media/publicidade.jpg' },
    { titulo: 'Institucional Start', cliente: 'Start', ano: '', categoria: 'Institucional', video: '', arquivo: 'assets/media/start.mp4', imagem: 'assets/media/start.jpg', foco: '50% 42%' },
    { titulo: 'Projeto 30 Anos', cliente: 'Damares Biazin', ano: '', categoria: 'Institucional', video: '', arquivo: 'assets/media/projeto-30-anos.mp4', imagem: 'assets/media/projeto-30-anos.jpg', foco: '50% 18%' },
    { titulo: 'Anelise Franciosi', cliente: 'Depoimento', ano: '', categoria: 'Depoimentos', video: '', arquivo: 'assets/media/anelise.mp4', imagem: 'assets/media/anelise.jpg', foco: '50% 26%' }
  ]
};
