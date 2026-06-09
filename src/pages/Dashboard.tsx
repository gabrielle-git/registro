import { useState } from 'react'
import { differenceInDays } from 'date-fns'
import { Saudacao } from '@/components/dashboard/Saudacao'
import { BarraBusca } from '@/components/dashboard/BarraBusca'
import { AtalhosRapidos, type TipoAtalho } from '@/components/dashboard/AtalhosRapidos'
import { ResumoStats } from '@/components/dashboard/ResumoStats'
import { UltimasEntradas } from '@/components/dashboard/UltimasEntradas'
import { Modal } from '@/components/ui/Modal'
import { SetorForm } from '@/components/setor/SetorForm'
import { PessoaForm } from '@/components/pessoa/PessoaForm'
import { EntradaForm } from '@/components/entrada/EntradaForm'
import { useSetores } from '@/hooks/useSetores'
import { usePessoas } from '@/hooks/usePessoas'
import { useEntradas } from '@/hooks/useEntradas'
import { nomeCurtoSetor } from '@/types/setor'

export function Dashboard() {
  const { setores } = useSetores()
  const { pessoas } = usePessoas()
  const { entradas } = useEntradas()

  const [modalAberto, setModalAberto] = useState<TipoAtalho | null>(null)

  const setorAtual = setores.find((s) => !s.dataSaida)
  const diasNoSetor = setorAtual
    ? differenceInDays(new Date(), new Date(setorAtual.dataEntrada))
    : undefined

  const ultimaEntrada = [...entradas].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )[0]

  const fecharModal = () => setModalAberto(null)

  return (
    <div>
      <Saudacao
        nome="Gabrielle"
        setorAtual={setorAtual ? nomeCurtoSetor(setorAtual) : undefined}
        diasNoSetor={diasNoSetor}
      />

      <BarraBusca />

      <AtalhosRapidos aoClicar={(tipo) => setModalAberto(tipo)} />

      <ResumoStats
        qtdSetores={setores.length}
        qtdPessoas={pessoas.length}
        qtdEntradas={entradas.length}
        ultimaEntradaData={ultimaEntrada?.data}
      />

      <UltimasEntradas entradas={entradas} setores={setores} />

      {/* Modal de novo setor */}
      <Modal
        aberto={modalAberto === 'setor'}
        aoFechar={fecharModal}
        titulo="Novo setor"
        larguraMax="640px"
      >
        <SetorForm aoSalvar={fecharModal} aoCancelar={fecharModal} />
      </Modal>

      {/* Modal de nova pessoa */}
      <Modal
        aberto={modalAberto === 'pessoa'}
        aoFechar={fecharModal}
        titulo="Nova pessoa"
        larguraMax="640px"
      >
        <PessoaForm aoSalvar={fecharModal} aoCancelar={fecharModal} />
      </Modal>

      {/* Modal de nova entrada de diário */}
      <Modal
        aberto={modalAberto === 'entrada'}
        aoFechar={fecharModal}
        titulo="Nova entrada de diário"
        larguraMax="640px"
      >
        <EntradaForm aoSalvar={fecharModal} aoCancelar={fecharModal} />
      </Modal>

      {/* Avaliação virá no próximo passo */}
      <Modal
        aberto={modalAberto === 'avaliacao'}
        aoFechar={fecharModal}
        titulo="Avaliar setor"
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Em breve...
        </p>
      </Modal>
    </div>
  )
}