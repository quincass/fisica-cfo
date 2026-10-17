/* Explorador da mão direita — componente compartilhado.
   Nasceu no gate 0020 (questão 8: espira + fio no mesmo plano) porque o aluno
   pediu para *ver* onde o campo sai e entra do papel antes de somar.

   Marcação esperada:
     <div class="bancada mao-direita"
          data-fio="esq" data-espira="horario"></div>
   data-fio:    "dir" | "esq"          (sentido inicial da corrente no fio)
   data-espira: "anti" | "horario"     (sentido inicial da corrente na espira)

   O componente desenha uma espira no plano do papel com um fio horizontal
   logo abaixo, e deixa ligar/desligar o campo de cada um. Convenção:
   ⊙ campo saindo do papel, ⊗ campo entrando. Depende de bancada.css. */

(function () {
  var VERDE = '#0f6e56', VERM = '#993c1d', TINTA = '#1a1a18', CINZA = '#8b8a84';
  var CX = 220, CY = 100, R = 58, YF = 200;

  function simbolo(x, y, sai, cor, r) {
    r = r || 8;
    var s = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fdfcf9" stroke="' + cor + '" stroke-width="1.6"/>';
    if (sai) return s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.3) + '" fill="' + cor + '"/>';
    var d = r * 0.6;
    return s + '<path d="M ' + (x - d) + ' ' + (y - d) + ' l ' + 2 * d + ' ' + 2 * d +
      ' M ' + (x + d) + ' ' + (y - d) + ' l ' + -2 * d + ' ' + 2 * d + '" stroke="' + cor + '" stroke-width="1.6"/>';
  }

  // seta tangente na espira, no ângulo a (graus, 0 = direita, sentido anti-horário na tela)
  function setaEspira(a, anti) {
    var rad = a * Math.PI / 180;
    var x = CX + R * Math.cos(rad), y = CY - R * Math.sin(rad);
    // tangente anti-horária na tela: (-sen, -cos) em coordenadas de tela
    var tx = -Math.sin(rad), ty = -Math.cos(rad);
    if (!anti) { tx = -tx; ty = -ty; }
    var nx = -ty, ny = tx, L = 11;
    var p1 = (x + tx * L) + ' ' + (y + ty * L);
    var p2 = (x + nx * 6) + ' ' + (y + ny * 6);
    var p3 = (x - nx * 6) + ' ' + (y - ny * 6);
    return '<path d="M ' + p1 + ' L ' + p2 + ' L ' + p3 + ' z" fill="' + TINTA + '"/>';
  }

  function montar(el) {
    var estado = {
      fio: el.dataset.fio || 'esq',
      espira: el.dataset.espira || 'horario',
      verFio: false,
      verEspira: false
    };

    el.innerHTML =
      '<p class="legenda">Corrente no fio</p>' +
      '<div class="botoes" data-k="fio">' +
        '<button class="opc" type="button" data-v="dir">para a direita →</button>' +
        '<button class="opc" type="button" data-v="esq">← para a esquerda</button></div>' +
      '<p class="legenda">Corrente na espira</p>' +
      '<div class="botoes" data-k="espira">' +
        '<button class="opc" type="button" data-v="anti">anti-horário ↺</button>' +
        '<button class="opc" type="button" data-v="horario">horário ↻</button></div>' +
      '<p class="legenda">Mostrar o campo de</p>' +
      '<div class="botoes" data-k="ver">' +
        '<button class="opc" type="button" data-v="verFio">só o fio</button>' +
        '<button class="opc" type="button" data-v="verEspira">só a espira</button></div>' +
      '<svg viewBox="0 0 440 270" role="img" aria-label="Espira no plano do papel com um fio horizontal abaixo dela"></svg>' +
      '<p class="veredito"></p>';

    var svg = el.querySelector('svg'), vd = el.querySelector('.veredito');

    function desenhar() {
      var anti = estado.espira === 'anti', dir = estado.fio === 'dir';
      var s = '';

      // campo do fio: acima e abaixo dele, em faixas
      if (estado.verFio) {
        var acimaSai = dir;            // corrente →: acima sai, abaixo entra
        [60, 120, 320, 380].forEach(function (x) { s += simbolo(x, YF - 32, acimaSai, VERM, 7); });
        [60, 120, 180, 260, 320, 380].forEach(function (x) { s += simbolo(x, YF + 32, !acimaSai, VERM, 7); });
        s += simbolo(CX, CY + 22, acimaSai, VERM, 9);
        s += '<text x="' + (CX + 16) + '" y="' + (CY + 27) + '" font-size="11" fill="' + VERM + '">do fio, no centro</text>';
      }
      // campo da espira: dentro um sentido, fora o oposto
      if (estado.verEspira) {
        s += simbolo(CX, CY - 4, anti, VERDE, 11);
        s += '<text x="' + (CX + 16) + '" y="' + (CY - 18) + '" font-size="11" fill="' + VERDE + '">da espira, no centro</text>';
        [[CX - R - 26, CY], [CX + R + 26, CY], [CX, CY - R - 22]].forEach(function (p) {
          s += simbolo(p[0], p[1], !anti, VERDE, 6);
        });
      }

      // espira
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="' + TINTA + '" stroke-width="2.5"/>';
      [45, 135, 225, 315].forEach(function (a) { s += setaEspira(a, anti); });
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="2.5" fill="' + TINTA + '"/>';
      s += '<text x="' + (CX - 8) + '" y="' + (CY + 4) + '" font-size="11" text-anchor="end" fill="' + TINTA + '">P</text>';

      // fio
      s += '<line x1="30" y1="' + YF + '" x2="410" y2="' + YF + '" stroke="' + TINTA + '" stroke-width="3"/>';
      s += dir ? '<path d="M 412 ' + YF + ' l -14 -7 v 14 z" fill="' + TINTA + '"/>'
               : '<path d="M 28 ' + YF + ' l 14 -7 v 14 z" fill="' + TINTA + '"/>';
      s += '<text x="' + (dir ? 392 : 48) + '" y="' + (YF - 10) + '" font-size="12" text-anchor="middle" fill="' + TINTA + '">i</text>';

      s += '<text x="20" y="262" font-size="11" fill="' + CINZA + '">⊙ campo saindo do papel · ⊗ entrando · verde: espira · vermelho: fio · P: centro da espira</text>';
      svg.innerHTML = s;

      var t;
      if (!estado.verFio && !estado.verEspira) {
        t = 'Primeiro, sem ligar nada: faça a mão direita para <strong>cada fonte separada</strong> e decida ⊙ ou ⊗ em P. Depois ligue um campo por vez para conferir.';
      } else {
        t = '';
        if (estado.verEspira) t += '<strong>Espira:</strong> enrole os quatro dedos no sentido da corrente (' +
          (anti ? 'anti-horário' : 'horário') + '); o polegar aponta ' + (anti ? '<strong>para fora</strong> do papel' : '<strong>para dentro</strong> do papel') +
          '. Dentro da espira o campo é esse; do lado de fora dela, o oposto. ';
        if (estado.verFio) t += '<strong>Fio:</strong> polegar ' + (dir ? 'para a direita' : 'para a esquerda') +
          '; os dedos dão a volta no fio, ' + (dir ? '<strong>saindo</strong> do papel acima dele e <strong>entrando</strong> abaixo' : '<strong>entrando</strong> no papel acima dele e <strong>saindo</strong> abaixo') +
          '. P está <em>acima</em> do fio. ';
        if (estado.verFio && estado.verEspira) t += 'Agora compare os dois símbolos em P: iguais somam, diferentes subtraem.';
      }
      vd.innerHTML = t;

      Array.prototype.forEach.call(el.querySelectorAll('.botoes'), function (g) {
        var k = g.dataset.k;
        Array.prototype.forEach.call(g.querySelectorAll('button.opc'), function (b) {
          var on = k === 'ver' ? estado[b.dataset.v] : estado[k] === b.dataset.v;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    }

    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button.opc');
      if (!b) return;
      var k = b.parentNode.dataset.k;
      if (k === 'ver') estado[b.dataset.v] = !estado[b.dataset.v];
      else estado[k] = b.dataset.v;
      desenhar();
    });
    desenhar();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.mao-direita'), montar);
})();
