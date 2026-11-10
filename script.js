/* ============================================
   TERMO LAB — Lógica JavaScript
   Sensores de Temperatura & Piscina CEP
   ============================================ */

// ============ PARTÍCULAS DO HERO ============
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    container.appendChild(p);
  }
}

// ============ HERO TEMP ANIMADA ============
function initHeroTemp() {
  const heroTemps = [27, 28, 26, 29, 27];
  let heroIdx = 0;
  const el = document.getElementById('heroTemp');
  if (!el) return;
  setInterval(() => {
    heroIdx = (heroIdx + 1) % heroTemps.length;
    el.textContent = heroTemps[heroIdx] + '°';
  }, 2000);
}

// ============ REVEAL ON SCROLL ============
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.id === 'chartBars' || e.target.querySelector('#chartBars')) {
          animateChart();
        }
        if (e.target.id === 'energyChart' || e.target.querySelector('#energyChart')) {
          animateEnergy();
        }
        if (e.target.querySelector('.stat-value')) {
          animateCounters(e.target);
        }
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
  const chartBars = document.getElementById('chartBars');
  if (chartBars) observer.observe(chartBars.parentElement);
  const energyChart = document.getElementById('energyChart');
  if (energyChart) observer.observe(energyChart);
}

// ============ CONVERSOR DE ESCALAS ============
function initConverter() {
  const convInput = document.getElementById('convInput');
  if (!convInput) return;

  function updateConv() {
    const c = parseFloat(convInput.value) || 0;
    const f = c * 9 / 5 + 32;
    const k = c + 273.15;
    document.getElementById('convC').textContent = c.toFixed(1) + ' °C';
    document.getElementById('convF').textContent = f.toFixed(1) + ' °F';
    document.getElementById('convK').textContent = k.toFixed(2) + ' K';
  }

  convInput.addEventListener('input', updateConv);
  updateConv();
}

// ============ SIMULADOR DE TERMÔMETRO ============
function initSimulator() {
  const simSlider = document.getElementById('simSlider');
  if (!simSlider) return;

  function updateSim() {
    const t = parseFloat(simSlider.value);
    const f = t * 9 / 5 + 32;
    const k = t + 273.15;

    document.getElementById('simTemp').textContent = t + '°C';
    document.getElementById('simF').textContent = f.toFixed(1) + ' °F';
    document.getElementById('simK').textContent = k.toFixed(2) + ' K';

    let color1, color2, status, state, energy;

    if (t < 0) {
      color1 = '#60a5fa'; color2 = '#93c5fd';
      status = '❄️ Congelando!';
      state = 'Sólido (Gelo) 🧊';
      energy = 'Muito baixa 🥶';
    } else if (t < 15) {
      color1 = '#60a5fa'; color2 = '#22d3ee';
      status = '🥶 Fria demais';
      state = 'Líquido 💧';
      energy = 'Baixa';
    } else if (t < 26) {
      color1 = '#22d3ee'; color2 = '#34d399';
      status = '💧 Fresca';
      state = 'Líquido 💧';
      energy = 'Moderada';
    } else if (t < 29) {
      color1 = '#34d399'; color2 = '#ffd166';
      status = '💧 Temperatura ideal para piscina';
      state = 'Líquido 💧';
      energy = 'Média ⚡';
    } else if (t < 40) {
      color1 = '#ffd166'; color2 = '#ff6b35';
      status = '🔥 Quente';
      state = 'Líquido 💧';
      energy = 'Alta 🔥';
    } else if (t < 100) {
      color1 = '#ff6b35'; color2 = '#ef4444';
      status = '⚠️ Muito quente!';
      state = 'Líquido 💧';
      energy = 'Altíssima 🔥';
    } else {
      color1 = '#ef4444'; color2 = '#dc2626';
      status = '💨 Ebulição!';
      state = 'Gasoso (Vapor) 💨';
      energy = 'Máxima 💥';
    }

    document.getElementById('simColor1').setAttribute('stop-color', color1);
    document.getElementById('simColor2').setAttribute('stop-color', color2);
    document.getElementById('simStatus').textContent = status;
    document.getElementById('simStatus').style.color = color1;
    document.getElementById('simTemp').style.color = color1;
    document.getElementById('simState').textContent = state;
    document.getElementById('simEnergy').textContent = energy;

    // Altura da coluna
    const min = -20, max = 100;
    const pct = (t - min) / (max - min);
    const col = document.getElementById('simColumn');
    col.setAttribute('y', 170 - pct * 140);
    col.setAttribute('height', pct * 140);
  }

  simSlider.addEventListener('input', updateSim);
  updateSim();
}

