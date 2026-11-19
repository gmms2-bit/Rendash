<p align="center"><img src="app/public/img/wordmark.png" alt="Rendash" height="56"></p>

<p align="center"><b>Super-app financeiro</b> · Seu patrimônio, em movimento</p>

<p align="center">
  <a href="https://rendash.gmms2.workers.dev/"><b>Abrir o protótipo</b></a> ·
  <a href="https://www.figma.com/design/1OCAwOXQ9xi7FRvUYwDWGv/Rendash---Prot%C3%B3tipo-interativo?node-id=228-243&p=f">Projeto no Figma</a>
</p>

## Sobre o projeto

O Rendash junta em um só aplicativo o patrimônio e os investimentos, os rendimentos, o mercado, as metas, o Open Finance (todas as contas de vários bancos em uma tela), o Pix, o cartão de crédito e a visão empresarial (PJ).

Este repositório traz o **protótipo interativo** do app e a **documentação do produto**. O protótipo roda no navegador e simula o iPhone. No computador, o app aparece dentro de um iPhone, com tela de bloqueio, tela inicial e Ilha Dinâmica. No celular, ocupa a tela inteira e pode ser instalado como app (PWA).

| | |
|---|---|
| **Trabalho** | Plano de Negócio · protótipo de aplicativo |
| **Instituição** | IFPE – Instituto Federal de Pernambuco, Campus Garanhuns |
| **Turma** | 4º TI · Tarde |
| **Professores** | Jair Galvão de Araújo · Heverton Rodrigo Gonçalves de Souza |
| **Autores** | Guilherme Matias de Melo Soares · Julio Mendes de Lira Alves |

## O que o protótipo mostra

- **Abertura do iPhone:** tela de bloqueio com notificações, tela inicial com widget e o ícone do Rendash, que se abre a partir do próprio ícone.
- **Acesso:** boas-vindas, login, Face ID, cadastro com código por SMS e criação de senha.
- **Investimentos:** patrimônio que conta até o valor, gráficos que se desenham, carteira, rendimentos, mercado com preços ao vivo, investir e resgatar com Face ID.
- **Open Finance:** conectar bancos, permissões, sincronização, falha de conexão e extrato unificado.
- **Pix e cartão:** enviar e cobrar com QR, comprovantes, fatura, controles do cartão e cartão virtual em 3D.
- **Empresa:** fluxo de caixa, cobranças e sócios.
- **Detalhes de iPhone:** Ilha Dinâmica que se expande ao confirmar Pix e investimentos, notificações do iOS, teclado do iOS, voltar arrastando da borda e sons nas interações.

Os dados são fictícios e iguais em todas as telas. Logos de bancos e empresas pertencem às suas marcas.

## Como rodar

Requisitos: Node.js 18 ou mais novo.

```bash
cd app
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a versão final em app/dist
```

## Tecnologias

React 18, Vite, Framer Motion (animações com mola), canvas-confetti, NumberFlow, lucide-react (ícones) e a fonte Inter. O endereço público é servido por um Cloudflare Worker a partir do branch `gh-pages`.

## Estrutura

```
app/            protótipo (React + Vite)
  src/screens/  telas: acesso, abas, investimentos, Open Finance, Pix, cartão e empresa
  src/ui.jsx    componentes: botões, listas, gráficos, contadores, Face ID
  public/       ícones, logos, manifesto do app e service worker
docs/           documentação do produto
  SPEC.md       visão geral e escopo
  TELAS.md      as 46 telas e o que cada uma tem
  DESIGN.md     cores, tipografia, raios e regras visuais
  ARQUITETURA.md, DADOS.md   arquitetura e modelo de dados planejados
  telas/ref/    as 46 telas originais do PDF
```

## Figma

O arquivo no Figma tem, na primeira página, as telas finais do protótipo, a capa do projeto e a identidade visual. As páginas seguintes guardam as versões anteriores do design.
