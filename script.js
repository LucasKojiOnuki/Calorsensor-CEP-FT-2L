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
    simSlider.setAttribute('aria-valuenow', t);

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

    const min = -20, max = 100;
    const pct = (t - min) / (max - min);
    const col = document.getElementById('simColumn');
    col.setAttribute('y', 170 - pct * 140);
    col.setAttribute('height', pct * 140);
  }

  simSlider.addEventListener('input', updateSim);
  updateSim();
}

// ============ COMO FUNCIONA - DIAGRAMA ============
function initHowWorks() {
  document.querySelectorAll('.how-step').forEach(step => {
    const toggle = () => {
      const isActive = step.classList.contains('active');
      document.querySelectorAll('.how-step').forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        step.classList.add('active');
        step.setAttribute('aria-expanded', 'true');
      }
    };
    step.addEventListener('click', toggle);
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// ============ SIMULAÇÃO MOLECULAR ============
function initMolecular() {
  const canvas = document.getElementById('molecularCanvas');
  const slider = document.getElementById('molecularSlider');
  if (!canvas || !slider) return;

  const molecules = [];
  const NUM_MOLECULES = 25;

  // Criar moléculas
  for (let i = 0; i < NUM_MOLECULES; i++) {
    const mol = document.createElement('div');
    mol.className = 'molecule';
    canvas.appendChild(mol);
    molecules.push({
      el: mol,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });
  }

  let temperature = 30;
  let animationId;

  function updateMolecules() {
    const speedFactor = temperature / 30;
    const canvasRect = canvas.getBoundingClientRect();
    const w = canvasRect.width || 300;
    const h = canvasRect.height || 300;

    molecules.forEach(m => {
      // Atualizar posição
      m.x += m.vx * speedFactor;
      m.y += m.vy * speedFactor;

      // Colisão com bordas
      if (m.x <= 0 || m.x >= 95) m.vx *= -1;
      if (m.y <= 0 || m.y >= 95) m.vy *= -1;

      m.x = Math.max(0, Math.min(95, m.x));
      m.y = Math.max(0, Math.min(95, m.y));

      // Aplicar posição
      m.el.style.left = m.x + '%';
      m.el.style.top = m.y + '%';

      // Mudar cor conforme temperatura
      if (temperature < 20) {
        m.el.style.background = 'radial-gradient(circle at 30% 30%, #fff, #60a5fa 40%, #3b82f6)';
        m.el.style.boxShadow = '0 0 10px rgba(96, 165, 250, .6)';
      } else if (temperature < 50) {
        m.el.style.background = 'radial-gradient(circle at 30% 30%, #fff, #22d3ee 40%, #0ea5e9)';
        m.el.style.boxShadow = '0 0 10px rgba(34, 211, 238, .6)';
      } else if (temperature < 75) {
        m.el.style.background = 'radial-gradient(circle at 30% 30%, #fff, #ffd166 40%, #ff6b35)';
        m.el.style.boxShadow = '0 0 10px rgba(255, 107, 53, .6)';
      } else {
        m.el.style.background = 'radial-gradient(circle at 30% 30%, #fff, #ef4444 40%, #dc2626)';
        m.el.style.boxShadow = '0 0 15px rgba(239, 68, 68, .8)';
      }
    });

    animationId = requestAnimationFrame(updateMolecules);
  }

  function updateInfo() {
    const stateEl = document.getElementById('molState');
    const speedEl = document.getElementById('molSpeed');
    const energyEl = document.getElementById('molEnergy');

    let state, speed, energy;
    if (temperature < 10) {
      state = 'Sólido 🧊'; speed = 'Muito lenta'; energy = 'Mínima';
    } else if (temperature < 40) {
      state = 'Líquido 💧'; speed = 'Lenta'; energy = 'Baixa';
    } else if (temperature < 70) {
      state = 'Líquido 💧'; speed = 'Média'; energy = 'Moderada';
    } else if (temperature < 95) {
      state = 'Líquido quente 🔥'; speed = 'Rápida'; energy = 'Alta';
    } else {
      state = 'Gasoso 💨'; speed = 'Muito rápida'; energy = 'Máxima';
    }

    stateEl.textContent = state;
    speedEl.textContent = speed;
    energyEl.textContent = energy;
  }

  slider.addEventListener('input', () => {
    temperature = parseFloat(slider.value);
    updateInfo();
  });

  updateInfo();
  updateMolecules();
}

// ============ CALCULADORA DE AQUECIMENTO ============
function initCalculator() {
  const volumeInput = document.getElementById('calcVolume');
  const t1Input = document.getElementById('calcT1');
  const t2Input = document.getElementById('calcT2');
  const timeInput = document.getElementById('calcTime');

  if (!volumeInput || !t1Input || !t2Input || !timeInput) return;

  function formatNumber(num) {
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }

  function calculate() {
    const V = parseFloat(volumeInput.value) || 0; // litros
    const T1 = parseFloat(t1Input.value) || 0;
    const T2 = parseFloat(t2Input.value) || 0;
    const time = parseFloat(timeInput.value) || 1;

    const m = V * 1000; // massa em gramas (1L = 1000g)
    const c = 4.186; // calor específico da água em J/g°C
    const deltaT = T2 - T1;

    // Q = m * c * ΔT (em Joules)
    const Q_joules = m * c * deltaT;
    const Q_kcal = Q_joules / 4186; // 1 kcal = 4186 J
    const Q_kwh = Q_joules / 3600000; // 1 kWh = 3.600.000 J
    const power_kw = Q_kwh / time; // potência em kW
    const cost = Q_kwh * 0.80; // R$ 0,80 por kWh

    document.getElementById('resultEnergy').textContent = formatNumber(Q_joules);
    document.getElementById('resultKcal').textContent = formatNumber(Q_kcal);
    document.getElementById('resultKwh').textContent = formatNumber(Q_kwh);
    document.getElementById('resultPower').textContent = formatNumber(power_kw);
    document.getElementById('resultCost').textContent = 'R$ ' + formatNumber(cost);

    // Passos do cálculo
    const stepsEl = document.getElementById('calcSteps');
    stepsEl.innerHTML = `
      <div class="calc-step">
        <span class="calc-step-num">1</span>
        <code>m = ${V} L × 1000 = <strong>${formatNumber(m)} g</strong></code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">2</span>
        <code>ΔT = ${T2} - ${T1} = <strong>${formatNumber(deltaT)} °C</strong></code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">3</span>
        <code>Q = m·c·ΔT = ${formatNumber(m)} × 4,186 × ${formatNumber(deltaT)}</code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">4</span>
        <code>Q = <strong>${formatNumber(Q_joules)} J</strong> (${formatNumber(Q_kcal)} kcal)</code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">5</span>
        <code>Em kWh: ${formatNumber(Q_joules)} ÷ 3.600.000 = <strong>${formatNumber(Q_kwh)} kWh</strong></code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">6</span>
        <code>Potência: ${formatNumber(Q_kwh)} ÷ ${time}h = <strong>${formatNumber(power_kw)} kW</strong></code>
      </div>
      <div class="calc-step">
        <span class="calc-step-num">💰</span>
        <code>Custo: ${formatNumber(Q_kwh)} × R$ 0,80 = <strong>R$ ${formatNumber(cost)}</strong></code>
      </div>
    `;
  }

  [volumeInput, t1Input, t2Input, timeInput].forEach(input => {
    input.addEventListener('input', calculate);
  });

  // Presets de volume
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      volumeInput.value = btn.dataset.value;
      calculate();
    });
  });

  calculate(); // cálculo inicial
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

