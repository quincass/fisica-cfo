/* Órbita de uma carga num campo uniforme — componente compartilhado.
   Fecha a lacuna anotada em RESOURCES.md (nenhum simulador bom de carga em
   círculo em português). Nasceu na aula 0022, Família II.

   Marcação esperada:
     <div class="bancada orbita"></div>

   Animado de propósito: período é tempo, e figura parada não mostra que o
   tempo de uma volta não muda quando a velocidade dobra (notas de 14/10).
   Campo entrando no papel (⊗), carga positiva: gira no sentido anti-horário.
   R = m·v ÷ (q·B)   T = 2π·m ÷ (q·B). Depende de bancada.css. */

(function () {
  var VERDE = '#0f6e56', VERM = '#993c1d', TINTA = '#1a1a18', CINZA = '#8b8a84';
  var CX = 220, CY = 150, R0 = 32, T0 = 2.4; // raio e período de referência (px, s)

  function montar(el) {
    var e = { v: 1, B: 1, m: 1 };
    var ang = Math.PI / 2, voltas = 0, tVolta = 0, ultimo = null, ultimaMedida = null;

    function grupo(k, rot) {
      return '<p class="legenda">' + rot + '</p><div class="botoes" data-k="' + k + '">' +
        '<button class="opc" type="button" data-v="1">× 1</button>' +
        '<button class="opc" type="button" data-v="2">× 2</button></div>';
    }
    el.innerHTML = grupo('v', 'Velocidade') + grupo('B', 'Campo B') + grupo('m', 'Massa') +
      '<svg viewBox="0 0 440 300" role="img" aria-label="Carga positiva girando em círculo num campo magnético que entra no papel"></svg>' +
      '<p class="veredito"></p>';
    var svg = el.querySelector('svg'), vd = el.querySelector('.veredito');

    function fundo() {
      var s = '';
      for (var x = 30; x < 440; x += 50) for (var y = 25; y < 300; y += 50) {
        s += '<g opacity=".28"><circle cx="' + x + '" cy="' + y + '" r="5" fill="none" stroke="' + CINZA + '"/>' +
          '<path d="M ' + (x - 3) + ' ' + (y - 3) + ' l 6 6 M ' + (x + 3) + ' ' + (y - 3) + ' l -6 6" stroke="' + CINZA + '"/></g>';
      }
      return s;
    }
    var FUNDO = fundo();

    function quadro() {
      var R = R0 * e.m * e.v / e.B;
      var px = CX + R * Math.cos(ang), py = CY + R * Math.sin(ang);
      // velocidade tangente (anti-horário na tela: ângulo diminuindo em coords de tela)
      var tx = Math.sin(ang), ty = -Math.cos(ang);
      var Lv = 22 + 12 * e.v, Lf = 26;
      var fx = (CX - px) / R, fy = (CY - py) / R;
      var s = FUNDO;
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="' + VERDE + '" stroke-width="1.5" stroke-dasharray="4 3"/>';
      s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + (CX + R) + '" y2="' + CY + '" stroke="' + CINZA + '" stroke-dasharray="2 2"/>' +
        '<text x="' + (CX + R / 2) + '" y="' + (CY - 5) + '" font-size="11" text-anchor="middle" fill="' + CINZA + '">R</text>';
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + tx * Lv) + '" y2="' + (py + ty * Lv) + '" stroke="' + TINTA + '" stroke-width="2.5"/>' +
        '<text x="' + (px + tx * (Lv + 8)) + '" y="' + (py + ty * (Lv + 8)) + '" font-size="12" fill="' + TINTA + '">v</text>';
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + fx * Lf) + '" y2="' + (py + fy * Lf) + '" stroke="' + VERM + '" stroke-width="2.5"/>' +
        '<text x="' + (px + fx * (Lf + 9)) + '" y="' + (py + fy * (Lf + 9)) + '" font-size="12" fill="' + VERM + '">F</text>';
      s += '<circle cx="' + px + '" cy="' + py + '" r="7" fill="' + VERM + '"/><text x="' + px + '" y="' + (py + 4) + '" font-size="11" text-anchor="middle" fill="#fff">+</text>';
      s += '<text x="12" y="292" font-size="11" fill="' + CINZA + '">⊗ campo entrando no papel · F sempre aponta para o centro e é perpendicular a v</text>';
      var tempo = (ultimaMedida === null ? '—' : ultimaMedida.toFixed(1).replace('.', ',') + ' s');
      s += '<text x="12" y="20" font-size="13" fill="' + TINTA + '">voltas: ' + voltas + ' · tempo da última volta: <tspan font-weight="700">' + tempo + '</tspan></text>';
      svg.innerHTML = s;
    }

    function texto() {
      var fR = e.m * e.v / e.B, fT = e.m / e.B;
      function f(x) { return x === 0.5 ? '½' : String(x); }
      var t = 'Raio: m·v ÷ B = ' + f(e.m) + '·' + f(e.v) + ' ÷ ' + f(e.B) + ' → <strong>' + f(fR) + '× o raio de referência</strong>. ' +
        'Período: m ÷ B = ' + f(e.m) + ' ÷ ' + f(e.B) + ' → <strong>' + f(fT) + '× o tempo de referência</strong>. ';
      if (e.v === 2) t += 'Repare: o círculo dobrou, mas o cronômetro da volta <strong>não mudou</strong>. Caminho dobrado, velocidade dobrada, mesmo tempo. A velocidade não entra no período.';
      else if (e.B === 2 && e.m === 1) t += 'Campo mais forte curva mais fechado <em>e</em> mais depressa: raio e período caem juntos.';
      else if (e.m === 2) t += 'Mais massa é mais inércia: mais difícil de virar, círculo maior e volta mais lenta.';
      else t += 'Mude só a velocidade e olhe o cronômetro.';
      vd.innerHTML = t;
      Array.prototype.forEach.call(el.querySelectorAll('.botoes'), function (g) {
        Array.prototype.forEach.call(g.querySelectorAll('button.opc'), function (b) {
          b.setAttribute('aria-pressed', parseFloat(b.dataset.v) === e[g.dataset.k] ? 'true' : 'false');
        });
      });
    }

    function passo(agora) {
      if (ultimo !== null) {
        var dt = Math.min(0.05, (agora - ultimo) / 1000);
        var T = T0 * e.m / e.B;
        ang -= 2 * Math.PI * dt / T;
        tVolta += dt;
        if (ang <= Math.PI / 2 - 2 * Math.PI) { ang += 2 * Math.PI; voltas++; ultimaMedida = tVolta; tVolta = 0; }
      }
      ultimo = agora;
      quadro();
      requestAnimationFrame(passo);
    }

    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('button.opc');
      if (!b) return;
      e[b.parentNode.dataset.k] = parseFloat(b.dataset.v);
      ang = Math.PI / 2; tVolta = 0; voltas = 0; ultimaMedida = null;
      texto();
    });
    texto();
    quadro(); // primeiro quadro na hora, sem esperar a animação começar
    requestAnimationFrame(passo);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.orbita'), montar);
})();