// ============ GRÁFICO COMPARATIVO DE SENSORES ============
function initChart() {
  const sensors = [
    { name: 'LM35', range: 70, precision: 85, cost: 95 },
    { name: 'DS18B20', range: 65, precision: 85, cost: 85 },
    { name: 'DHT22', range: 50, precision: 70, cost: 80 },
    { name: 'Termistor', range: 80, precision: 75, cost: 95 },
    { name: 'PT100', range: 95, precision: 98, cost: 40 },
    { name: 'Infravermelho', range: 85, precision: 80, cost: 55 },
  ];

  const chartBars = document.getElementById('chartBars');
  if (!chartBars) return;

  sensors.forEach(s => {
    const row = document.createElement('div');
    row.className = 'chart-row';
    row.innerHTML = `
      <div class="chart-label">${s.name}</div>
      <div class="chart-bars">
        <div class="chart-bar"><div class="chart-bar-fill range" data-width="${s.range}"></div></div>
        <div class="chart-bar"><div class="chart-bar-fill precision" data-width="${s.precision}"></div></div>
        <div class="chart-bar"><div class="chart-bar-fill cost" data-width="${s.cost}"></div></div>
      </div>
      <div class="chart-value">${s.range}%</div>
    `;
    chartBars.appendChild(row);
  });
}

function animateChart() {
  document.querySelectorAll('#chartBars .chart-bar-fill').forEach(el => {
    el.style.width = el.dataset.width + '%';
  });
}

// ============ CONTADORES ANIMADOS ============
function animateCounters(container) {
  container.querySelectorAll('.stat-value').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 30);
  });
}

// ============ DIAGRAMA INTERATIVO ============
function initDiagram() {
  document.querySelectorAll('.flow-step').forEach(step => {
    step.addEventListener('click', () => {
      document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
}

// ============ GRÁFICO DE ENERGIA ============
function animateEnergy() {
  document.querySelectorAll('#energyChart .bar').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.height = bar.dataset.height + '%';
    }, i * 200);
  });
}

// ============ TABS DE CÓDIGOS ============
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

// ============ QUIZ INTERATIVO ============
const questions = [
  {
    q: 'Qual sensor é ideal para medir temperatura dentro da água da piscina?',
    options: ['LM35', 'DS18B20', 'DHT11', 'Termistor comum'],
    correct: 1,
    explain: 'O DS18B20 é impermeável (versão TO-92) e foi projetado para medição submersa, sendo o mais adequado para piscinas.'
  },
  {
    q: 'Qual é a temperatura ideal para uma piscina olímpica segundo a FINA?',
    options: ['20-22°C', '24-25°C', '26-28°C', '30-32°C'],
    correct: 2,
    explain: 'A norma FINA recomenda 26-28°C para competições oficiais de natação, garantindo conforto térmico aos atletas.'
  },
  {
    q: 'Qual é a fórmula para converter Celsius em Fahrenheit?',
    options: ['F = C + 32', 'F = C × 9/5 + 32', 'F = C × 5/9 - 32', 'F = C × 2 + 30'],
    correct: 1,
    explain: 'A fórmula correta é F = C × 9/5 + 32. Exemplo: 27°C = 27 × 1.8 + 32 = 80.6°F'
  },
  {
    q: 'O que é o zero absoluto na escala Kelvin?',
    options: ['0°C', '100°C', '-273,15°C', '-40°C'],
    correct: 2,
    explain: 'O zero absoluto (0 K) equivale a -273,15°C, temperatura teórica onde o movimento molecular cessa completamente.'
  },
  {
    q: 'Qual tipo de sensor mede temperatura SEM contato físico?',
    options: ['PT100', 'LM35', 'Infravermelho (MLX90614)', 'Termistor NTC'],
    correct: 2,
    explain: 'Sensores infravermelhos detectam a radiação térmica emitida pelos objetos, permitindo medição à distância — usados em termômetros clínicos e industriais.'
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

function renderQuiz() {
  const prog = document.getElementById('quizProgress');
  prog.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const bar = document.createElement('div');
    bar.className = 'quiz-progress-bar';
    if (i < currentQ) bar.classList.add('done');
    else if (i === currentQ) bar.classList.add('current');
    prog.appendChild(bar);
  }

  const q = questions[currentQ];
  document.getElementById('quizQuestion').textContent = `${currentQ + 1}. ${q.q}`;

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    opts.appendChild(btn);
  });

  document.getElementById('quizFeedback').classList.remove('show');
  document.getElementById('quizNext').classList.remove('show');
  answered = false;
}

