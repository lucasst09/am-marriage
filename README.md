# Site de Casamento A & M

Site para confirmação de presença no casamento de André & Marilene.

## Funcionalidades

- ✅ Confirmação de presença online
- ✅ Gestão de acompanhantes
- ✅ Persistência de dados no localStorage
- ✅ Área administrativa com senha
- ✅ Exportação de lista para PDF
- ✅ Estatísticas em tempo real

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

## Acesso Administrativo

- **URL**: Acesse o site e clique no botão ⚙️ no canto inferior direito
- **Senha padrão**: `admin123`
- **Funcionalidades**:
  - Visualizar todas as confirmações
  - Exportar lista para PDF
  - Ver estatísticas em tempo real
  - Limpar todas as confirmações (cuidado!)

## Estrutura do Projeto

```
src/
├── view/
│   ├── WeddingSite.jsx    # Página principal do site
│   └── AdminPage.jsx      # Página administrativa
├── data/
│   └── mockData.js        # Dados dos convidados e funções de persistência
├── css/
│   └── weddingSite/
│       └── WeddingSite.css # Estilos do site
└── assets/
    └── img/               # Imagens do site
```

## Personalização

### Adicionar/Remover Convidados

Edite o arquivo `src/data/mockData.js` e modifique o objeto `mockData`:

```javascript
export const mockData = {
  "nome_convidado": {
    nome: "Nome Completo",
    dependentes: [
      { id: 1, nome: "Acompanhante 1", tipo: "dependente" },
      { id: 2, nome: "Acompanhante 2", tipo: "dependente" }
    ]
  }
};
```

### Alterar Senha Administrativa

Edite o arquivo `src/view/AdminPage.jsx` e modifique a constante `SENHA_ADMIN`.

## Tecnologias Utilizadas

- React 19
- Vite
- jsPDF (para exportação de PDF)
- CSS3
- localStorage (para persistência)

## Deploy

Para fazer o build de produção:

```bash
npm run build
```

Os arquivos estarão na pasta `dist/` prontos para deploy.

## Resumo das Funcionalidades Implementadas

✅ **Página de Administração Completa**:
- Login com senha (padrão: `admin123`)
- Dashboard com estatísticas em tempo real
- Tabela com todas as confirmações
- Botão para exportar PDF com lista completa

✅ **Exportação para PDF**:
- Lista organizada com todos os dados
- Estatísticas resumidas
- Formatação profissional
- Nome do arquivo com data

✅ **Navegação**:
- Botão flutuante para acessar admin
- Botão para voltar ao site principal
- Interface intuitiva

✅ **Funcionalidades Administrativas**:
- Visualizar confirmações em tempo real
- Atualizar lista
- Limpar todas as confirmações
- Estatísticas: total de confirmações, quem vai/não vai, acompanhantes

**Para usar:**
1. Execute `npm install` para instalar a biblioteca jsPDF
2. Acesse o site normalmente
3. Clique no botão ⚙️ no canto inferior direito
4. Digite a senha `admin123`
5. Clique em "Exportar para PDF" para baixar a lista

A lista do PDF incluirá:
- Nome do convidado
- Status (vai/não vai)
- Telefone
- Acompanhantes confirmados
- Observações
- Data da confirmação
- Resumo com totais

Agora você tem um sistema completo de confirmação de presença com área administrativa e exportação para PDF! 🎉

   