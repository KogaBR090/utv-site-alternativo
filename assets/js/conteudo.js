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

  // ID do canal no YouTube, começa com "UC" (YouTube Studio > Configurações > Canal > Configurações avançadas).
  // Com ele preenchido, a página do Canal 24h mostra a transmissão ao vivo.
  youtubeCanalId: '',

  // ID da playlist de reprises, começa com "PL" (aparece no link da playlist depois de "list=").
  playlistReprises: '',

  trabalhos: [
    { titulo: 'Filme institucional', cliente: '[Cliente]', ano: '[Ano]', categoria: 'Institucional', video: '', imagem: '' },
    { titulo: 'Campanha publicitária', cliente: '[Cliente]', ano: '[Ano]', categoria: 'Publicidade', video: '', imagem: '' },
    { titulo: 'Transmissão ao vivo', cliente: '[Evento]', ano: '[Ano]', categoria: 'Ao vivo', video: '', imagem: '' },
    { titulo: 'Documentário', cliente: '[Título]', ano: '[Ano]', categoria: 'Documentário', video: '', imagem: '' },
    { titulo: 'Cobertura de evento', cliente: '[Evento]', ano: '[Ano]', categoria: 'Eventos', video: '', imagem: '' },
    { titulo: 'Programa de TV', cliente: '[Título do programa]', ano: '[Ano]', categoria: 'Programas', video: '', imagem: '' },
    { titulo: 'Vídeo de formatura', cliente: '[Turma]', ano: '[Ano]', categoria: 'Eventos', video: '', imagem: '' },
    { titulo: 'Série para redes sociais', cliente: '[Cliente]', ano: '[Ano]', categoria: 'Publicidade', video: '', imagem: '' }
  ]
};