function selectAnswer(idx, btn) {
  if (answered) return;
  answered = true;
  const q = questions[currentQ];
  const opts = document.querySelectorAll('.quiz-option');

  opts.forEach((o, i) => {
    if (i === q.correct) o.classList.add('correct');
    else if (i === idx) o.classList.add('wrong');
  });

  if (idx === q.correct) score++;

  const fb = document.getElementById('quizFeedback');
  fb.textContent = (idx === q.correct ? '✅ Correto! ' : '❌ Incorreto. ') + q.explain;
  fb.style.borderLeftColor = idx === q.correct ? 'var(--green)' : 'var(--hot)';
  fb.classList.add('show');
  document.getElementById('quizNext').classList.add('show');
}

function showResult() {
  document.getElementById('quizContent').style.display = 'none';
  const r = document.getElementById('quizResult');
  r.classList.add('show');
  document.getElementById('quizScore').textContent = `${score}/${questions.length}`;

  let msg, desc;
  if (score === 5) {
    msg = '🏆 Mestre da Termometria!';
    desc = 'Você acertou tudo! Domínio completo dos sensores de temperatura.';
  } else if (score >= 3) {
    msg = '🎉 Muito bem!';
    desc = 'Você tem bons conhecimentos sobre sensores. Continue estudando!';
  } else {
    msg = '📚 Continue estudando!';
    desc = 'Revise os conceitos e tente novamente. A prática leva à perfeição!';
  }

  document.getElementById('quizMsg').textContent = msg;
  document.getElementById('quizDesc').textContent = desc;
}

function restartQuiz() {
  currentQ = 0;
  score = 0;
  document.getElementById('quizContent').style.display = 'block';
  document.getElementById('quizResult').classList.remove('show');
  renderQuiz();
}

function initQuiz() {
  const nextBtn = document.getElementById('quizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQ++;
      if (currentQ >= questions.length) showResult();
      else renderQuiz();
    });
  }

  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartQuiz);
  }

  renderQuiz();
}

// ============ MENU MOBILE (BURGER) ============
function initBurger() {
  const burger = document.querySelector('.burger');
  if (!burger) return;
  burger.addEventListener('click', () => {
    const ul = document.querySelector('nav ul');
    if (ul.style.display === 'flex') {
      ul.style.display = 'none';
      return;
    }
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.position = 'absolute';
    ul.style.top = '70px';
    ul.style.right = '6%';
    ul.style.background = 'var(--bg-2)';
    ul.style.padding = '20px';
    ul.style.borderRadius = '14px';
    ul.style.border = '1px solid var(--border)';
  });
}

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeroTemp();
  initReveal();
  initConverter();
  initSimulator();
  initChart();
  initDiagram();
  initTabs();
  initQuiz();
  initBurger();
});