// ============ DIAGRAMA PISCINA ============
function initDiagram() {
  document.querySelectorAll('.flow-step').forEach(step => {
    const toggle = () => {
      const isActive = step.classList.contains('active');
      document.querySelectorAll('.flow-step').forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        step.classList.add('active');
        step.setAttribute('aria-expanded', 'true');
      }
    };
    step.addEventListener('click', toggle);
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
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
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
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
    q: 'Qual é a fórmula para calcular a energia necessária para aquecer água?',
    options: ['E = m·c·ΔT', 'E = m·g·h', 'E = P·t', 'E = V·I·t'],
    correct: 0,
    explain: 'A equação fundamental da calorimetria é Q = m·c·ΔT, onde m é a massa, c é o calor específico e ΔT é a variação de temperatura.'
  },
  {
    q: 'O que é o zero absoluto na escala Kelvin?',
    options: ['0°C', '100°C', '-273,15°C', '-40°C'],
    correct: 2,
    explain: 'O zero absoluto (0 K) equivale a -273,15°C, temperatura teórica onde o movimento molecular cessa completamente.'
  },
  {
    q: 'Qual princípio físico o sensor infravermelho utiliza?',
    options: ['Dilatação térmica', 'Efeito Seebeck', 'Radiação térmica (Stefan-Boltzmann)', 'Variação de resistência'],
    correct: 2,
    explain: 'Sensores infravermelhos detectam a radiação térmica emitida pelos objetos, baseada na Lei de Stefan-Boltzmann (E = ε·σ·T⁴).'
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
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
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
    o.setAttribute('aria-checked', i === idx ? 'true' : 'false');
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
      burger.setAttribute('aria-expanded', 'false');
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
    burger.setAttribute('aria-expanded', 'true');
  });
}

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHeroTemp();
  initReveal();
  initConverter();
  initSimulator();
  initHowWorks();
  initMolecular();
  initCalculator();
  initChart();
  initDiagram();
  initTabs();
  initQuiz();
  initBurger();
});