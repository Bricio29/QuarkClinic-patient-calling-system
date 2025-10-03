# QuarkClinic - Painel de Chamadas de Pacientes

## Visão Geral

O Painel de Chamadas QuarkClinic é uma solução moderna e elegante para gerenciamento de fluxo de pacientes em ambientes clínicos. Desenvolvido em **Angular**, o sistema foi projetado para ser exibido em telas de salas de espera, alternando entre a reprodução de vídeos institucionais e a chamada de pacientes para atendimento.

A interface é limpa e responsiva, garantindo uma experiência visual agradável e funcional. Quando não há pacientes a serem chamados, a tela exibe uma playlist de vídeos do YouTube em destaque. Ao realizar uma chamada, as informações do paciente (senha, nome, especialidade e guichê) são exibidas de forma proeminente, enquanto o vídeo é reposicionado em um quadro menor, sem interromper a reprodução.

## ✨ Funcionalidades Principais

- **Layout Dinâmico e Animado:** A transição entre o modo de exibição de vídeo e o modo de chamada é feita com animações suaves, proporcionando uma experiência de usuário fluida.
- **Player de Vídeo Integrado:** Utiliza o player do YouTube (`@angular/youtube-player`) para reproduzir uma playlist de vídeos em loop contínuo, ideal para conteúdo institucional.
- **Sistema de Chamadas:**
  - As chamadas podem ser acionadas manualmente através da tecla **"S"**.
  - Após 15 segundos, a tela de chamada é automaticamente dispensada, retornando o vídeo ao modo de destaque.
- **Histórico de Chamadas:** A barra lateral exibe as últimas 5 chamadas realizadas, mantendo os pacientes informados.
- **Controles de Acessibilidade:**
  - O som do vídeo pode ser ativado ou desativado com a tecla **"M"**.
  - A primeira interação do usuário (ao pressionar "S") ativa o som do vídeo, contornando as restrições de autoplay dos navegadores.
- **Exibição de Data e Hora:** O cabeçalho exibe a data e a hora atualizadas em tempo real.

## 🛠️ Tecnologias Utilizadas

- **[Angular](https://angular.io/) (v19):** Framework principal para a construção da aplicação.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática.
- **[RxJS](https://rxjs.dev/):** Para gerenciamento de eventos e programação reativa.
- **[Angular Animations](https://angular.io/guide/animations):** Para as transições de tela.
- **[SCSS](https://sass-lang.com/):** Para estilização avançada e organizada dos componentes.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[Angular CLI](https://angular.io/cli)** instalado globalmente: `npm install -g @angular/cli`

### Passos para Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Bricio29/QuarkClinic-patient-calling-system
    ```

2.  **Navegue até a pasta do projeto:**

    ```bash
    cd quarkclinic-patient-calling-system
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    ng serve
    ```

5.  **Acesse a aplicação:**

    - Abra seu navegador e vá para `http://localhost:4200/`.

A aplicação será iniciada e recarregada automaticamente sempre que houver alterações nos arquivos.
