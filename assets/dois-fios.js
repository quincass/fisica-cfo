/* Dois fios vistos de cima — componente compartilhado.
   Nasceu inline na aula 0019 (erro na questão 4: campo nulo entre dois fios) e
   foi extraído no reforço 0021, que precisou dele de novo.

   Marcação esperada:
     <div class="bancada dois-fios" data-s2="1" data-k2="1"></div>
   data-s2: 1 (fio 2 no mesmo sentido do fio 1) | -1 (sentido oposto)
   data-k2: 1 (mesma intensidade) | 3 (fio 2 com o triplo)

   Desenha os dois fios atravessando o papel e, em pontos da reta que os une,
   a seta do campo de cada fio e a da soma. Marca "nulo" onde a soma zera.
   Depende de bancada.css. */

(function () {
  var VERDE = '#0f6e56', VERM = '#993c1d', TINTA = '#1a1a18', CINZA = '#8b8a84';
  var X1 = 150, X2 = 290, Y = 115, ESCALA = 1800, TETO = 80;

  // componente vertical (positivo = para cima no desenho) do campo de um fio
  // em xw, sentido s (+1 saindo do papel), intensidade i, no ponto x da reta.
  // Corrente saindo: linhas anti-horárias, logo para cima à direita do fio.
  function campo(x, xw, s, i) { var d = x - xw; return s * i * (d > 0 ? 1 : -1) / Math.abs(d); }

  function seta(x, v, cor, larg) {
    var L = Math.max(-TETO, Math.min(TETO, v * ESCALA));
    if (Math.abs(L) < 1.5) return '';
    var y2 = Y - L, dir = L > 0 ? 1 : -1;
    return '<line x1="' + x + '" y1="' + Y + '" x2="' + x + '" y2="' + (y2 + dir * 6) +
      '" stroke="' + cor + '" stroke-width="' + larg + '"/>' +
      '<path d="M ' + x + ' ' + y2 + ' l -5 ' + (dir * 9) + ' h 10 z" fill="' + cor + '"/>';
  }

  function fio(x, s, rot) {
    var g = '<circle cx="' + x + '" cy="' + Y + '" r="11" fill="#fdfcf9" stroke="' + TINTA + '" stroke-width="2"/>';
    g += s > 0 ? '<circle cx="' + x + '" cy="' + Y + '" r="3" fill="' + TINTA + '"/>'
      : '<path d="M ' + (x - 6) + ' ' + (Y - 6) + ' l 12 12 M ' + (x + 6) + ' ' + (Y - 6) + ' l -12 12" stroke="' + TINTA + '" stroke-width="2"/>';
    return g + '<text x="' + x + '" y="' + (Y + 30) + '" text-anchor="middle" font-size="12" fill="' + TINTA + '">' + rot + '</text>';
  }

  var TEXTOS = {
    '1|1': 'Olhe o ponto do <strong>meio</strong>: verde para cima, vermelha para baixo, mesmo tamanho. A soma <strong>some</strong>. O motivo: cada fio aponta <strong>para cima à direita dele e para baixo à esquerda</strong>. O ponto do meio está à direita do fio 1 e à esquerda do fio 2, então cada fio puxa para um lado. Do lado de fora, os dois apontam para o mesmo lado e <strong>somam</strong>.',
    '-1|1': 'Invertendo o fio 2, a seta vermelha vira em todos os pontos. Agora, <strong>entre</strong> os fios, verde e vermelha apontam para o mesmo lado: somam, e o meio vira o ponto de campo <em>mais forte</em> da reta. Fora, elas se opõem, mas você sempre está mais perto de um fio que do outro, e com correntes iguais o mais perto ganha: <strong>nenhum ponto nulo</strong>.',
    '1|3': 'Mesmo sentido, mas o fio 2 tem o triplo. O ponto nulo <strong>saiu do meio</strong> e foi para perto do fio 1, o mais fraco. Para empatar com uma corrente três vezes maior, é preciso estar três vezes mais longe dela: 1 parte do fio 1 e 3 partes do fio 2.',
    '-1|3': 'Sentidos opostos e o fio 2 com o triplo. Entre os fios os campos somam. Mas apareceu um nulo do <strong>lado de fora</strong>, à esquerda do fio 1: lá o fio fraco está perto e o forte está longe, e os dois se opõem. Quando existe nulo fora dos fios, ele fica sempre do lado do <em>mais fraco</em>.'
  };

  function montar(el) {
    var s2 = parseFloat(el.dataset.s2 || '1'), k2 = parseFloat(el.dataset.k2 || '1');
    el.innerHTML =
      '<p class="legenda">Corrente no fio 2</p>' +
      '<div class="botoes" data-k="s2">' +
        '<button class="opc" type="button" data-v="1">mesmo sentido do fio 1</button>' +
        '<button class="opc" type="button" data-v="-1">sentido oposto ao fio 1</button></div>' +
      '<div class="botoes" data-k="k2">' +
        '<button class="opc" type="button" data-v="1">mesma intensidade</button>' +
        '<button class="opc" type="button" data-v="3">três vezes maior</button></div>' +
      '<svg viewBox="0 0 440 230" role="img" aria-label="Dois fios vistos de cima e o campo de cada um em pontos da reta que os une"></svg>' +
      '<p class="veredito"></p>';
    var svg = el.querySelector('svg'), vd = el.querySelector('.veredito');

    function desenhar() {
      var pts = [60, 185, 220, 255, 380];
      if (s2 < 0 && k2 === 3) pts[0] = 80;
      var s = '';
      [[X1, VERDE], [X2, VERM]].forEach(function (w) {
        [30, 55].forEach(function (r) {
          s += '<circle cx="' + w[0] + '" cy="' + Y + '" r="' + r + '" fill="none" stroke="' + w[1] + '" stroke-width="1" opacity=".25"/>';
        });
      });
      s += '<line x1="20" y1="' + Y + '" x2="420" y2="' + Y + '" stroke="' + CINZA + '" stroke-width="1" stroke-dasharray="2 3"/>';
      pts.forEach(function (x) {
        var v1 = campo(x, X1, 1, 1), v2 = campo(x, X2, s2, k2), v = v1 + v2;
        s += seta(x - 11, v1, VERDE, 2.5) + seta(x, v2, VERM, 2.5) + seta(x + 11, v, TINTA, 3.5);
        if (Math.abs(v * ESCALA) < 1.5) {
          s += '<circle cx="' + (x + 11) + '" cy="' + Y + '" r="5" fill="none" stroke="' + TINTA + '" stroke-width="2"/>' +
            '<text x="' + x + '" y="' + (Y + 50) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + TINTA + '">nulo</text>';
        }
        s += '<circle cx="' + x + '" cy="' + Y + '" r="2" fill="' + CINZA + '"/>';
      });
      s += fio(X1, 1, 'fio 1') + fio(X2, s2, k2 === 3 ? 'fio 2 (3×)' : 'fio 2');
      s += '<text x="20" y="222" font-size="11" fill="' + CINZA + '">⊙ corrente saindo do papel · ⊗ entrando · verde: fio 1 · vermelho: fio 2 · preto: soma</text>';
      svg.innerHTML = s;
      vd.innerHTML = TEXTOS[s2 + '|' + k2];
      Array.prototype.forEach.call(el.querySelectorAll('.botoes'), function (g) {
        var atual = g.dataset.k === 's2' ? s2 : k2;
        Array.prototype.forEach.call(g.querySelectorAll('button.opc'), function (b) {
          b.setAttribute('aria-pressed', parseFloat(b.dataset.v) === atual ? 'true' : 'false');
        });
      });
    }

    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button.opc');
      if (!b) return;
      if (b.parentNode.dataset.k === 's2') s2 = parseFloat(b.dataset.v); else k2 = parseFloat(b.dataset.v);
      desenhar();
    });
    desenhar();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.dois-fios'), montar);
})();
