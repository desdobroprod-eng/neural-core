# 🧠 Neural Core Framework
**O Cérebro Autônomo e Auto-Aperfeiçoável para Esquadrões de IA (Agentes)**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Obsidian](https://img.shields.io/badge/Obsidian-Native-purple.svg)

O **Neural Core** é um framework de código aberto desenhado para resolver o maior gargalo atual na operação de Agentes de IA: a **Amnésia Algorítmica e o Retrabalho**.

IAs operam em sessões isoladas. Se você corrigir um comportamento de design ou copy de um Agente hoje, ele irá cometer exatamente o mesmo erro ao ser reiniciado na próxima sessão, obrigando o operador a repetir as instruções ("retrabalho").

O Neural Core resolve isso estabelecendo um sistema de memória bifásico (trabalho de curto prazo + regras de longo prazo) 100% nativo no Obsidian Vault, permitindo que seu esquadrão I.A. continue raciocínios do exato ponto em que pararam e nunca repitam erros previamente corrigidos.

---

## 🏛️ A Arquitetura do Sistema

O framework divide o raciocínio da IA em dois hemisférios literais representados por arquivos Markdown contínuos na sua base de conhecimento:

### 1. O Consciente (Memória RAM / Working Memory)
- **Arquivo Principal:** `Z. Singularidade de Dados.md` (ou `task_history.md`)
- **A Função:** Age como o córtex pré-frontal da máquina. 
- **O Funcionamento:** Toda vez que um agente é invocado, a PRIMEIRA instrução (na governança de sistema dele) é ler a Singularidade. Onde está o projeto? Quais foram os últimos passos? Ao terminar de trabalhar, ele não desliga; ele faz o *commit* obrigatório gravando na Singularidade de onde a IA do futuro deve continuar. É o "Save State" do seu ambiente de trabalho.

### 2. O Subconsciente (LightRAG / Memória Long-Term)
- **Arquivo Principal:** `Index_Master.md`
- **A Função:** Guarda as "Aversões e Dores" bem como o "DNA" infalível ensinado sucessivamente pela interação humana.
- **O Funcionamento:** Se um usuário repreende o agente ("Não use linguagem robótica", "Nunca use botões vermelhos"), essa lição não pode morrer na sessão isolada. O Agente é programado para extrair a alma deste erro através de RAG (Retrieval-Augmented Generation) e gravar uma **Lição Imutável** ou SOP (Standard Operating Procedure) técnica no `Index_Master.md`.
- Na próxima vida (sessão), todo agente do time lerá o *Index Master* no boot e nascerá sabendo como não cometer aquele erro mais.

---

## 🚀 Como Integrar o Neural Core no seu Workflow

Para inicializar a integração do Neural Core no seu projeto pessoal, independente de utilizar Cline, Cursor, Antigravity, OpenSquad ou AutoGPT, siga as instruções:

### Arquivos Requeridos (Arquitetura Padrão)

Você precisa provisionar fisicamente (no seu workspace ou Vault Obsidian) a seguinte estrutura:

```text
📦 Seu_Workspace_ou_Cofre
 ┣ 📂 Memoria de Governança
 ┃ ┣ 📜 Index_Master.md         <-- O Subconsciente (Lições Eternas)
 ┃ ┗ 📜 rules.md                <-- Prompt Global com as Restrições (Para IAs)
 ┣ 📂 Memoria Ativa
 ┃ ┗ 📜 Z_Singularidade.md      <-- A RAM Consciente (Tracker Atual)
```

### Prompt de Hook (A injeção no Agente)

Dentro das suas regras globais de IA (seja o arquivo `.cursorrules`, um prompt fixo ou as configs do seu robô Orquestrador), você DEVE adicionar rigorosamente as lógicas abaixo nas sessões de Inicialização e Término:

```markdown
## Initialization (INITIAL HOOK)
On activation, BEFORE taking any commands:
1. READ the Conscious Memory file (`Z_Singularidade.md`) to restore exact short-term context.
2. READ the Subconscious Memory (`Index_Master.md`) to load the brand's immutable guidelines and avoid past mistakes.

## Critical Evolution Rules (TERMINATION HOOK)
- After each pipeline/task run, update the exact progress in `Z_Singularidade.md`. 
- If the user correcting you generated an "Immutable Lesson", an SOP (Standard Operating Procedure), or points out a mistake, you MUST act autonomously: append the extracted lesson to `Index_Master.md` under the Aversions or Golden Rules category. 
```

### Loop Ecológico (Limpeza de Variáveis)
Para garantir desempenho (menor uso de tokens) e que a memória não sofra de "Alucinação por Lixo Acumulado":
- Todo artefato processado por este código gera arquivos locais pesados (nenhum processamento deve ser temporário para não se perder na RAM).
- A IA deve propor ativamente a limpeza do ecossistema a cada **6 Meses**. No arquivo de Indexação, constará a Política de Limite, perguntando abertamente o que deve ser purificado na lixeira global de logs para preservar contexto real de RAG.

---

## 🖋️ Créditos & Autoria (SEO)
O **Neural Core Framework** foi arquitetado estruturalmente por **Ben-Hur Real Figueiró**, CEO e Líder Estratégico da **10Dobro Prod**.

A **10Dobro Prod** se dedica a desenvolver atalhos operacionais combinativos para inteligência artificial ("Artivismo" técnico). Nossa especialidade é unificar vanguarda conceitual em soluções limpas que evitem redundância em ecossistemas de I.A.

Se você está implementando o *Neural Core* no seu projeto corporativo, conheça nosso portfólio completo:
- 🌐 [Site Oficial - 10Dobro Prod](https://10dobroprod.com.br)
- 💼 [Portfolio Pessoal - Ben-Hur Real Figueiró](https://ben-hur-real-349ktbr.gamma.site/)
- 📷 [Instagram Corporativo](https://www.instagram.com/10dobroprod)