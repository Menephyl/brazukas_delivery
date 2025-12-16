# Guia de Deploy - Brazukas Delivery Frontend (Vercel)

Seu objetivo atual é colocar o **Frontend** no ar usando o **Vercel**.

Como você **não tem um backend rodando** (cancelamos o Render), a solução é rodar o site em **Modo de Demonstração (Mocks)**. Isso significa que o site vai funcionar visualmente, você poderá navegar, adicionar itens ao carrinho, mas os dados não serão salvos num banco de dados real.

## 🚀 Passo a Passo no Vercel

1. **Acesse**: [https://vercel.com/new](https://vercel.com/new)
2. **Importe**: Selecione seu repositório `brazukas_delivery`.
3. **Configure o Projeto**:

   * **Framework Preset**: Vite (Deve detectar automático)
   * **Root Directory**: `.` (Deixe o padrão)
   * **Build Command**: `npx vite build` (Ou o padrão `vite build`)
   * **Output Directory**: `dist/public` (⚠️ **Muito Importante**: Mude de `dist` para `dist/public`)
   * **Install Command**: `pnpm install`

4. **Environment Variables** (Variáveis de Ambiente):

   Adicione estas variáveis para que o site funcione sem backend:

   | Nome | Valor | Descrição |
   | :--- | :--- | :--- |
   | `VITE_USE_MOCK` | `true` | **Essencial**. Ativa o modo sem backend. |
   | `VITE_SUPABASE_URL` | `...` | Sua URL (opcional se usar mock total) |
   | `VITE_SUPABASE_ANON_KEY` | `...` | Sua Key (opcional se usar mock total) |

5. **Deploy**: Clique em **Deploy**.

## 🔄 Solução de Problemas

### 404 ao recarregar a página

Se você entrar em `/checkout` e der refresh e aparecer "404 Not Found", certifique-se de que o arquivo `vercel.json` está na raiz do projeto com o conteúdo que criamos.

### Site não carrega produtos

Verifique se `VITE_USE_MOCK` está setado como `true`. Sem backend e sem mock, o site vai tentar chamar uma API que não existe.
