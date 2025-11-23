const disciplinasIDs = [
  'icc', 'calculoI', 'gaal', 'empreendedorismo',
  'algProgramacao', 'calculoVV', 'algLinearComputacional', 'sistemasDigitais', 'matDiscreta',
  'aeds', 'gerenciaProjetos', 'metodologiaCient', 'arquiteturaI', 'introducaoTeoriaGrafos',
  'tecnicasBuscaOrdenacao', 'uceI', 'probEstatistica', 'arquiteturaII', 'poo',
  'organizacaoSistemasArquivos', 'pesquisaOperacional', 'engenhariaSoftware', 'sistemasOperacionais', 'desenvolvimentoWeb', 'projetoAnaliseAlg',
  'bancoDados', 'uceII', 'paradigmasProgramacao', 'algoritmosGrafos', 'complexidadeProblemasAproximacao',
  'gerenciamentoAplicacoesBD', 'computacaoGrafica', 'sistemasDistribuidos', 'redesComputadores', 'linguagensFormaisAutomatos',
  'introducaoIA', 'informaticaEticaSociedade', 'compiladores', 'optativaI',
  'projetoEstagioConclusaoCurso', 'optativaII', 'uceIII',
  'administracao', 'optativaIII',
];

let disciplinas = [];

const regras = [
  { requisitos: [0], libera: 4 },
  { requisitos: [1], libera: 5 },
  { requisitos: [2], libera: 6 },
  { requisitos: [4], libera: 9 },
  { requisitos: [4], libera: 20 },
  { requisitos: [5], libera: 16 },
  { requisitos: [6, 9], libera: 31 },
  { requisitos: [7], libera: 12 },
  { requisitos: [8], libera: 13 },
  { requisitos: [8, 14], libera: 24 },
  { requisitos: [8], libera: 34 },
  { requisitos: [9], libera: 14 },
  { requisitos: [9], libera: 25 },
  { requisitos: [9], libera: 27 },
  { requisitos: [9], libera: 35 },
  { requisitos: [9, 17, 34], libera: 37 },
  { requisitos: [9], libera: 18 },
  { requisitos: [9], libera: 19 },
  { requisitos: [12], libera: 17 },
  { requisitos: [12], libera: 22 },
  { requisitos: [13, 24], libera: 28 },
  { requisitos: [18], libera: 21 },
  { requisitos: [18], libera: 23 },
  { requisitos: [19, 25], libera: 30 },
  { requisitos: [21, 23], libera: 26 },
  { requisitos: [22], libera: 32 },
  { requisitos: [24], libera: 29 },
];

const semRequisitos = [0, 1, 2, 3, 7, 8, 10, 11, 15, 33, 36, 38, 39, 40, 41, 42, 43];

function estaSelecionada(disciplina) {
  return disciplina.classList.contains('selecionada');
}

function encontraDisciplinasSeguintes() {
  disciplinas.forEach((disciplina, i) => {
    disciplina.addEventListener('click', () => {
      disciplina.classList.toggle('selecionada');
      disciplina.classList.remove('liberada');

      regras.forEach(({ requisitos, libera }) => {
        const todasSelecionadas = requisitos.every(index => estaSelecionada(disciplinas[index]));
        const aindaNaoSelecionada = !estaSelecionada(disciplinas[libera]);

        disciplinas[libera].classList.toggle('liberada', todasSelecionadas && aindaNaoSelecionada);

        if (!todasSelecionadas) {
          disciplinas[libera].classList.remove('liberada');
        }
      });

      semRequisitos.forEach(index => {
        if (!estaSelecionada(disciplinas[index])) {
          disciplinas[index].classList.add('liberada');
        }
      });

      gerarGrafo();  // Atualiza grafo sempre que clicar
    });
  });
}

function encontraDisciplinasAnteriores() {
  disciplinas.forEach((disciplina, i) => {
    let todasNaoSelecionadas = [];
    disciplina.addEventListener('mouseenter', () => {
      if (estaSelecionada(disciplina)) return;

      const disciplinaLigada = regras.find(({ libera }) => libera == i);
      if (!disciplinaLigada) return;

      const { requisitos } = disciplinaLigada;

      todasNaoSelecionadas = requisitos.filter(index => !estaSelecionada(disciplinas[index]));

      if (!estaSelecionada(disciplinas[i])) {
        todasNaoSelecionadas.forEach((index) => {
          disciplinas[index].classList.add('faltando');
        });
      }
    });
    disciplina.addEventListener('mouseleave', () => {
      todasNaoSelecionadas.forEach((index) => {
        disciplinas[index].classList.remove('faltando');
      });
    });
  });
}

function gerarGrafo() {
  const nodes = disciplinas.map((disciplina, i) => {
    let color = '#f7e8f0';  // cor padrão liberada
    if (disciplina.classList.contains('selecionada')) color = '#c38d9e';
    else if (disciplina.classList.contains('liberada')) color = '#f7e8f0';
    else if (disciplina.classList.contains('faltando')) color = '#f4c4cf';
    else color = '#ddd';

    return {
      id: i,
      label: disciplina.querySelector('p')?.textContent || disciplina.id,
      color: {
        background: color,
        border: '#7a3451'
      },
      shape: 'ellipse',
      font: { color: '#5b2a5a', size: 14, face: 'Open Sans' }
    };
  });

  const edges = regras.flatMap(({ requisitos, libera }) => {
    return requisitos.map(req => ({
      from: req,
      to: libera,
      arrows: 'to',
      color: '#7a3451',
      font: { align: 'top' }
    }));
  });

  const container = document.getElementById('grafo');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: {
      borderWidth: 2,
      shapeProperties: {
        borderRadius: 15
      }
    },
    edges: {
      smooth: {
        type: 'curvedCW',
        roundness: 0.2
      }
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed'
      }
    },
    physics: {
      enabled: false
    }
  };

  if (container) {
    new vis.Network(container, data, options);
  }
}

window.onload = () => {
  disciplinas = disciplinasIDs.map(id => document.getElementById(id));
  encontraDisciplinasSeguintes();
  encontraDisciplinasAnteriores();
  gerarGrafo();
};
