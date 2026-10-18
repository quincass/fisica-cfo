/* A sombra da espira — componente compartilhado.
   Nasceu na aula 0024 (Família III: fluxo, Faraday com número, transformador).

   Marcação esperada:
     <div class="bancada fluxo" data-t="0"></div>
   data-t: ângulo inicial entre o campo e a normal da espira, em graus (0|30|60|90)

   A espira é vista de cima, de fio (um segmento), girando em torno de um eixo
   vertical dentro de um campo horizontal. Desenha as linhas de campo, pinta as
   que atravessam a espira e mede a "sombra" que ela projeta — que é o fluxo.
   Depende de bancada.css. */

(function () {
  var VERDE = '#0f6e56', VERM = '#993c1d', TINTA = '#1a1a18', CINZA = '#8b8a84';
  var CX = 225, CY = 110, A = 72, X0 = 30, X1 = 420;

  var TEXTOS = {
    0: 'A normal da espira está <strong>alinhada com o campo</strong>: o plano dela corta o campo de frente. A sombra é do tamanho da espira inteira e <strong>todas</strong> as linhas atravessam. Fluxo <strong>máximo</strong>: Φ = B·A. É isto que a banca chama de "espira perpendicular ao campo" — e é fluxo máximo, não zero.',
    30: 'Girou 30°. A sombra encurtou um pouco (cos 30° ≈ 0,87) e algumas linhas passaram a escapar pela beirada. Φ = 0,87·B·A. A espira não mudou de tamanho: mudou só o quanto dela o campo "vê".',
    60: 'Girou 60°. A sombra caiu para a <strong>metade</strong> (cos 60° = 0,5), e com ela o fluxo: Φ = 0,5·B·A. Note que 60° de giro não tirou 60% do fluxo — quem manda é o cosseno, não a proporção do ângulo.',
    90: 'A espira está <strong>de fio para o campo</strong>: o campo deita no plano dela e passa raspando, sem atravessar nada. A sombra virou um risco. <strong>Φ = 0</strong>, mesmo com campo forte e área grande. Este é o único caso de fluxo zero com campo presente.'
  };

  function montar(el) {
    var t = parseFloat(el.dataset.t || '0');
    el.innerHTML =
      '<p class="legenda">Ângulo entre o campo e a normal da espira</p>' +
      '<div class="botoes" data-k="t">' +
        '<button class="opc" type="button" data-v="0">0° (de frente)</button>' +
        '<button class="opc" type="button" data-v="30">30°</button>' +
        '<button class="opc" type="button" data-v="60">60°</button>' +
        '<button class="opc" type="button" data-v="90">90° (de fio)</button></div>' +
      '<svg viewBox="0 0 440 230" role="img" aria-label="Espira vista de cima girando dentro de um campo horizontal, e a sombra que ela projeta"></svg>' +
      '<p class="veredito"></p>';
    var svg = el.querySelector('svg'), vd = el.querySelector('.veredito');

    function desenhar() {
      var rad = t * Math.PI / 180, c = Math.cos(rad);
      var meia = A * c;                       // meia-sombra, na vertical
      var dx = A * Math.sin(rad), dy = A * c; // meio segmento da espira
      var s = '';

      // linhas de campo: verdes quando atravessam a sombra da espira
      for (var k = -4; k <= 4; k++) {
        var y = CY + k * 18;
        var pega = Math.abs(y - CY) <= meia - 0.5;
        var cor = pega ? VERDE : CINZA, w = pega ? 2 : 1, op = pega ? '1' : '.45';
        s += '<line x1="' + X0 + '" y1="' + y + '" x2="' + (X1 - 10) + '" y2="' + y +
          '" stroke="' + cor + '" stroke-width="' + w + '" opacity="' + op + '"/>' +
          '<path d="M ' + X1 + ' ' + y + ' l -10 -4 v 8 z" fill="' + cor + '" opacity="' + op + '"/>';
      }
      s += '<text x="' + X0 + '" y="' + (CY - 92) + '" font-size="13" fill="' + VERDE + '">B</text>';

      // a sombra: faixa vertical que a espira projeta
      if (meia > 1) {
        s += '<line x1="' + (CX + 120) + '" y1="' + (CY - meia) + '" x2="' + (CX + 120) + '" y2="' + (CY + meia) +
          '" stroke="' + VERM + '" stroke-width="7" opacity=".3"/>';
      }
      s += '<text x="' + (CX + 130) + '" y="' + (CY + 4) + '" font-size="12" fill="' + VERM + '">sombra</text>';

      // a espira vista de cima: um segmento, mais os dois fios em corte
      s += '<line x1="' + (CX - dx) + '" y1="' + (CY + dy) + '" x2="' + (CX + dx) + '" y2="' + (CY - dy) +
        '" stroke="' + TINTA + '" stroke-width="4"/>';
      s += '<circle cx="' + (CX - dx) + '" cy="' + (CY + dy) + '" r="5" fill="' + TINTA + '"/>' +
        '<circle cx="' + (CX + dx) + '" cy="' + (CY - dy) + '" r="5" fill="' + TINTA + '"/>';

      // a normal da espira
      var nx = Math.cos(rad), ny = -Math.sin(rad);
      s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + (CX + nx * 46) + '" y2="' + (CY + ny * 46) +
        '" stroke="' + VERM + '" stroke-width="2" stroke-dasharray="4 3"/>' +
        '<text x="' + (CX + nx * 60) + '" y="' + (CY + ny * 60 + 4) + '" font-size="12" text-anchor="middle" fill="' + VERM + '">normal</text>';

      s += '<text x="' + X0 + '" y="214" font-size="11" fill="' + CINZA + '">espira vista de cima · verde: linha que atravessa · cinza: linha que escapa</text>';
      s += '<text x="' + (X1 - 10) + '" y="214" font-size="12" text-anchor="end" fill="' + TINTA + '">Φ = B·A·cos ' + t + '° = ' +
        (c < 0.001 ? '0' : (Math.round(c * 100) / 100).toString().replace('.', ',') + '·B·A') + '</text>';

      svg.innerHTML = s;
      vd.innerHTML = TEXTOS[t];
      Array.prototype.forEach.call(el.querySelectorAll('button.opc'), function (b) {
        b.setAttribute('aria-pressed', parseFloat(b.dataset.v) === t ? 'true' : 'false');
      });
    }

    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button.opc');
      if (!b) return;
      t = parseFloat(b.dataset.v);
      desenhar();
    });
    desenhar();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.fluxo'), montar);
})();
