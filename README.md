# JOPE Escola — Frontend

Versão do projeto: **2.0.1**

## Changelog — 2.0.1

### Novidades

- **Proativas — classificação Apontamento / Ocorrência**: select nos cards da grade de proativas (`GridProactive` / `Tasks`), visível apenas para **ADM** (`perfil_id === 1`); atualização via `PATCH task/{id}/classificacao_proativa` com feedback otimista.
- **Filtros múltiplos de OS**: utilitário `taskFilterParams.js` e correção em `GridTask` e `GridProactive` para filtros de status e tipo de OS com múltiplos valores.
- **Relatório plano de manutenção preventiva**: página `/relatorio_plano_manutencao` com filtros, serviço dedicado e item no menu Administrações.
- **Dias de criação de chamados**: página `/dias_criacao_chamados` para configurar dias da rota por unidade (menu Administrações).

### Impactos operacionais

- **Dependência de API**: classificação e novos relatórios exigem API **2.0.1** com migration `classificacao_proativa` aplicada.
- **Permissões**: apenas perfil **1** altera Apontamento/Ocorrência nos cards; demais perfis visualizam os cards sem o campo.
- **Relatórios exportados**: a coluna `apontamento_ocorrencia` passa a aparecer nos exports do sistema após atualização da API.

---

## Changelog — 2.0.0

### Novidades

- **Dashboard de diretor — aba Checklist**: substituição do embed do Power BI por um dashboard interno (**InspecPro**), alinhado ao layout de referência (KPIs, arco de percentual, gráfico de barras por unidade, painel com seletor e lista de pendentes, tema claro/escuro).
- **Integração com API**: método `getChecklistBiDashboard()` em `dashboardService`, consumindo `GET /api/dashboard/checklist-bi`.
- **Gráfico**: ApexCharts com alternância barras verticais/horizontais; até **13 unidades** sorteadas aleatoriamente no gráfico quando há mais unidades disponíveis; botão **Sortear outras** para novo sorteio sem recarregar a página; clique na barra seleciona a unidade no painel lateral.
- **Controle de acesso**: a aba “Checklist” e o bloco de abas só são exibidos para usuários com **`perfil_id === 1`** (`state.auth.user.perfil_id`).

### Impactos operacionais

- **Dependência de API**: a aba Checklist só funciona com a API na versão que expõe `/dashboard/checklist-bi` e com banco checklist configurado no servidor.
- **Autenticação**: as requisições usam o mesmo token JWT das demais rotas do dashboard.
- **Experiência do usuário**: perfis diferentes de 1 deixam de ver a aba Checklist; o fluxo da aba **Chamados** permanece como antes, sem barra de abas quando o checklist está oculto.
- **Pacotes**: continuação do uso de **react-apexcharts** já presente no projeto; não foi adicionado Chart.js.

## Scripts

- `npm start` — ambiente de desenvolvimento  
- `npm run build` — build de produção  

Consulte também o README da API correspondente para variáveis de ambiente e requisitos da view `vw_bi_checklist`.
