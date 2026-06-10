import { Modal } from '@/components/ui/Modal'

interface ModalConfirmacaoProps {
  aberto: boolean
  aoFechar: () => void
  aoConfirmar: () => void
  titulo: string
  mensagem: string
  textoBotao?: string
}

export function ModalConfirmacao({
  aberto,
  aoFechar,
  aoConfirmar,
  titulo,
  mensagem,
  textoBotao = 'Excluir',
}: ModalConfirmacaoProps) {
  return (
    <Modal aberto={aberto} aoFechar={aoFechar} titulo={titulo} larguraMax="440px">
      <p style={{
        fontSize: '14px',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
        marginBottom: '24px',
      }}>
        {mensagem}
      </p>
      <div
        className="flex justify-end gap-2 pt-4"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          type="button"
          onClick={aoFechar}
          className="px-4 py-2 rounded-md text-sm transition-colors hover:opacity-70"
          style={{ backgroundColor: 'transparent', color: 'var(--color-text-secondary)' }}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={aoConfirmar}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#dc2626', color: 'white' }}
        >
          {textoBotao}
        </button>
      </div>
    </Modal>
  )
}