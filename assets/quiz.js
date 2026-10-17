/* Quiz de correção imediata — componente compartilhado.
   Marcação esperada:

   <div class="quiz" id="quiz" data-fim="texto quando acerta tudo">
     <div class="questao" data-certa="0">
       <p>...enunciado...</p>
       <ul class="opcoes"><li><button type="button">...</button></li>...</ul>
       <div class="resposta" hidden><p>...</p></div>
     </div>
     <p class="placar" id="placar" hidden></p>
   </div>

   Cada questão responde uma vez só: trava as opções, pinta certa/errada e
   revela a explicação na hora. O placar aparece quando todas foram feitas. */

(function () {
  var quiz = document.getElementById('quiz');
  if (!quiz) return;

  var questoes = Array.prototype.slice.call(quiz.querySelectorAll('.questao'));
  var placar = document.getElementById('placar');
  var acertos = 0, feitas = 0;

  var fim = quiz.dataset.fim ||
    ' — todas certas. Isto mede fluência; o gate mede retenção.';
  var parcial = quiz.dataset.parcial ||
    ' — me diga quais você errou e em que raciocínio travou, antes do gate.';

  // Questão-ponte (data-ponte="1"): é de assunto ainda não ensinado, responde e
  // corrige normalmente, mas fica fora do placar. Ver 0007-o-limite-da-transferencia.
  var valem = questoes.filter(function (q) { return q.dataset.ponte !== '1'; }).length;

  questoes.forEach(function (q) {
    var certa = parseInt(q.dataset.certa, 10);
    var conta = q.dataset.ponte !== '1';
    var botoes = Array.prototype.slice.call(q.querySelectorAll('.opcoes button'));
    botoes.forEach(function (bt, i) {
      bt.addEventListener('click', function () {
        if (q.dataset.respondida) return;
        q.dataset.respondida = '1';
        feitas++;
        if (i === certa) { if (conta) acertos++; bt.classList.add('certa'); }
        else { bt.classList.add('errada'); botoes[certa].classList.add('certa'); }
        botoes.forEach(function (o) { o.disabled = true; });
        q.querySelector('.resposta').hidden = false;
        if (feitas === questoes.length && placar) {
          placar.hidden = false;
          placar.textContent = acertos + ' de ' + valem +
            (acertos === valem ? fim : parcial);
        }
      });
    });
  });
})();
