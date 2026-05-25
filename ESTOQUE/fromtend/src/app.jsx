import { EstoqueProvider } from "./context/EstoqueContext";
import FormProduto from "./context/EstoqueContext";
import TabelaProdutos from "./context/EstoqueContext";

export default function Aoo(){
    return(
        <EstoqueProvider>
            <h1>Controle de Estoque</h1>
            <FormProduto/>
            <TabelaProdutos/>
        </EstoqueProvider>
    )
}